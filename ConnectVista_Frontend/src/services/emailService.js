import emailjs from '@emailjs/browser';

/**
 * Reusable service to send emails via EmailJS
 */
const sendEmail = async (templateParams, templateId) => {
  const SERVICE_ID = "service_l4fdi2m"; 
  const PUBLIC_KEY = "awSmRq2fkd_d1Yvku"; 

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      templateParams,
      PUBLIC_KEY
    );
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
};

/**
 * Send Password Reset Email
 * @param {Object} data - { user_name, user_email, reset_link }
 */
export const sendPasswordResetEmail = (data) => {
  const TEMPLATE_ID = "template_by93q6s";
  return sendEmail(data, TEMPLATE_ID);
};

/**
 * Send New Booking Email to Provider
 * DISABLED: EmailJS Free Plan Limit (2 templates only)
 */
export const sendNewBookingEmail = (data) => {
  console.log('📧 EmailJS: New Booking email would be sent here (Disabled in Free Plan)', data);
  return Promise.resolve({ success: true, message: 'Email disabled in free plan' });
};

/**
 * Send Booking Status Update Email to Seeker
 * DISABLED: EmailJS Free Plan Limit (2 templates only)
 */
export const sendBookingStatusUpdateEmail = (data) => {
  console.log('📧 EmailJS: Status Update email would be sent here (Disabled in Free Plan)', data);
  return Promise.resolve({ success: true, message: 'Email disabled in free plan' });
};

export default {
  sendPasswordResetEmail,
  sendNewBookingEmail,
  sendBookingStatusUpdateEmail
};
