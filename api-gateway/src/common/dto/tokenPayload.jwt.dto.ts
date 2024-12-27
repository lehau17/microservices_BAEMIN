export type TokenPayload = {
  sub: number;
  avatar: string;
  username: string;
  role: {
    id: number;
    role_name: string;
  };
  iat: number;
  exp: number;
};
