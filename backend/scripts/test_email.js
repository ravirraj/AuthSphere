import { sendVerificationOTP } from "../src/services/email.service.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function run() {
    try {
        console.log("🚀 Starting email test...");

        const testEmail = "madhavsenwal8@gmail.com";
        const testOtp = "123456";
        const projectName = "AuthSphere Test";

        const info = await sendVerificationOTP(testEmail, testOtp, projectName);

        console.log("✅ Email sent successfully!");
        console.log("Message ID:", info.messageId);

        process.exit(0);
    } catch (err) {
        console.error("❌ Failed to send test email:");
        console.error(err);
        process.exit(1);
    }
}

run();
