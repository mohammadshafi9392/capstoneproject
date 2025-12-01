#!/usr/bin/env python3
"""
Test OpenAI API connection
"""

import openai
from config import OPENAI_API_KEY

def test_openai():
    try:
        print("Testing OpenAI API connection...")
        
        # Initialize OpenAI client
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        # Test with a simple completion
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Hello, are you working?"}
            ],
            max_tokens=50
        )
        
        print("✅ OpenAI API is working!")
        print(f"Response: {response.choices[0].message.content}")
        return True
        
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return False

if __name__ == "__main__":
    test_openai()
