export interface RoleDTO {
  id: number;
  role_name: string;
  role_description: string | null;
  status: number;
  created_at: string | Date;
  updated_at: string | Date;
}

// User DTO
export class UserDTO {
  id: number;
  usr_username: string;
  usr_password: string;
  usr_email: string;
  usr_avatar: string | null;
  usr_dob: string | null | Date;
  usr_gender: string | null;
  usr_refresh_token: string;
  role_id: number;
  status: number;
  created_at: string | Date;
  updated_at: string | Date;
  role: RoleDTO;
}
