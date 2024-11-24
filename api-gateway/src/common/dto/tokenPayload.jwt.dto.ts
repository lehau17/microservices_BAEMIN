export type TokenPayload = {
  sub: number;
  username: string;
  role: {
    id: number;
    role_name: string;
  };
  iat: number;
  exp: number;
};
