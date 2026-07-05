export class CreateDistrictDto {
  name: string;
  state: string;
  status?: 'Active' | 'Inactive';
}
