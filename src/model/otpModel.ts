import mongoose, { Schema, Document } from "mongoose";
import mailSender from "../utils/mailSender";

// Interface for OTP document
interface OTPDocument extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

// Schema definition
const otpSchema = new Schema<OTPDocument>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes
  },
});

// Function to send emails
async function sendVerificationEmail(email: string, otp: string): Promise<void> {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.error("Error occurred while sending email: ", error);
    throw error;
  }
}

// Middleware to send email when a new document is created
otpSchema.pre<OTPDocument>("save", async function (next) {
  console.log("New document saved to the database");

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

// Export the model with proper type
const OTPModel = mongoose.model<OTPDocument>("OTP", otpSchema);
export default OTPModel;
