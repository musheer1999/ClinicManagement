import apiCall from '../../../utils/apiCall';
export async function fetchPatientWithVisits(id) { return apiCall('GET', `/patients/${id}`); }
