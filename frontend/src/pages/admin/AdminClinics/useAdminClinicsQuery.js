import apiCall from '../../../utils/apiCall';
export async function fetchAllClinics() { return apiCall('GET', '/admin/clinics'); }
