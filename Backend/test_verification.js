const axios = require('axios');

const API_URL = 'http://localhost:5002/api/auth'; // Ensure this matches the PORT in .env

const test = async () => {
    const email = 'test@islingtoncollege.edu.np';
    const invalidEmail = 'test@gmail.com';

    console.log('--- Testing Domain Verification ---');
    try {
        await axios.post(`${API_URL}/send-otp`, { email: invalidEmail });
    } catch (err) {
        console.log('Invalid domain caught (Expected):', err.response?.data?.message);
    }

    console.log('\n--- Testing OTP Sending (Manual Check Required in .env) ---');
    console.log('To fully test this, you must set EMAIL_USER and EMAIL_PASS in .env');
    try {
        const res = await axios.post(`${API_URL}/send-otp`, { email });
        console.log('OTP send response:', res.data.message);
    } catch (err) {
        console.log('OTP send error (Expected if EMAIL_USER/PASS not set):', err.response?.data?.message || err.message);
    }
};

test();
