export function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const clean = cell ? cell.toString().replace(/"/g, '""') : '';
          // Wrap cell in double quotes if it contains comma, newline or quotes
          return clean.includes(',') || clean.includes('\n') || clean.includes('"')
            ? `"${clean}"`
            : clean;
        })
        .join(','),
    ),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export default exportToCSV;
