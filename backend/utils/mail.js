import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtpMail = async (to, otp) => {
    try {
        // Verify connection configuration
        await transporter.verify();
        
        // Send mail
        const info = await transporter.sendMail({
            from: `"GoCity Support" <${process.env.EMAIL}>`,
            to: to,
            subject: "Your OTP for Password Reset",
            html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 5 minutes.</p>`
        });
        
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Email error:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}