"use strict";

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class MailService {
  sendActivationMail(email, activationLink) {
    sgMail.send({
      to: email,
      from: process.env.USER_EMAIL,
      subject: "Thanks for joining in!",
      text: "Welcome to the App!",
      html: `
      <div>
      <h1> For activation of your account follow this link: </h1>
      <a href="${activationLink}">${activationLink}</a>
      </div>
    `,
    });
  }
}

module.exports = new MailService();
