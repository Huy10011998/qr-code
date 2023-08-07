exports.formatToken = (input) => {
  const regex = /token=([^;]+)/;
  const matches = input.match(regex);

  if (matches && matches.length > 1) {
    const token = matches[1];
    return token;
  }
  return;
};