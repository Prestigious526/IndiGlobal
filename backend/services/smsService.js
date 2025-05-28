const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendOrderSMS = async (phone, message) => {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
};

module.exports = {
  sendOrderSMS
};
