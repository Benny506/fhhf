import supabase, { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import { EMAIL_FROM_NAME, EMAIL_FROM_ADDRESS } from './constants';
import axios from 'axios';

/**
 * Generates an OTP using the database RPC and sends it to the user's email via the Edge Function.
 * @param {string} email - The user's email address
 * @param {string} username - The user's username
 * @param {string} subject - The subject line for the email
 */
export const generateAndSendOtp = async (email, username, subject = "Your FHHF Verification Code") => {
  // 1. Generate OTP
  const { data: otpCode, error: otpError } = await supabase.rpc('generate_otp', {
    p_email: email
  });

  if (otpError) throw otpError;

  // 2. Send Email
  const displayUsername = username || "User";
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #001f54;">Welcome to FHHF!</h2>
      <p>Hi ${displayUsername},</p>
      <p>Please use the following 6-digit code to verify your email address and complete your registration:</p>
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #b8860b; border-radius: 8px; margin: 20px 0;">
        ${otpCode}
      </div>
      <p>This code will expire in 15 minutes.</p>
    </div>
  `;

  await axios.post(`${SUPABASE_URL}/functions/v1/send-email`, {
    to: email,
    subject: subject,
    html: emailHtml,
    from_name: EMAIL_FROM_NAME,
    from_email: EMAIL_FROM_ADDRESS
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
};
