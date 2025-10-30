import nodemailer from "nodemailer";


console.log("process.env.EMAILER_PASSWORD: ", process.env.EMAILER_PASSWORD);
const transporter = nodemailer.createTransport({
  host: "smtp.163.com",
  port: 465,
  secure: true,
  auth: {
    user: "bilinguistkid@163.com",
    pass: process.env.EMAILER_PASSWORD,
  },
});

export async function sendVerificationCode(email: string, vCode: string) {
  try {
    const info = await transporter.sendMail({
      from: "bilinguistkid@163.com",
      to: email,
      subject: "BilinguistKid Verification Code",
      text: `Your verification code is ${vCode}`,
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true, msg: null };
  } catch (error) {
    console.log("Error: ", error);
    return { success: false, msg: `Failed to send email: ${error}` };
  }
}
