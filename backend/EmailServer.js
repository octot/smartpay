const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
// Middleware
app.use(bodyParser.json());
app.post('/send-email', (req, res) => {
  const { emailFrom, payRollFilteredData } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'aajaykumarr32@gmail.com', // replace with your email
      pass: 'zjpslnqyldqexent' // replace with your password or use environment variables
    }
  });
  const mailOptions = {
    from: emailFrom,
    to: 'aajaykumarr32@gmail.com', // replace with recipient email
    subject: 'SmartPoint', // subject of the email
    html: `<p>Here is the tutor details</p>
    <table border="1">
      <thead>
        <tr>
          <th>1. Tutor name</th>
          <th>2. Date of Class Taken</th>
        </tr>
      </thead>
      <tbody>
        ${payRollFilteredData.slice(1).map(row => `
          <tr>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`
    //html: `<p>Here is the tutor  details:</p> <pre>${JSON.stringify(payRollFilteredData, null, 2)}</pre>`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email',error);
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
