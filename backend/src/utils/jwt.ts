import jwt from 'jsonwebtoken';
import config from '@/config/env';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateTokenPair = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as { userId: string };
};
