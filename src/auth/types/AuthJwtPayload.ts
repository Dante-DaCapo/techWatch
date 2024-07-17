export type AuthJwtPayload = {
  sub: number; // eq UserId
  username: string;
};

export type AuthJwt = AuthJwtPayload & {
  iat: number;
  exp: number;
};
