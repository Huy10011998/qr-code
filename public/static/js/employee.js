(function ($) {
  "use strict";

  const qrCode = $('#qrCode');

  function genQrCode(id) {
    const baseURL = `${host}/profile/${id}`;

    const qr = qrcode(0, 'H');
    qr.addData(baseURL);
    qr.make();

    const qrCodeImageSrc = qr.createDataURL(2, 4);
    return qrCodeImageSrc;
  }

  const html = `<img srcset="${genQrCode(id)}" style="width: 35px; height: 35px;" />`;

  $(qrCode).html(html);

})(jQuery);