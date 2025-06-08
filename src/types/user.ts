export interface User {
  id: number;
  name: string;
  email: string;
  password: string | null; // Optional, can be null if user has not set a password
}