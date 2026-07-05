export class CreateNotificationDto {
  facilityId?: string;
  type: 'Info' | 'Warning' | 'Critical';
  title: string;
  message: string;
  isRead?: boolean;
}
