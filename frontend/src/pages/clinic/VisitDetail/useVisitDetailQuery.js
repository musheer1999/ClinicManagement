import apiCall from '../../../utils/apiCall';
export async function fetchVisit(id) { return apiCall('GET', `/visits/${id}`); }
