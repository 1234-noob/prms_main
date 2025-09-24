export function excelDateToIsoString(excelDate: number): string {
  const startDate = new Date(1900, 0, 1); // Excel starts on Jan 1, 1900
  const time = (excelDate - 25569) * 86400 * 1000; // Convert to milliseconds
  return new Date(time).toISOString().split('T')[0]; 
}