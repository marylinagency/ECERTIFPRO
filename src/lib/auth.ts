import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcryptjs
 * @param password Plain text password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcryptjs.genSalt(SALT_ROUNDS);
    return await bcryptjs.hash(password, salt);
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password to verify
 * @param hashedPassword Hashed password from database
 * @returns true if passwords match, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcryptjs.compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

/**
 * Generate a strong random password
 * @param length Password length (default: 12)
 * @returns Random password string
 */
export function generateRandomPassword(length: number = 12): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Validate password strength
 * Password must contain:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * @param password Password to validate
 * @returns Object with valid flag and error messages
 */
export function validatePasswordStrength(password: string) {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 * @param email Email to validate
 * @returns true if email is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export type PasswordValidationResult = ReturnType<typeof validatePasswordStrength>;
export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  isActive: boolean;
};
