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

export default {
  sendPasswordResetEmail
};
