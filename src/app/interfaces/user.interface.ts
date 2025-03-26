/**
 * IUser represents the structure for a user in the application.
 *
 * Properties:
 * - id: Unique identifier for the user (optional, typically provided by the backend).
 * - name: User's full name.
 * - email: User's email address.
 * - password: User's password (optional if registering via Google).
 * - age: User's age (optional).
 * - dateOfBirth: User's birth date in ISO format (optional).
 * - gender: User's gender (optional; can be 'male', 'female', or 'other').
 * - phone: User's phone number (optional).
 * - googleId: Unique identifier from Google if the user registered via Google (optional).
 */
export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    age?: number;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    googleId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    role?: {
      name?: string;
    }
  }
  