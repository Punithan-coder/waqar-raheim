import nodemailer from 'nodemailer';

async function generate() {
  const account = await nodemailer.createTestAccount();
  console.log(`EMAIL_USER=${account.user}`);
  console.log(`EMAIL_PASS=${account.pass}`);
}

generate();
