// Lowercase letters + digits only, skipping 'o' and '0' since they're easy
// to mix up with each other (and with 'O'/zero) when someone types a link.
const ALPHABET = 'abcdefghijklmnpqrstuvwxyz123456789';

function randomCode(length = 3) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

module.exports = { randomCode };
