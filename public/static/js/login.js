(function ($) {
  "use strict";

  $("#btn-login").prop("disabled", true);

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

  // event enter
  function checkInputs(event) {
    if ($('#password').val().length > 0 && $('#userId').val().length > 0) {
      $("#btn-login").prop("disabled", false);
    } else {
      $("#btn-login").prop("disabled", true);
    }
  }

  $('#userId').on("input", function () {
    checkInputs();
  });

  $('#password').on("input", function () {
    checkInputs();
  });

  $('#password').on("keydown", function (event) {
    if ($('#password').val().length > 0 && $('#userId').val().length > 0) {
      $("#btn-login").prop("disabled", false);
      if (event.which === 13) {
        event.preventDefault();
        login();
        $('#userId').focus();
      }
    }
  });

  // call api login
  function login() {
    const userId = $('#userId');
    const password = $('#password');

    $.ajax({
      url: 'http://localhost:8080/api/auth/login',
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify({
        userId: userId.val(),
        password: password.val()
      }),
      dataType: 'json',
      beforeSend: function () { },
      success: function (response) {
        if (+response.code === 200) {
          localStorage.setItem("fullName", response.data.fullName);
          localStorage.setItem("role", response.data.roles[0]);
          window.location.href = '/dashboard';
        }
      },
      error: function (xhr) {
        $("#btn-login").prop("disabled", true);
        customToastify(xhr.responseJSON.message, { background: BG_TOAST[2] });
      },
      complete: function (xhr) {
        userId.val("");
        password.val("");
      },
    });
  }

  $("#btn-login").on("click", function () {
    login();
    $('#userId').focus();
  });

})(jQuery);