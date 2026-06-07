import apiCall from '../../../utils/apiCall';
export async function fetchPatients(search) { return apiCall('GET', `/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`); }
