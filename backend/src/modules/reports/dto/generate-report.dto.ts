export class GenerateReportDto {
  facilityId?: string;
  reportType: 'Daily' | 'Weekly' | 'Monthly' | 'Inventory' | 'Attendance';
  fileUrl?: string;
  status?: 'Pending' | 'Completed' | 'Failed';
}
