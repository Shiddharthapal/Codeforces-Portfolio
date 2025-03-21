import type { Token } from '@/types/token';
import jwt from 'jsonwebtoken';

export const verifyToken = async (token: string) => {
  let verifyToken = jwt.verify(
    token,
    import.meta.env.JWT_SECRET || '',
  ) as Token;
  
  return verifyToken;
};
