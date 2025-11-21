import { useState, useEffect } from 'react';
import PhoneInput from '../components/PhoneInput';
import SMSTestPanel from '../components/SMSTestPanel';
import {
  getUserProfile,
  updatePhoneNumber,
  toggleNotifications,
  validatePhoneNumber,
  formatToE164,
} from '../services/userService';

export default function SettingsPage() {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setCountryCode(profile.countryCode || '+1');
      setPhoneNumber(profile.phoneNumber || '');
      setNotificationsEnabled(profile.notificationsEnabled);
    }
  }, []);

  const handleSavePhone = async () => {
    setError('');
    setSuccessMessage('');

    // Validate phone number
    const validation = validatePhoneNumber(countryCode, phoneNumber);
    if (!validation.valid) {
      setError(validation.error || 'Invalid phone number');
      return;
    }

    setIsSaving(true);
    try {
      // Save phone number
      updatePhoneNumber(countryCode, phoneNumber);
      
      setSuccessMessage('Phone number saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save phone number. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    toggleNotifications(newValue);
    setSuccessMessage('Notification settings updated!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleClearPhone = () => {
    setPhoneNumber('');
    setCountryCode('+1');
    updatePhoneNumber('+1', '');
    setSuccessMessage('Phone number cleared!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const e164Format = phoneNumber ? formatToE164(countryCode, phoneNumber) : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your phone number and notification preferences for TxT M💰NEY
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Phone Number Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Phone Number</h2>
              <p className="text-sm text-gray-600 mt-1">
                Used for SMS bill reminders (coming soon)
              </p>
            </div>
            
            {phoneNumber && (
              <button
                onClick={handleClearPhone}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <PhoneInput
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onCountryCodeChange={setCountryCode}
            onPhoneNumberChange={setPhoneNumber}
            error={error}
            disabled={isSaving}
          />

          {/* E.164 Format Display */}
          {e164Format && !error && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-medium">E.164 Format:</span> {e164Format}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                This is the international standard format used for SMS delivery
              </p>
            </div>
          )}

          <button
            onClick={handleSavePhone}
            disabled={isSaving || !phoneNumber}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Phone Number
              </>
            )}
          </button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">SMS Reminders</h3>
              <p className="text-sm text-gray-600 mt-1">
                Receive text message reminders for upcoming bills
              </p>
            </div>
            
            {/* Toggle Switch */}
            <button
              onClick={handleToggleNotifications}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {!phoneNumber && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-yellow-800 font-medium">Phone number required</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Add your phone number above to receive SMS reminders
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            About SMS Reminders
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 ml-7">
            <li>• Reminders are sent 3 days and 1 day before bills are due</li>
            <li>• Only bills with SMS enabled will trigger reminders</li>
            <li>• Your phone number is stored locally and never shared</li>
            <li>• SMS functionality requires Twilio configuration</li>
          </ul>
        </div>

        {/* SMS Testing Panel */}
        <SMSTestPanel />
      </div>
    </div>
  );
}
