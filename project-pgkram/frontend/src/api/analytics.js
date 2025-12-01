import { apiRequest } from '../utils/api';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function fetchJobStats(signal) {
  try {
    return await apiRequest(`${BASE_URL}/api/jobs/stats`, { signal }, 15000);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw AbortError as-is
    }
    throw new Error(`Failed to fetch job stats: ${error.message}`);
  }
}

export async function searchJobs(payload, signal) {
  try {
    return await apiRequest(`${BASE_URL}/api/jobs/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    }, 15000);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw AbortError as-is
    }
    throw new Error(`Failed to search jobs: ${error.message}`);
  }
}

export async function fetchTrends(months = 6, signal) {
  try {
    return await apiRequest(`${BASE_URL}/api/analytics/trends?months=${months}`, { signal }, 15000);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw AbortError as-is
    }
    throw new Error(`Failed to fetch trends: ${error.message}`);
  }
}

export async function fetchTopDistricts(limit = 5, signal) {
  try {
    return await apiRequest(`${BASE_URL}/api/analytics/top-districts?limit=${limit}`, { signal }, 15000);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw AbortError as-is
    }
    throw new Error(`Failed to fetch top districts: ${error.message}`);
  }
}

export async function fetchSalaryDistribution(signal) {
  try {
    return await apiRequest(`${BASE_URL}/api/analytics/salary-distribution`, { signal }, 15000);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw AbortError as-is
    }
    throw new Error(`Failed to fetch salary distribution: ${error.message}`);
  }
}

export async function fetchTopOrganizations(limit = 5, signal) {
  try {
    return await apiRequest(`${BASE_URL}/api/analytics/top-organizations?limit=${limit}`, { signal }, 15000);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw AbortError as-is
    }
    throw new Error(`Failed to fetch top organizations: ${error.message}`);
  }
}


