import { useState, type ChangeEvent } from 'react';
import { COUNTRY_CODES } from '../types/user';

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  error,
  disabled = false,
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits, spaces, dashes, and parentheses
    if (/^[\d\s\-()]*$/.test(value)) {
      onPhoneNumberChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Phone Number
        <span className="text-red-500 ml-1">*</span>
      </label>
      
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          disabled={disabled}
          className={`
            px-3 py-2 border rounded-lg font-medium
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder="555 123 4567"
            className={`
              w-full px-4 py-2 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-colors
              ${error ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          
          {/* Character count helper */}
          {isFocused && phoneNumber && (
            <div className="absolute right-3 top-2.5 text-xs text-gray-400">
              {phoneNumber.replace(/\D/g, '').length} digits
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Format Helper */}
      {!error && phoneNumber && (
        <p className="text-xs text-gray-500">
          Format: {countryCode} {phoneNumber.replace(/\D/g, '')}
        </p>
      )}
    </div>
  );
}
