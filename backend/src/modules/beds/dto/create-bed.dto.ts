export class CreateBedDto {
  facilityId?: string;
  bedNumber: string;
  ward: string;
  bedType: 'General' | 'ICU' | 'Oxygen';
  status?: 'Available' | 'Occupied' | 'Maintenance';
  assignedPatientId?: string | null;
}
