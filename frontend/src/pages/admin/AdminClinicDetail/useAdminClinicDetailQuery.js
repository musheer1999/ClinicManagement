import apiCall from '../../../utils/apiCall';
export async function fetchClinic(id) { return apiCall('GET', `/admin/clinics/${id}`); }
export async function updateSubscription(id, data) { return apiCall('PUT', `/admin/clinics/${id}/subscription`, data); }
export async function updateCustomPrice(id, custom_price) { return apiCall('PUT', `/admin/clinics/${id}/price`, { custom_price }); }
