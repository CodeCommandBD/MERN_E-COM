import { connectDB } from "@/lib/dbConnection";
import { res } from "@/lib/helper";
import OTPModel from "@/Models/Otp.model";
import { generateOTP } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";

export async function POST(req) {
  try {
    await connectDB();
    
    const { email } = await req.json();
    
    if (!email) {
      return res(false, 400, 'Email is required');
    }
    
    // Delete any existing OTP for this email
    await OTPModel.deleteMany({ email });
    
    // Generate new OTP
    const otp = generateOTP();
    
    // Store new OTP in database
    const newOtpData = new OTPModel({
      email,
      otp
    });
    await newOtpData.save();
    
    // Send OTP email
    const otpEmailStatus = await sendMail('Your login verification code', email, otpEmail(otp));
    
    if (!otpEmailStatus.success) {
      return res(false, 400, 'Failed to send OTP');
    }
    
    return res(true, 200, 'OTP sent successfully');
    
  } catch (error) {
    return res(false, 500, 'Failed to resend OTP');
  }
}
