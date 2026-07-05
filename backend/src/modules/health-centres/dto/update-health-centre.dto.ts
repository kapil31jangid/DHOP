export class UpdateHealthCentreDto {
  districtId?: string;
  name?: string;
  type?: 'PHC' | 'CHC' | 'DH';
  address?: string;
  contactNumber?: string;
  status?: 'Active' | 'Inactive';
}
