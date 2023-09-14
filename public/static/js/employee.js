(function ($) {
  "use strict";
  const qrCode = $('#qrCode');
  // gen qr code
  function genQrCode(id) {
    const baseURL = `${host}/profile/${id}`;

    const qrcode = new QRCode(document.createElement("div"), {
      text: baseURL,
      width: 120,
      height: 120,
      correctLevel: QRCode.CorrectLevel.H,
    });

    const qrCodeImageSrc = qrcode._el.firstChild.toDataURL();
    return qrCodeImageSrc;
  }

  const html = `<img src=${genQrCode(id)} style="width: 40px; height: 40px;" />`; // Điều chỉnh kích thước hiển thị của mã QR

  $(qrCode).html(html);

})(jQuery);