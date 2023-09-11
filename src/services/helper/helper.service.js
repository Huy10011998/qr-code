export const formatPhoneNumber = (phoneNumber) => {
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (numericPhoneNumber.length === 10) {
    return numericPhoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  return phoneNumber;
};