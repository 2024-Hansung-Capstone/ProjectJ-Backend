import * as coolsms from 'coolsms-node-sdk';
import 'dotenv/config';

const mysms = coolsms.default;

export async function sendTokenToSMS(phone, token) {
  const messageService = new mysms(process.env.SMS_KEY, process.env.SMS_SECRET);

  const res = await messageService.sendOne({
    to: phone,
    from: process.env.SMS_SENDER,
    text: `<자취만렙> 요청하신 인증번호는 [${token}] 입니다.`,
    autoTypeDetect: true,
  });

  console.log(res);
}
