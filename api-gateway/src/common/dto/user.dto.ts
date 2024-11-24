export type userDto = {
  id: number;
  usr_username: string;
  usr_password: string;
  usr_first_name: any;
  usr_last_name: any;
  usr_phone: any;
  usr_email: string;
  usr_avatar: any;
  usr_dob: any;
  usr_gender: any;
  role: {
    id: number;
    role_name: string;
  };
  status: number;
  created_at: string;
  updated_at: string;
};
