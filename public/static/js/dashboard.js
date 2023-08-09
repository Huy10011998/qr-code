(function ($) {
  "use strict";

  const BG_TOAST = {
    SUCCESS: 0,
    WARNING: 1,
    ERROR: 2,
    [0]: "#3ac47d",
    [1]: "#FFC107",
    [2]: "#D92550",
  };

  function customToastify(message, style) {
    Toastify({
      text: message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: style,
    }).showToast();
  }

  // logout
  function logout() {
    $.ajax({
      url: 'http://localhost:8080/api/auth/logout',
      method: "POST",
      contentType: 'application/json',
      data: {},
      dataType: 'json',
      beforeSend: function () { },
      success: function (response) {
        if (+response.code === 200) {
          window.location.href = '/login';
        }
      },
      error: function (xhr) { },
      complete: function (xhr) { },
    });
  }

  $("#btn-logout-back").on("click", function () {
    $("#myModal-Logout").css("display", "none");
  });

  $("#btn-logout").on("click", function () {
    $("#myModal-Logout").css("display", "block");
  });

  $("#btn-logout-accept").on("click", function () {
    logout();
  });

  // get LocalStorage
  const fullName = localStorage.getItem("fullName");
  const subName = localStorage.getItem("role");

  $("#username").text(fullName)
  $(".subName").text(subName);

  // hide/show sidebar
  const container = $(".refills__container");
  const sidebar = $(".sidebar");
  const sidebarItem = $(".sidebar__item > li");
  let sidebarList = $(".sidebar__list");
  const fixed = $(".-fixed");

  $(".btn-menu").on("click", function () {
    const collapse = container.find(".sidebar-collapse");
    if (collapse.length > 0) {
      collapse.removeClass("sidebar-collapse");
      sidebarItem.each(function (_, item) {
        const text = $(item).find('div');
        text.css('display', 'block');
        if (window.location.pathname !== `http://localhost:8080/dashboard` && window.location.pathname !== "http://localhost:8080/dashboard/") {
          sidebarList.css('background', "#ff6347");
        } else {
          sidebarList.css('background', "transparent");
        }
        fixed.css("width", "100%");
      });
    } else {
      sidebar.addClass("sidebar-collapse");
      sidebarItem.each(function (_, item) {
        const text = $(item).find('div');
        text.css('display', 'none');
        if (window.location.pathname !== "http://localhost:8080/dashboard`" && window.location.pathname !== "http://localhost:8080/dashboard/") {
          sidebarList.css('background', "transparent");
        } else {
          sidebarList.css('background', "#ff6347");
        }
        sidebarList.css('background', "transparent");
        fixed.css("width", "calc(65px)");
      });
    }
  });

  // create qr code
  $("#myBtn-create").on("click", function () {
    $("body").css("overflow", "hidden");
    $("#myModal-Create").css("display", "block");
  });

  $("#btn-create-back").on("click", function () {
    $("body").css("overflow", "auto");
    $("#myModal-Create").css("display", "none");
  });

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function createQrCode() {
    const token = getCookie("token");

    const username = $("#username__");
    const name = $("#fullName");
    const password = $("#password");
    const department = $("#department");
    const userId = $("#userId");
    const email = $("#email");
    const image = $("#image");
    const phoneNumber = $("#phoneNumber");
    const roles = $("#roles");

    $.ajax({
      url: 'http://localhost:8080/api/auth/createQrCode',
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify({
        username: username.val(),
        fullName: name.val(),
        password: password.val(),
        department: department.val(),
        userId: userId.val(),
        email: email.val(),
        image: image.val(),
        phoneNumber: phoneNumber.val(),
        roles: [roles.val()]
      }),
      dataType: 'json',
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      },
      success: function (response) {
        if (+response.code === 200) {
          $("#myModal-Create").css("display", "none");
          customToastify("Tạo mã QR thành công!", { background: BG_TOAST[0] });
          // window.location.reload(true);
        }
      },
      error: function (xhr, status, error) {
        customToastify(xhr.responseJSON.message, { background: BG_TOAST[2] });
      },
      complete: function (xhr) {
        username.val("");
        name.val("");
        password.val("");
        department.val("");
        userId.val("");
        email.val("");
        image.val("");
        phoneNumber.val("");
        roles.val("");
      },
    });
  }

  $("#btn-create-accept").on("click", function () {
    createQrCode();
  });

  // check disabled btn create
  function checkInputs() {
    var inputs = [
      $('#username__'),
      $('#fullName'),
      $('#password'),
      $('#department'),
      $('#userId'),
      $('#email'),
      $('#image'),
      $('#phoneNumber'),
      $('#roles')
    ];

    var allInputsFilled = inputs.every(function (input) {
      return input.val().length > 0;
    });

    $("#btn-create-accept").prop("disabled", !allInputsFilled);
  }

  $('#username__, #fullName, #password, #department, #userId, #email, #image, #phoneNumber, #roles').on('input', function () {
    checkInputs();
  });

})(jQuery);