import { Role } from './role.model';

export interface UserRole {
  id: number;
  created_at: Date;
  user_id: string;
  role_id: number;
  roles: Role;
}
