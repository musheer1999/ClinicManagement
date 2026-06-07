import apiCall from '../../../utils/apiCall';
export async function fetchDashboard() { return apiCall('GET', '/visits/dashboard'); }
