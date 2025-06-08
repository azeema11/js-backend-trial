import { ZodError } from "zod";
import { PublicUser, User } from "../types/user";

export function formatZodError(error: ZodError): string[] {
  return error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
}

export function sanitizeUser(user: User): PublicUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

export function sanitizeUsers(users: User[]): PublicUser[] {
  return users.map(sanitizeUser);
}