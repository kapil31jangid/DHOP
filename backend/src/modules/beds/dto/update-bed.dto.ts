export class UpdateBedDto {
  bedNumber?: string;
  ward?: string;
  bedType?: 'General' | 'ICU' | 'Oxygen';
  status?: 'Available' | 'Occupied' | 'Maintenance';
  assignedPatientId?: string | null;
}
