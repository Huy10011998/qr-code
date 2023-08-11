(function ($) {
  "use strict";
  let loading = $("#loading");
  let tableEl = $(".table-body");
  let paginate = $(".paginate");
  let modalDelete = $("#myModal-Delete");
  let contentDelete = $(".content-delete");
  let titleDelete = $(".title-delete");
  let modalUpdate = $("#myModal-Update");
  let body = $("body");

  listQrCode();

  const getFullTime = (date) => {
    return moment(date).format('HH:mm:ss - DD/MM/YYYY');
  }

  const formatTotalPage = (number) => {
    const config = { maximumFractionDigits: 9 }
    const formated = new Intl.NumberFormat('number', config).format(number);
    return formated;
  }

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
      duration: 1500,
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
          $("body").css("overflow", "auto");
          customToastify("Tạo mã QR thành công!", { background: BG_TOAST[0] });
          listQrCode();
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

  // gen qr code
  function genQrCode(id) {
    const baseURL = `http://192.168.100.179:8080/profile/${id}`;

    const qrcode = new QRCode(document.createElement("div"), {
      text: baseURL,
      width: 80,
      height: 80,
    });

    const qrCodeImageSrc = qrcode._el.firstChild.toDataURL();
    return qrCodeImageSrc;
  }

  // gen table data
  function generateTable(data = []) {
    const tableEl = $("#table-data");
    const textData = document.getElementById("text-data");
    let html = '';
    if (data.length > 0) {
      textData.style.display = "none";
      $.each(data, function (i, result) {
        html += `      
        <tr id="${result.username}">
          <td style="font-size: 12px; font-weight: 400; text-align: center;">${i + 1}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${result?.userId}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${result?.username}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${result?.fullName}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${result?.phoneNumber}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${result?.email}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${result?.department}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${result?.image}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${getFullTime(result?.createdAt)}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">${getFullTime(result?.modifiedAt)}</td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">
            <img id="qrCode" src=${genQrCode(result?.username)} />
          </td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">
            <img class="img-update-qrcode" style="width:24px; height:24px; cursor: pointer" src="/static/images/icons/fix.png" />
          </td>
          <td style="font-size: 12px; font-weight: 400; text-align: left">
            <img class="img-delete-qrcode" style="width:24px; height:24px; cursor: pointer" src="/static/images/icons/delete.png" />
          </td>
        </tr>`;
      });
    } else {
      loading.css('display', "none");
      textData.style.display = "block";
      textData.style.background = "#F4F4F4 ";
      textData.style.padding = "16px";
      textData.style.boxShadow = "rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px";
      textData.innerHTML = "Không tìm thấy dữ liệu";
    }

    $(tableEl).html(html);
  }

  // delete qr code
  $("#img-delete-qrcode").on("click", function () {
    modalDelete.css("display", "none");
    body.css("overflow", "auto");
  });

  tableEl.on("click", ".img-delete-qrcode", function () {
    const username = $(this).closest("tr").attr("id");
    titleDelete.html("Xoá mã Qr Code");
    contentDelete.html(`Bạn chắc chắn muốn xoá mã Qr Code của tài khoản: ${username}`);
    modalDelete.css("display", "block");
    body.css("overflow", "hidden");

    $("#btn-confirm-delete").on("click", function () {
      deleteQrCode(username);
    });
  });

  function deleteQrCode(username) {
    const token = getCookie("token");

    $.ajax({
      url: 'http://localhost:8080/api/auth/deleteQrCode',
      type: 'DELETE',
      dataType: 'json',
      headers: {
        "token": token,
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "username": username,
      }),
      success: function (response) {
        if (response.code === 200) {
          modalDelete.css("display", "none");
          listQrCode();
          body.css("overflow", "auto");
          customToastify("Xoá mã QR thành công!", { background: BG_TOAST[0] });
        }
        else {
          modalDelete.css("display", "none");
          body.css("overflow", "auto");
          customToastify("Xoá mã QR không thành công!", { background: BG_TOAST[2] });
        }
      },
      error: function (xhr) {
        customToastify("Hệ thống đang bận! Vui lòng thử lại sau!", { background: BG_TOAST[2] });
      },
      complete: function (xhr) { },
    });
  }

  // get qr code + update
  $("#btn-update-back").on("click", function () {
    modalUpdate.css("display", "none");
    body.css("overflow", "auto");
  });

  tableEl.on("click", ".img-update-qrcode", function () {
    const username_ = $(this).closest("tr").attr("id");
    getQrCode(username_);
  });

  function getQrCode(username_) {
    const token = getCookie("token");

    const usernameUpdate = $("#username__update");
    const nameUpdate = $("#fullName-update");
    const passwordUpdate = $("#password-update");
    const departmentUpdate = $("#department-update");
    const userIdUpdate = $("#userId-update");
    const emailUpdate = $("#email-update");
    const imageUpdate = $("#image-update");
    const phoneNumberUpdate = $("#phoneNumber-update");
    const rolesUpdate = $("#roles-update");

    $.ajax({
      url: 'http://localhost:8080/api/auth/getQrCode',
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify({
        username: username_,
      }),
      dataType: 'json',
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      },
      success: function (response) {
        if (+response.code === 200) {
          const data = response.data;
          modalUpdate.css("display", "block");
          body.css("overflow", "hidden");
          usernameUpdate.val(data.username);
          nameUpdate.val(data.fullName);
          passwordUpdate.val(data.password);
          departmentUpdate.val(data.department);
          userIdUpdate.val(data.userId);
          emailUpdate.val(data.email);
          imageUpdate.val(data.image);
          phoneNumberUpdate.val(data.phoneNumber);
          rolesUpdate.val(data.roles);
        }
      },
      error: function (xhr, status, error) {
        customToastify(xhr.responseJSON.message, { background: BG_TOAST[2] });
      },
      complete: function (xhr) { },
    });
  }

  // gen count page
  function generateCountPage(from, limit, total) {
    const fromPage = document.getElementById("fromPage");
    fromPage.innerHTML = from + "-";
    const limitPage = document.getElementById("limitPage");
    limitPage.innerHTML = limit + ' ' + "of";
    const totalPage = document.getElementById("totalPage");
    totalPage.innerHTML = formatTotalPage(total);
  }

  // get list qr code
  function listQrCode(page = 1, limit = 10) {
    const token = getCookie("token");

    $.ajax({
      "url": 'http://localhost:8080/api/auth/listQrCode',
      "method": "POST",
      "headers": {
        "token": token,
        "Content-Type": "application/json",
      },
      "data": JSON.stringify({
        "page": page,
        "limit": limit,
      }),
      beforeSend: function () {
        loading.css('display', "flex");
        tableEl.css('display', "none");
        paginate.css("display", "none");
      },
      success: function (response) {
        if (response.code === 200) {
          const data = response.data.data;
          const totalPages = response.data?.totalPages || 0;
          const totalItems = response.data?.totalItems || 0;
          generateTable(data);
          generateCountPage(page, data.length, totalItems);
          $('#pagination').twbsPagination({
            totalPages,
            visiblePages: 7,
            first: '<svg style="width:18px; height:18px" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="FirstPageIcon"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path></svg>',
            prev: '<svg style="width:18px; height:18px" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateBeforeIcon"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>',
            next: '<svg style="width:18px; height:18px" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateNextIcon"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>',
            last: '<svg style="width:18px; height:18px" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LastPageIcon"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path></svg>',
            onPageClick: function (_, page) {
              listQrCode(page, limit);
            }
          });
        }
      },
      error: function (xhr) {
        customToastify(text = "Hệ thống đang bận! Vui lòng thử lại sau!", { background: BG_TOAST[2] });
      },
      complete: function (xhr) {
        if (xhr.responseJSON.data.totalItems > 0) {
          loading.css('display', "none");
          tableEl.css('display', "table-row-group");
          paginate.css("display", "flex");
        }
        else {
          paginate.css("display", "none");
        }
      },
    })
  }

  // donwload file excel
  function exportToExcel() {
    const table = document.getElementById('table');
    const ws = XLSX.utils.table_to_sheet(table);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Danh sách mã Qr Code.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  $("#myBtn-download").on("click", function () {
    exportToExcel();
  });
})(jQuery);