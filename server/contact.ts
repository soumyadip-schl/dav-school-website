// Example: server/api/contact.js or similar

const nodemailer = require('nodemailer');

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  // Configure transport (update with your credentials or use OAuth2)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'YOUR_GMAIL_USERNAME@gmail.com',
      pass: 'YOUR_GMAIL_APP_PASSWORD'
    }
  });

  // Email message configuration
  const mailOptions = {
    from: email,
    to: 'schl.soumyadipkarforma@gmail.com',
    subject: `Contact Form: ${subject}`,
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mail sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send mail.', error });
  }
});
