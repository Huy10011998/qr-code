(function ($) {
  "use strict";

  const qrCode = $('#qrCode');
  // gen qr code
  function genQrCode(id) {
    const baseURL = `${host}/profile/${id}`;

    const qrcode = new QRCode(document.createElement("div"), {
      text: baseURL,
      width: 150,
      height: 150,
    });

    const qrCodeImageSrc = qrcode._el.firstChild.toDataURL();
    return qrCodeImageSrc;
  }

  const html = `<img src=${genQrCode(id)} style="width: 50px; height: 50px;" />`;

  $(qrCode).html(html);

})(jQuery);