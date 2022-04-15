import rsa from "js-crypto-rsa";

export async function encrypt(text, publicKey) {
  let encryptedText=''
  await rsa.encrypt(
      Buffer.from(text),
      // JSON.parse(publicKey),
      publicKey,
      'SHA-256',
      ).then((encrypted) => {
          encryptedText = encrypted;
  })
  return encryptedText;
}


export async function decrypt(encrypted, key) {
  let decryptedText = ''
  await rsa.decrypt(
    encrypted,
    // JSON.parse(key),
    key,
    'SHA-256',
  ).then((decrypted) => {
      decryptedText= decrypted
  });
  return Buffer.from(decryptedText).toString()
}

