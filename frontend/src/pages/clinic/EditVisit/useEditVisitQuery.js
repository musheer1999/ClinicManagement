import apiCall from '../../../utils/apiCall';
export async function fetchVisit(id) { return apiCall('GET', `/visits/${id}`); }
export async function updateVisit(id, data) { return apiCall('PUT', `/visits/${id}`, data); }
