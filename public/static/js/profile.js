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
    img: $("image-vn-eng").attr("src")
  };

  function resetCompanyData() {
    $(".info").text(originalCompanyData.fullNameEng),
      $(".title").text(originalCompanyData.departmentEng),
      $(".title-company").text(originalCompanyData.title);
    $(".headquarters").text(originalCompanyData.headquarters);
    $(".address").text(originalCompanyData.address);
    $(".tax").text(originalCompanyData.taxCodeLabel);
    $(".code").text(originalCompanyData.code);
    $(".image-vn-eng").attr("src", "/static/images/icons/united-states.png");
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
    };

    $(".info").text(companyData.fullNameEng),
      $(".title").text(companyData.departmentEng),
      $(".title-company").text(companyData.title);
    $(".headquarters").text(companyData.headquarters);
    $(".address").text(companyData.address);
    $(".tax").text(companyData.taxCodeLabel);
    $(".code").text(companyData.code);
    $(".image-vn-eng").attr("src", companyData.img);
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