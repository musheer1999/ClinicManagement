import { API_URL } from './apiCall';

// Triggers a browser download of a visit's PDF report.
// Uses API_URL so it works in every environment (dev proxy or hosted API).
export function downloadVisitPdf(visitId, filename = 'ClinicDesk-Report.pdf') {
  const link = document.createElement('a');
  link.href = `${API_URL}/visits/${visitId}/pdf`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
