const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'SendinBlue', // or "SendGrid", "Gmail"
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOrderConfirmation = async (to, order) => {
  const mailOptions = {
    from: `"IndiGlobal" <${process.env.SMTP_USER}>`,
    to,
    subject: `Order Confirmed: ${order.id}`,
    html: `
      <h3>Thank you for shopping with IndiGlobal</h3>
      <p>Your order <b>${order.id}</b> has been confirmed.</p>
      <p>Total: ₹${order.totalPrice} | Shipping: ₹${order.shippingCost} | Status: ${order.status}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOrderConfirmation
};
