export class CreatePatientDto {
  facilityId?: string;
  patientIdCode: string;
  name: string;
  age: number;
  gender: string;
  visitType: 'OPD' | 'IPD';
  diseaseCategory?: string;
  assignedDoctor?: string;
  visitDate?: string;
}
