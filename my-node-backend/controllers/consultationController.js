import Consultation from '../models/Consultation.js';
import transporter from '../config/mail.js';
import nodemailer from 'nodemailer';

// HTML Templates
const generateCustomerEmailHtml = (data) => {
  const isNewsletter = data.consultationType === 'Newsletter Subscription';
  
  const title = isNewsletter ? 'Welcome to Our Newsletter' : 'Private Consultation Request Received';
  const messageBody = isNewsletter 
    ? 'Thank you for subscribing to Waqar Rahiem Advisory market insights.<br><br>You will now receive our exclusive weekly market reports, ROI alerts, area growth data, and off-plan opportunities directly to your inbox. Stay tuned for our next update!'
    : 'Thank you for contacting Waqar Rahiem Advisory.<br><br>Your private consultation request has been successfully received. One of our senior investment advisors will contact you shortly to confirm your appointment and discuss premium Dubai investment opportunities tailored to your goals.';

  return `
    <div style="font-family: 'Georgia', serif; background-color: #050505; color: #f5f5f7; padding: 40px; text-align: center;">
      <h1 style="color: #C8A46B; font-weight: 300; letter-spacing: 2px;">WAQAR RAHIEM ADVISORY</h1>
      <hr style="border: 0; height: 1px; background: linear-gradient(90deg, transparent, #C8A46B, transparent); margin: 30px 0;">
      <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 20px;">${title}</h2>
      <p style="font-family: 'Arial', sans-serif; font-size: 16px; color: #a1a1aa; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        ${messageBody}
      </p>
      
      <div style="margin: 40px auto; max-width: 600px; background-color: #111; padding: 30px; border-radius: 8px; border: 1px solid #333; text-align: left;">
        <h3 style="color: #C8A46B; margin-top: 0; font-family: 'Arial', sans-serif; font-size: 18px;">About Waqar Rahiem Advisory</h3>
        <p style="font-family: 'Arial', sans-serif; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
          Waqar Rahiem Advisory is a premier private wealth and real estate investment firm specializing in the Dubai market. With over 16 years of experience, zero tax, and Golden Visa eligibility, we help global investors build high-yield portfolios.
        </p>
        <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
        <h4 style="color: #fff; margin-bottom: 10px; font-family: 'Arial', sans-serif; font-size: 14px;">Contact Us</h4>
        <p style="font-family: 'Arial', sans-serif; font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0;">
          <strong>Phone / WhatsApp:</strong> +91 84385 29815<br>
          <strong>Office:</strong> Downtown Dubai, UAE<br>
          <strong>Email:</strong> advisory@waqar-rahiem.com
        </p>
      </div>

      <br>
      <p style="font-family: 'Arial', sans-serif; font-size: 14px; color: #6b7280;">
        Best Regards,<br>
        Waqar Rahiem Advisory Team
      </p>
    </div>
  `;
};

const generateAdminEmailHtml = (data) => {
  return `
    <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f5; padding: 30px; color: #333;">
      <h2 style="color: #111;">New Consultation Lead Received</h2>
      <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${data.phoneNumber}">${data.phoneNumber}</a></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Goal:</strong> ${data.investmentGoal}</p>
        <p><strong>Budget:</strong> ${data.budgetRange}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Consultation Type:</strong> ${data.consultationType}</p>
        <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
        <p><strong>Message:</strong> ${data.additionalMessage || 'N/A'}</p>
      </div>
    </div>
  `;
};

// @desc    Create a consultation request and send emails
// @route   POST /api/consultation/create
export const createConsultation = async (req, res) => {
  try {
    const consultationData = req.body;
    
    // Save to Database
    const newConsultation = new Consultation(consultationData);
    await newConsultation.save();
    console.log('[DB Success] Consultation saved to MongoDB');

    // Send Customer Email
    try {
      const info = await transporter.sendMail({
        from: `"Waqar Rahiem Advisory" <${process.env.EMAIL_USER}>`,
        to: consultationData.email,
        subject: consultationData.consultationType === 'Newsletter Subscription' ? 'Welcome to Waqar Rahiem Advisory Newsletter' : 'Private Consultation Request Received',
        html: generateCustomerEmailHtml(consultationData)
      });
      console.log(`[Email Success] Customer email sent to: ${consultationData.email}`);
      console.log(`[Preview URL] Customer Email: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (emailError) {
      console.error(`[Email Error] Failed to send email to customer (${consultationData.email}):`, emailError.message);
    }

    // Send Admin Notification Email
    try {
      const infoAdmin = await transporter.sendMail({
        from: `"Website Leads" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Lead: ${consultationData.fullName} - ${consultationData.budgetRange}`,
        html: generateAdminEmailHtml(consultationData)
      });
      console.log(`[Email Success] Admin notification sent successfully.`);
      console.log(`[Preview URL] Admin Email: ${nodemailer.getTestMessageUrl(infoAdmin)}`);
    } catch (adminEmailError) {
      console.error('[Email Error] Failed to send admin notification:', adminEmailError.message);
    }

    // Return Success Response
    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully'
    });

  } catch (error) {
    console.error('[Server Error] Error processing consultation request:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error processing request',
      error: error.message
    });
  }
};

// @desc    Test email route
// @route   GET /api/test-email
export const testEmail = async (req, res) => {
  try {
    const testRecipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    
    const infoTest = await transporter.sendMail({
      from: `"Waqar Rahiem System" <${process.env.EMAIL_USER}>`,
      to: testRecipient,
      subject: 'Test Email from Node.js Backend',
      html: '<div style="font-family: Arial, sans-serif;"><h1>Test Email</h1><p>If you are seeing this, Nodemailer is configured correctly.</p></div>'
    });
    
    console.log(`[Email Success] Test email sent to: ${testRecipient}`);
    console.log(`[Preview URL] Test Email: ${nodemailer.getTestMessageUrl(infoTest)}`);
    res.send(`Test email sent successfully! View it here: ${nodemailer.getTestMessageUrl(infoTest)}`);
  } catch (error) {
    console.error('[Email Error] Failed to send test email:', error.message);
    res.status(500).send('Failed to send test email: ' + error.message);
  }
};
