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
  console.log(encryptedText.toString('base64'))
  return JSON.stringify(encryptedText);
}


export async function decrypt(encrypted, key) {
  let decryptedText = ''
  console.log("utils decrypt")
  console.log(Buffer.from(Object.values(JSON.parse(encrypted))))
  await rsa.decrypt(
    Buffer.from(Object.values(JSON.parse(encrypted))),
    key,
    'SHA-256',
  ).then((decrypted) => {
      decryptedText= decrypted
  });
  return Buffer.from(decryptedText).toString()
}

