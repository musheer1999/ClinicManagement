import apiCall from '../../../utils/apiCall';
export async function createVisit(data) { return apiCall('POST', '/visits', data); }
export async function fetchPatientBasic(id) { return apiCall('GET', `/patients/${id}`); }
