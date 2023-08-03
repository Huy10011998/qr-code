"use strict";

function downloadToFile(content, filename, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
}

function previewFile(event) {
  let reader = new FileReader();
  let file = event.target.files[0];

  reader.readAsDataURL(file);
  reader.onloadend = () => (previewEl.src = reader.result);
}

const makeVCardVersion = () => `VERSION:3.0`;
const makeVCardInfo = (info) => `N:${info}`;
const makeVCardName = (name) => `FN:${name}`;
const makeVCardOrg = (org) => `ORG:${org}`;
const makeVCardTitle = (title) => `TITLE:${title}`;
const makeVCardPhoto = (img) => `PHOTO;TYPE=JPEG;ENCODING=b:[${img}]`;
const makeVCardTel = (phone) => `TEL;TYPE=WORK,VOICE:${phone}`;
const makeVCardAdr = (address) => `ADR;TYPE=WORK,PREF:;;${address}`;
const makeVCardEmail = (email) => `EMAIL:${email}`;
const makeVCardTimeStamp = () => `REV:${new Date().toISOString()}`;

function makeVCard() {
  const info = $(".info").text();
  const org = $(".org").text();
  const title = $(".title").text();
  const phone = $(".phone").text();
  const image = $(".image").attr('src');
  const address = $(".address").text();
  const email = $(".email").text();
  let vcard = `BEGIN:VCARD
${makeVCardVersion()}
${makeVCardInfo(info)}
${makeVCardName(info)}
${makeVCardOrg(org)}
${makeVCardTitle(title)}
${makeVCardPhoto(image)}
${makeVCardTel(phone)}
${makeVCardAdr(address)}
${makeVCardEmail(email)}
${makeVCardTimeStamp()}
END:VCARD`;
  downloadToFile(vcard, "vcard.vcf", "text/vcard");
}

downloadEl.addEventListener("click", makeVCard);
// fileEl.addEventListener("change", previewFile);
