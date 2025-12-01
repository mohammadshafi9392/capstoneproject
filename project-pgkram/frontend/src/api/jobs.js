import { apiRequest } from '../utils/api';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
};

export async function fetchJobFilters(signal) {
  return apiRequest(`${BASE_URL}/api/jobs/filters`, { signal }, 15000);
}

export async function fetchJobs(params = {}, signal) {
  const qs = buildQueryString(params);
  return apiRequest(`${BASE_URL}/api/jobs${qs}`, { signal }, 15000);
}

export async function fetchJobDetail(jobId, signal) {
  if (!jobId) {
    throw new Error('Job ID is required');
  }
  return apiRequest(`${BASE_URL}/api/jobs/${jobId}`, { signal }, 15000);
}

export async function applyToJob(jobId, payload, signal) {
  if (!jobId) {
    throw new Error('Job ID is required');
  }
  return apiRequest(`${BASE_URL}/api/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  }, 15000);
}

export async function fetchApplications(params = {}, signal) {
  const qs = buildQueryString(params);
  return apiRequest(`${BASE_URL}/api/jobs/applications${qs}`, { signal }, 15000);
}

