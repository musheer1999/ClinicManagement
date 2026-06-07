import apiCall from '../../../utils/apiCall';
export async function fetchClinic() { return apiCall('GET', '/clinic/me'); }
export async function updateClinic(data) { return apiCall('PUT', '/clinic/me', data); }
export async function fetchGlobalConfig() { return apiCall('GET', '/admin/config'); }
