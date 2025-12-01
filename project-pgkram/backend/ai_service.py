from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
import json
import re
from typing import Dict, List, Any, Optional
from config import (
    SYSTEM_PROMPT,
    GITHUB_MODELS_ENDPOINT,
    GITHUB_MODELS_MODEL,
    GITHUB_TOKEN,
)
from database import db_manager

class AIService:
    def __init__(self):
        self.client = ChatCompletionsClient(
            endpoint=GITHUB_MODELS_ENDPOINT,
            credential=AzureKeyCredential(GITHUB_TOKEN),
        )
        self.system_prompt = SYSTEM_PROMPT
    
    async def extract_search_criteria(self, user_message: str) -> Dict[str, str]:
        """Extract job search criteria from user message using LLM"""
        try:
            # Use LLM to extract criteria
            extraction_prompt = f"""
            Extract job search criteria from this user message: "{user_message}"
            
            Return ONLY a JSON object with these possible fields:
            - job_type: "Government" or "Private" (if mentioned)
            - qualification: "12th Pass", "Graduate", "Post Graduate", or "Others" (if mentioned)
            - experience: "0-2 years", "2-5 years", "5-10 years", or "10+ years" (if mentioned)
            - district: Any Punjab district name (if mentioned)
            - keywords: A short role or keyword like "clerk", "accountant", etc. (if mentioned)
            
            Examples:
            - "less than 2 years" or "under 2 years" or "0-2 years" or "fresher" → "0-2 years"
            - "2 to 5 years" or "2-5 years" → "2-5 years"
            - "5 to 10 years" or "5-10 years" → "5-10 years"
            - "10+ years" or "more than 10 years" → "10+ years"
            
            If no criteria are found, return an empty JSON object: {{}}
            
            Return only the JSON, no other text.
            """
            
            response = self.client.complete(
                messages=[
                    SystemMessage("You are a job search criteria extraction assistant. Extract criteria from user messages and return only valid JSON."),
                    UserMessage(extraction_prompt),
                ],
                model=GITHUB_MODELS_MODEL,
            )
            
            # Parse the JSON response
            criteria_text = response.choices[0].message.content.strip()
            # Remove any markdown formatting
            if criteria_text.startswith('```json'):
                criteria_text = criteria_text.replace('```json', '').replace('```', '').strip()
            elif criteria_text.startswith('```'):
                criteria_text = criteria_text.replace('```', '').strip()
            
            criteria = json.loads(criteria_text)
            return criteria
            
        except Exception as e:
            masked = f"{(GITHUB_TOKEN or '')[:6]}...{(GITHUB_TOKEN or '')[-4:]}" if GITHUB_TOKEN else "MISSING"
            print(f"Error in LLM criteria extraction: {e} | GitHub token (masked): {masked}")
            # Fallback to simple rule-based extraction
            return self._fallback_criteria_extraction(user_message)
    
    def _fallback_criteria_extraction(self, user_message: str) -> Dict[str, str]:
        """Fallback rule-based criteria extraction"""
        criteria = {}
        
        # Job type extraction
        if any(word in user_message.lower() for word in ['government', 'gov', 'govt']):
            criteria['job_type'] = 'Government'
        elif any(word in user_message.lower() for word in ['private', 'company', 'corporate']):
            criteria['job_type'] = 'Private'
        
        # Qualification extraction
        if any(word in user_message.lower() for word in ['12th', 'twelfth', 'high school']):
            criteria['qualification'] = '12th Pass'
        elif any(word in user_message.lower() for word in ['graduate', 'bachelor', 'degree']):
            criteria['qualification'] = 'Graduate'
        elif any(word in user_message.lower() for word in ['post graduate', 'master', 'mba', 'phd']):
            criteria['qualification'] = 'Post Graduate'
        
        # Experience extraction
        user_lower = user_message.lower()
        if any(phrase in user_lower for phrase in ['less than 2', 'under 2', '0 to 2', '0-2', 'fresher', 'entry level', 'no experience', 'less than 2 yrs', 'under 2 yrs']):
            criteria['experience'] = '0-2 years'
        elif any(phrase in user_lower for phrase in ['2-5', '2 to 5', '2-5 years', 'experienced']):
            criteria['experience'] = '2-5 years'
        elif any(phrase in user_lower for phrase in ['5-10', '5 to 10', '5-10 years', 'senior']):
            criteria['experience'] = '5-10 years'
        elif any(phrase in user_lower for phrase in ['10+', '10 plus', '10+ years', 'expert']):
            criteria['experience'] = '10+ years'
        
        # Keywords / role extraction
        for kw in ['clerk', 'accountant', 'assistant', 'engineer', 'developer', 'teacher', 'nurse', 'operator', 'data entry']:
            if kw in user_message.lower():
                criteria['keywords'] = kw
                break

        # Location extraction (Punjab districts)
        punjab_districts = [
            'amritsar', 'ludhiana', 'jalandhar', 'patiala', 'bathinda',
            'moga', 'sangrur', 'kapurthala', 'hoshiarpur', 'gurdaspur',
            'ropar', 'mohali', 'fatehgarh sahib', 'muktsar', 'mansa',
            'barnala', 'faridkot', 'ferozepur', 'pathankot', 'tarn taran',
            'fazilka', 'muktsar sahib', 'malerkotla', 'nawanshahr', 'rupnagar'
        ]
        
        for district in punjab_districts:
            if district in user_message.lower():
                criteria['district'] = district.title()
                break
        
        return criteria
    
    def format_jobs_for_ai(self, jobs: List[Dict[str, Any]]) -> str:
        """Format job data for AI consumption"""
        if not jobs:
            return "No jobs found matching the criteria."
        
        formatted_jobs = []
        for job in jobs:
            job_info = f"""
            • {job['job_title']} at {job['organization_name']}
              Location: {job['district_name']} {f"({job['taluk_name']})" if job['taluk_name'] else ""}
              Salary: ₹{job['salary_min']:,.0f} - ₹{job['salary_max']:,.0f}
              Experience: {job['experience_level']}
              Qualification: {job['qualification']}
              Vacancies: {job['total_vacancies']}
              Deadline: {job['application_deadline']}
            """
            formatted_jobs.append(job_info.strip())
        
        return "\n\n".join(formatted_jobs)
    
    async def generate_response(self, user_message: str, session_id: str) -> str:
        """Generate AI response based on user message"""
        try:
            # Extract search criteria from user message
            criteria = await self.extract_search_criteria(user_message)
            
            # Search for relevant jobs if criteria found
            jobs = []
            if criteria:
                jobs = await db_manager.search_jobs(
                    job_type=criteria.get('job_type'),
                    qualification=criteria.get('qualification'),
                    district=criteria.get('district'),
                    experience=criteria.get('experience'),
                    keywords=criteria.get('keywords'),
                    limit=5
                )
            
            # Get job statistics for context
            stats = await db_manager.get_job_statistics()
            
            # Prepare context for AI
            context = f"""
            Current Job Statistics:
            - Government Jobs: {stats.get('gov_jobs', 0)}
            - Private Jobs: {stats.get('private_jobs', 0)}
            - Total Districts: {stats.get('total_districts', 25)}
            - Total Employers: {stats.get('total_employers', 0)}
            
            User's search criteria: {json.dumps(criteria) if criteria else 'General inquiry'}
            
            Relevant jobs found:
            {self.format_jobs_for_ai(jobs)}
            """
            
            # Get recent chat history for context
            chat_history = await db_manager.get_chat_history(session_id, limit=5)
            history_context = ""
            if chat_history:
                history_context = "\n\nRecent conversation:\n"
                for msg in reversed(chat_history):
                    role = "User" if msg['message_type'] == 'user' else "Assistant"
                    history_context += f"{role}: {msg['content']}\n"
            
            # Create messages for AI
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "system", "content": f"Context: {context}"},
            ]
            
            if history_context:
                messages.append({"role": "system", "content": history_context})
            
            messages.append({"role": "user", "content": user_message})
            
            completion_messages = [
                SystemMessage(self.system_prompt),
                SystemMessage(f"Context: {context}"),
            ]
            if history_context:
                completion_messages.append(SystemMessage(history_context))
            completion_messages.append(UserMessage(user_message))

            response = self.client.complete(
                messages=completion_messages,
                model=GITHUB_MODELS_MODEL,
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Save the conversation
            await db_manager.save_chat_message(session_id, 'user', user_message)
            await db_manager.save_chat_message(session_id, 'bot', ai_response, {
                'criteria_used': criteria,
                'jobs_found': len(jobs),
                'model_used': GITHUB_MODELS_MODEL
            })
            
            return ai_response
            
        except Exception as e:
            masked = f"{(GITHUB_TOKEN or '')[:6]}...{(GITHUB_TOKEN or '')[-4:]}" if GITHUB_TOKEN else "MISSING"
            print(f"Error generating AI response: {e} | GitHub token (masked): {masked}")
            # Fallback response system when OpenAI quota is exceeded
            return await self.generate_fallback_response(user_message, session_id)
    
    async def generate_fallback_response(self, user_message: str, session_id: str) -> str:
        """Generate fallback response when OpenAI API is not available"""
        try:
            # Extract search criteria from user message
            criteria = await self.extract_search_criteria(user_message)
            
            # Search for relevant jobs if criteria found
            jobs = []
            if criteria:
                print(f"Search criteria: {criteria}")  # Debug output
                jobs = await db_manager.search_jobs(
                    job_type=criteria.get('job_type'),
                    qualification=criteria.get('qualification'),
                    district=criteria.get('district'),
                    experience=criteria.get('experience'),
                    limit=5
                )
                print(f"Found {len(jobs)} jobs")  # Debug output
            
            # Get job statistics for context
            stats = await db_manager.get_job_statistics()
            
            # Generate intelligent fallback response
            if jobs:
                response = f"I found {len(jobs)} jobs matching your criteria:\n\n"
                for i, job in enumerate(jobs[:3], 1):  # Show top 3 jobs
                    response += f"{i}. {job['job_title']} at {job['organization_name']}\n"
                    response += f"   Location: {job['district_name']}\n"
                    response += f"   Salary: ₹{job['salary_min']:,.0f} - ₹{job['salary_max']:,.0f}\n"
                    response += f"   Experience: {job['experience_level']}\n"
                    response += f"   Qualification: {job['qualification']}\n\n"
                
                if len(jobs) > 3:
                    response += f"... and {len(jobs) - 3} more jobs available!\n\n"
                
                response += "💡 **Tips for job searching:**\n"
                response += "• Be specific about your location and qualification\n"
                response += "• Check application deadlines\n"
                response += "• Apply early for better chances\n"
                response += "• Keep your resume updated\n\n"
                response += "Would you like to know more about any specific job or need help with applications?"
                
            else:
                # General response when no specific jobs found
                response = f"Welcome to Punjab Job Portal! 🎯\n\n"
                response += f"**Current Statistics:**\n"
                response += f"• Government Jobs: {stats.get('gov_jobs', 0)}\n"
                response += f"• Private Jobs: {stats.get('private_jobs', 0)}\n"
                response += f"• Total Districts: {stats.get('total_districts', 25)}\n\n"
                
                response += "**How to search for jobs:**\n"
                response += "• 'Find government jobs in Ludhiana'\n"
                response += "• 'Show me software developer positions'\n"
                response += "• 'I need jobs for graduates in Amritsar'\n"
                response += "• 'What are the highest paying jobs?'\n\n"
                
                response += "**Available Job Types:**\n"
                response += "• Government Jobs\n"
                response += "• Private Sector Jobs\n\n"
                
                response += "**Qualifications:**\n"
                response += "• 12th Pass\n"
                response += "• Graduate\n"
                response += "• Post Graduate\n\n"
                
                response += "How can I help you find your dream job today? 😊"
            
            # Save the conversation
            await db_manager.save_chat_message(session_id, 'user', user_message)
            await db_manager.save_chat_message(session_id, 'bot', response, {
                'criteria_used': criteria,
                'jobs_found': len(jobs),
                'model_used': 'fallback_system'
            })
            
            return response
            
        except Exception as e:
            print(f"Error in fallback response: {e}")
            return "I'm here to help you find jobs in Punjab! Please try asking about specific job types, locations, or qualifications. For example: 'Find government jobs in Ludhiana' or 'Show me software developer positions'."
    
    async def get_general_info(self) -> str:
        """Get general information about the job portal"""
        stats = await db_manager.get_job_statistics()
        
        return f"""
        Welcome to the Punjab Job Portal! 🎯
        
        Here's what I can help you with:
        
        📊 **Current Statistics:**
        • Government Jobs: {stats.get('gov_jobs', 0)}
        • Private Jobs: {stats.get('private_jobs', 0)}
        • Total Districts: {stats.get('total_districts', 25)}
        • Total Employers: {stats.get('total_employers', 0)}
        
        🔍 **How to search for jobs:**
        • "Find government jobs in Ludhiana"
        • "Show me software developer positions for graduates"
        • "What are the highest paying jobs in Punjab?"
        • "I need 2-5 years experience jobs in Amritsar"
        
        💡 **Tips:**
        • Be specific about your location (district)
        • Mention your qualification level
        • Include your experience level
        • Ask about salary ranges or benefits
        
        How can I help you find your dream job today? 😊
        """

# Global AI service instance
ai_service = AIService()


