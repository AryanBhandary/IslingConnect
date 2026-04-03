const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter;

const getTransporter = () => {
    if (!transporter) {
        console.log("Initializing email transporter with user:", process.env.EMAIL_USER);

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("CRITICAL: EMAIL_USER or EMAIL_PASS missing from environment!");
        }

        // Gmail SMTP configuration
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return transporter;
};

const sendEmail = async (to, subject, text) => {
    try {
        const transport = getTransporter();

        // Verify connection configuration
        await transport.verify().catch(err => {
            console.error("Transporter verification failed:", err);
            throw new Error(`SMTP Verification Failed: ${err.message}`);
        });

        const info = await transport.sendMail({
            from: `"IslingConnect" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log("Email sent successfully: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Detailed Email Error:", error);
        throw error;
    }
};

const sendEmailWithAttachment = async (to, subject, text, filename, buffer) => {
    try {
        const transport = getTransporter();

        // Verify connection configuration
        await transport.verify().catch(err => {
            console.error("Transporter verification failed:", err);
            throw new Error(`SMTP Verification Failed: ${err.message}`);
        });

        const info = await transport.sendMail({
            from: `"IslingConnect" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            attachments: [
                {
                    filename: filename,
                    content: buffer
                }
            ]
        });
        console.log("Email with attachment sent successfully: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Detailed Email Error with attachment:", error);
        throw error;
    }
};

module.exports = { sendEmail, sendEmailWithAttachment };
