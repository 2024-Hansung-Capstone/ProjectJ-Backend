export function setDateFormat(year: string, month: string, day: string): Date {
  const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(
    2,
    '0',
  )}T00:00:00.000Z`;
  return new Date(dateString);
}
