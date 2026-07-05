import { Role } from '../../../common/constants/roles.constants';

export class UpdateUserDto {
  facilityId?: string | null;
  name?: string;
  role?: Role;
  status?: 'Active' | 'Inactive';
}
