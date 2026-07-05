export class LogAttendanceDto {
  facilityId?: string;
  userId: string;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  status?: 'Present' | 'Absent' | 'Leave';
}
