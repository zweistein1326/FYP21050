import rsa from "js-crypto-rsa";
import {encode, decode} from 'base64-arraybuffer';

export async function encrypt(text, publicKey) {
  let encryptedText=''
  await rsa.encrypt(
      Buffer.from(text),
      publicKey,
      'SHA-256',
      ).then((encrypted) => {
          encryptedText = encrypted;
  })
  console.log(encryptedText)
  return encode(encryptedText);
}

export async function decrypt(encrypted, key) {
  console.log(Buffer.from(decode(encrypted)))
  let decryptedText = ''
  await rsa.decrypt(
    Buffer.from(decode(encrypted)),
    key,
    'SHA-256',
  ).then((decrypted) => {
      decryptedText= decrypted
  });
  return Buffer.from(decryptedText).toString()
}

