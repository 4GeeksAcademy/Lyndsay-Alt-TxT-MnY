import { useState } from 'react';
import { isTwilioConfigured, sendTestSMS } from '../services/smsService';
import { triggerReminders, getBillsDueForReminder } from '../services/reminderService';
import { getUserProfile } from '../services/userService';

export default function SMSTestPanel() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [reminderResult, setReminderResult] = useState<string>('');

  const userProfile = getUserProfile();
  const twilioConfigured = isTwilioConfigured();

  const handleTestSMS = async () => {
    if (!userProfile || !userProfile.phoneNumber) {
      setTestResult('❌ No phone number configured. Go to Settings to add one.');
      return;
    }

    setTesting(true);
    setTestResult('Sending test SMS...');

    try {
      const result = await sendTestSMS(
        userProfile.phoneNumber,
        userProfile.countryCode
      );

      if (result.success) {
        setTestResult('✅ Test SMS sent successfully! Check your phone.');
      } else {
        setTestResult(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const handleTriggerReminders = async () => {
    setTesting(true);
    setReminderResult('Processing reminders...');

    try {
      const billsDue = await getBillsDueForReminder();
      
      if (billsDue.length === 0) {
        setReminderResult('ℹ️ No bills need reminders today.');
        setTesting(false);
        return;
      }

      const result = await triggerReminders();
      setReminderResult(result);
    } catch (error) {
      setReminderResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">SMS Testing</h2>

      {/* Configuration Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-3 h-3 rounded-full ${twilioConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium text-gray-900">
            Twilio: {twilioConfigured ? 'Configured ✓' : 'Not Configured'}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-3 h-3 rounded-full ${userProfile?.phoneNumber ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium text-gray-900">
            Phone: {userProfile?.phoneNumber ? `${userProfile.countryCode} ${userProfile.phoneNumber} ✓` : 'Not Configured'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${userProfile?.notificationsEnabled ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="font-medium text-gray-900">
            Notifications: {userProfile?.notificationsEnabled ? 'Enabled ✓' : 'Disabled'}
          </span>
        </div>
      </div>

      {!twilioConfigured && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">⚠️ Twilio Not Configured</p>
          <p className="text-xs text-yellow-700 mt-1">
            Add your Twilio credentials to the .env file to enable SMS functionality.
          </p>
        </div>
      )}

      {/* Test SMS Button */}
      <div className="space-y-4">
        <div>
          <button
            onClick={handleTestSMS}
            disabled={testing || !twilioConfigured || !userProfile?.phoneNumber}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {testing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Testing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Test SMS
              </>
            )}
          </button>
          
          {testResult && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-line">
              {testResult}
            </div>
          )}
        </div>

        {/* Trigger Reminders Button */}
        <div>
          <button
            onClick={handleTriggerReminders}
            disabled={testing || !twilioConfigured || !userProfile?.phoneNumber}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {testing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Trigger Reminders Now
              </>
            )}
          </button>
          
          {reminderResult && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-line font-mono">
              {reminderResult}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 text-sm">How to Set Up Twilio SMS:</h3>
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Sign up at <a href="https://www.twilio.com/try-twilio" target="_blank" rel="noopener noreferrer" className="underline">twilio.com/try-twilio</a></li>
          <li>Get a free phone number from your Twilio console</li>
          <li>Copy Account SID, Auth Token, and Phone Number</li>
          <li>Add them to your <code className="bg-blue-100 px-1 rounded">.env</code> file</li>
          <li>Restart the dev server</li>
          <li>Test SMS functionality with the button above</li>
        </ol>
      </div>
    </div>
  );
}
