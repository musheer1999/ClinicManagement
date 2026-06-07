import apiCall from '../../../utils/apiCall';
export async function fetchConfig() { return apiCall('GET', '/admin/config'); }
export async function saveConfig(data) { return apiCall('PUT', '/admin/config', data); }
