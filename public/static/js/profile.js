(function ($) {
  "use strict";

  var originalCompanyData = {
    fullNameEng: $(".info").text(),
    departmentEng: $(".title").text(),
    title: $(".title-company").text(),
    headquarters: $(".headquarters").text(),
    address: $(".address").text(),
    taxCodeLabel: $(".tax").text(),
    code: $(".code").text(),
    btn_img: $("#captureEl").text(),
    btn_vcard: $("#downloadEl").text(),
  };

  function resetCompanyData() {
    $(".info").text(originalCompanyData.fullNameEng);
    $(".title").text(originalCompanyData.departmentEng);
    $(".title-company").text(originalCompanyData.title);
    $(".headquarters").text(originalCompanyData.headquarters);
    $(".address").text(originalCompanyData.address);
    $(".tax").text(originalCompanyData.taxCodeLabel);
    $(".code").text(originalCompanyData.code);
    $(".image-vn-eng").attr("src", "/static/images/icons/united-states.png");
    $("#logo").attr("src", "/static/images/logo_vn.png");
    $("#captureEl").text(originalCompanyData.btn_img);
    $("#downloadEl").text(originalCompanyData.btn_vcard);
  }

  function changeLangEnCompany() {
    const companyData = {
      fullNameEng: fullNameEng,
      departmentEng: departmentEng,
      title: "CHOLIMEX FOODS JOINT STOCK COMPANY",
      headquarters: "Head Office",
      address: "7th St. Vinh Loc Industrial Park Binh Chanh Dist., HCMC, VietNam",
      taxCodeLabel: "Tax Code:",
      code: "0304475742",
      img: "/static/images/icons/vietnam.png",
      btn_img: "Download Images",
      btn_vcard: "Download vcard",
      logo: "/static/images/logo_en.png"
    };

    $(".info").text(companyData.fullNameEng),
      $(".title").text(companyData.departmentEng),
      $(".title-company").text(companyData.title);
    $(".headquarters").text(companyData.headquarters);
    $(".address").text(companyData.address);
    $(".tax").text(companyData.taxCodeLabel);
    $(".code").text(companyData.code);
    $(".image-vn-eng").attr("src", companyData.img);
    $("#captureEl").text(companyData.btn_img);
    $("#downloadEl").text(companyData.btn_vcard);
    $('#logo').attr("src", companyData.logo)
  }

  $("#en").on("click", function () {
    if ($(this).hasClass("active")) {
      resetCompanyData();
    } else {
      changeLangEnCompany();
    }
    $(this).toggleClass("active");
  });

})(jQuery);