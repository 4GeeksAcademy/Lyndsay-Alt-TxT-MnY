import type { UserProfile } from '../types/user';

const USER_PROFILE_KEY = 'txtmoney_user_profile';

/**
 * Get user profile from localStorage
 */
export const getUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UserProfile;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
};

/**
 * Save user profile to localStorage
 */
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save user profile');
  }
};

/**
 * Update phone number in user profile
 */
export const updatePhoneNumber = (
  countryCode: string,
  phoneNumber: string
): UserProfile => {
  const profile = getUserProfile() || {
    phoneNumber: '',
    countryCode: '+1',
    phoneVerified: false,
    notificationsEnabled: true,
  };

  const updatedProfile: UserProfile = {
    ...profile,
    countryCode,
    phoneNumber,
    phoneVerified: false, // Reset verification when number changes
  };

  saveUserProfile(updatedProfile);
  return updatedProfile;
};

/**
 * Toggle SMS notifications
 */
export const toggleNotifications = (enabled: boolean): UserProfile => {
  const profile = getUserProfile() || {
    phoneNumber: '',
    countryCode: '+1',
    phoneVerified: false,
    notificationsEnabled: true,
  };

  const updatedProfile: UserProfile = {
    ...profile,
    notificationsEnabled: enabled,
  };

  saveUserProfile(updatedProfile);
  return updatedProfile;
};

/**
 * Validate phone number format (basic E.164 validation)
 * E.164 format: +[country code][subscriber number]
 * Total length: 8-15 digits (including country code)
 */
export const validatePhoneNumber = (
  countryCode: string,
  phoneNumber: string
): { valid: boolean; error?: string } => {
  // Remove all non-digit characters from phone number
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Check if phone number is empty
  if (!digitsOnly) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Check minimum length (at least 7 digits for subscriber number)
  if (digitsOnly.length < 7) {
    return { valid: false, error: 'Phone number is too short (minimum 7 digits)' };
  }

  // Check maximum length (max 15 digits total for E.164)
  const countryCodeDigits = countryCode.replace(/\D/g, '');
  const totalLength = countryCodeDigits.length + digitsOnly.length;
  
  if (totalLength > 15) {
    return { valid: false, error: 'Phone number is too long (maximum 15 digits total)' };
  }

  // Basic format check: should only contain digits, spaces, dashes, parentheses
  if (!/^[\d\s\-()]+$/.test(phoneNumber)) {
    return { valid: false, error: 'Phone number contains invalid characters' };
  }

  return { valid: true };
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (
  countryCode: string,
  phoneNumber: string
): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  return `${countryCode} ${digitsOnly}`;
};

/**
 * Format phone number to E.164 standard
 */
export const formatToE164 = (
  countryCode: string,
  phoneNumber: string
): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const countryCodeDigits = countryCode.replace(/\D/g, '');
  return `+${countryCodeDigits}${digitsOnly}`;
};
