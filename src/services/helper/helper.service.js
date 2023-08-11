exports.formatToken = (input) => {
  const regex = /token=([^;]+)/;
  const matches = input.match(regex);

  if (matches && matches.length > 1) {
    const token = matches[1];
    return token;
  }
  return;
};

exports.formatPhoneNumber = (phoneNumber) => {
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (numericPhoneNumber.length === 10) {
    const formattedPhoneNumber = numericPhoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    return formattedPhoneNumber;
  }

  return phoneNumber;
}