import apiCall from '../../../utils/apiCall';
export async function fetchPatient(id) { return apiCall('GET', `/patients/${id}`); }
export async function createPatient(data) { return apiCall('POST', '/patients', data); }
export async function updatePatient(id, data) { return apiCall('PUT', `/patients/${id}`, data); }
