const validator = require('validator');

function validateBoliviaCI(ci) {
  if (!ci) return false;
  return /^[0-9]{6,10}$/.test(ci);
}

function validateBoliviaPhone(phone) {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return /^[0-9]{7,9}$/.test(digits);
}

function validateBoliviaPlate(plate) {
  if (!plate) return false;
  // Allow formats like ABC123, AB-1234, etc.
  return /^[A-Z0-9\-]{5,8}$/i.test(plate);
}

function passwordStrength(password) {
  if (!password) return 'weak';
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (length >= 8) score++;
  if (length >= 12) score++;
  if (hasLower && hasUpper) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

module.exports = { validateBoliviaCI, validateBoliviaPhone, validateBoliviaPlate, passwordStrength };
