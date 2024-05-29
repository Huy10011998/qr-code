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
  let btnSearch = $("#myBtn-search");
  let btnReset = $("#myBtn-reset");
  let filterSort = $("#filterDropdownSort");
  let filterDropdownFollow = $('#filterDropdownFollow');
  let inputFilterValue = $("#inputFilterValue");
  let closeInputSearch = $("#close-inputSearch");
  let inputDateRanger = $("#inputDateRanger");
  let orderBy = 'DESC';
  let valueDropdown = '';
  let limit = 10;
  let page = 1;
  let field = [];
  let value = [];
  var fromDate = null;
  var toDate = null;
  let index;
  let pagePublic;

  listQrCode(page, limit, field, value, fromDate, toDate, orderBy);

  const validateEmail = (email) => {
    switch (true) {
      case email.endsWith("@cholimexfood.com.vn"):
        return email;
      case email.endsWith("@gmail.com.vn"):
        return email;
      case email.endsWith("@gmail.com"):
        return email;
      default:
        const validate = email + "@cholimexfood.com.vn";
        return validate;
    }
  };

  const getFullTime = (date) => {
    return moment(date).format('hh:mm:ss - DD/MM/YYYY');
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

  //change value filterSort
  filterSort.on('change', function () {
    orderBy = ($(this).find(":selected").val());
  });

  //Check value filter drop-down
  filterDropdownFollow.on('change', function (e) {
    valueDropdown = ($(this).find(":selected").val());
    field.pop();
    field.push(valueDropdown);
    index = field.indexOf(valueDropdown);
  });

  //btn search
  btnSearch.on("click", function () {
    value[index] = inputFilterValue.val()
    listQrCode(page, limit, field, value, fromDate, toDate, orderBy);
  });

  //btn reset
  btnReset.on("click", function () {
    location.reload();
  });

  // check input search
  inputFilterValue.on('input', function (e) {
    if (inputFilterValue.val()) {
      closeInputSearch.css('display', 'flex');
    } else {
      closeInputSearch.css('display', 'none');
    }
  })

  //btn closeInputSearch
  closeInputSearch.on("click", function () {
    inputFilterValue.val('');
    filterDropdownFollow.val('');
    $(this).css('display', 'none');
  });

  // logout
  function logout() {
    $.ajax({
      url: `${host}/api/auth/logout`,
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

  //all btn
  $("#btn-img-save-confirm").on("click", function () {
    $("#myModal-Image").css("display", "none");
  });

  $("#btn-img-confirm-update").on("click", function () {
    $("#myModal-Image-Update").css("display", "none");
  });

  $("#btn-logout-back").on("click", function () {
    $("#myModal-Logout").css("display", "none");
  });

  $("#btn-img-back").on("click", function () {
    $("#myModal-Image").css("display", "none");
    $("#inputImportImage").val("");
  });

  $("#btn-img-update-back").on("click", function () {
    $("#myModal-Image-Update").css("display", "none");
    $("#inputImportUpdateImage").val("");
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
        if (window.location.pathname !== `${host}` && window.location.pathname !== `${host}/`) {
          sidebarList.css('background', "#f50002");
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
        if (window.location.pathname !== `${host}` && window.location.pathname !== `${host}/`) {
          sidebarList.css('background', "transparent");
        } else {
          sidebarList.css('background', "#f50002");
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

  function createQrCode(img) {
    const token = getCookie("token");

    const username = $("#username__");
    const name = $("#fullName");
    const password = $("#password");
    const department = $("#department");
    const userId = $("#userId");
    const email = $("#email");
    const image = $("#inputImportImage");
    const phoneNumber = $("#phoneNumber");
    const roles = $("#roles");
    const nameEng = $("#fullName_en");
    const departmentEng = $("#department_en");

    $.ajax({
      url: `${host}/api/auth/createQrCode`,
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify({
        username: username.val(),
        fullName: name.val(),
        password: password.val(),
        department: department.val(),
        userId: userId.val(),
        email: validateEmail(email.val()),
        image: img,
        phoneNumber: phoneNumber.val(),
        roles: [roles.val()],
        fullName_en: nameEng.val(),
        department_en: departmentEng.val()
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
          listQrCode(page, limit, field, value, fromDate = null, toDate = null, orderBy);
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
        nameEng.val("");
        departmentEng.val("");
      },
    });
  }

  $("#btn-create-accept").on("click", function () {
    if (compressedDataURL) {
      createQrCode(compressedDataURL);
    }
  });

  // check disabled btn create
  function checkInputsCreate() {
    let inputs = [
      $('#username__'),
      $('#fullName'),
      $('#password'),
      $('#department'),
      $('#userId'),
      $('#email'),
      $('#inputImportImage'),
      $('#phoneNumber'),
      $('#roles'),
      $('#fullName_en'),
      $('#department_en')
    ];

    let allInputsFilled = inputs.every(function (input) {
      return input.val().length > 0;
    });

    $("#btn-create-accept").prop("disabled", !allInputsFilled);
  }

  $('#username__, #fullName, #fullName_en,#password, #department,#department_en, #userId, #email, #inputImportImage, #phoneNumber, #roles').on('input', function () {
    checkInputsCreate();
  });

  //check disabled btn import
  function checkInputImport() {
    const input = $("#inputImport");
    const file = input[0].files[0];

    const inputFilled = file !== undefined && file.name.length > 0;

    $("#btn-create-import").prop("disabled", !inputFilled);
  }

  $('#inputImport').on('change', function () {
    checkInputImport();
  });

  // check disabled btn update
  // Khởi tạo state
  let inputValues = {};

  function initializeInputValues() {
    let inputs = [
      'username__update',
      'password-update',
      'fullName-update',
      'fullName-update-en',
      'email-update',
      'department-update',
      'department-update-en',
      'phoneNumber-update',
      'roles-update',
      'userId-update'
    ];

    inputs.forEach(function (input) {
      inputValues[input] = $('#' + input).val().trim(); // Lưu giá trị ban đầu vào state
    });
  }

  function checkInputsUpdate() {
    let anyInputChange = false; // Biến đánh dấu sự thay đổi

    for (let input in inputValues) {
      let currentValue = $('#' + input).val().trim();
      if (inputValues[input] !== currentValue) {
        anyInputChange = true; // Đánh dấu sự thay đổi khi tìm thấy một trường đã thay đổi
        break;
      }
    }

    // Vô hiệu hóa nút nếu không có sự thay đổi hoặc tất cả các trường đều rỗng hoặc các thay đổi giống như ban đầu
    $("#btn-update-accept").prop("disabled", !anyInputChange || Object.values(inputValues).every(value => value === ''));

  }

  // Khởi tạo giá trị ban đầu và xử lý sự kiện thay đổi
  $(document).ready(function () {
    initializeInputValues();

    $('input').on('input', function () {
      let inputId = $(this).attr('id');
      inputValues[inputId] = $(this).val().trim(); // Cập nhật giá trị trong state
      checkInputsUpdate();
    });
  });

  // gen qr code card visit
  function genQrCodeCardVisit(id) {
    const baseURL = `${host}/profile/${id}`;

    const qrcode = new QRCode(document.createElement("div"), {
      text: baseURL,
      width: 80,
      height: 80,
      colorDark: '#000',
      colorLight: '#fff',
      correctLevel: QRCode.CorrectLevel.H
    });

    const qrCodeImageSrc = qrcode._el.firstChild.toDataURL();
    return qrCodeImageSrc;
  }

  // selection item show list
  $('#pageSizeLimit').on('change', function () {
    const pageSizeLimit = +$(this).find(":selected").val();
    listQrCode(page, pageSizeLimit, field, value, fromDate, toDate, orderBy);
  });

  // gen count page
  function generateCountPage(from, limit, total) {
    const fromPage = document.getElementById("fromPage");
    fromPage.innerHTML = from + "-";
    const limitPage = document.getElementById("limitPage");
    limitPage.innerHTML = limit + ' ' + "of";
    const totalPage = document.getElementById("totalPage");
    totalPage.innerHTML = total;

    $('#pageSizeLimit option[value=""]').val(total);
  }

  // gen table data
  function generateTable(data = [], startItem) {
    const stt = startItem;
    const tableEl = $("#table-data");
    const textData = document.getElementById("text-data");
    let html = '';
    if (data.length > 0) {
      textData.style.display = "none";
      $.each(data, function (i, result) {
        html += `      
        <tr id="${result.userId}" _id="${result._id}">
          <td style="font-size: 13px; font-weight: 400; text-align: center;">${i + stt}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${result?.userId}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${result?.fullName}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${result?.fullName_en}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${result?.phoneNumber}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${result?.email}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${result?.department}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${result?.department_en}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${getFullTime(result?.createdAt)}</td>
          <td style="font-size: 13px; font-weight: 400; text-align: left">${getFullTime(result?.modifiedAt)}</td>
          <td style="text-align: left">
            <img id="qrCodeCardVisit" src=${genQrCodeCardVisit(result?._id)} />
          </td>
          <td style="text-align: left">
            <img class="img-update-qrcode" style="width:24px; height:24px; cursor: pointer" src="${host}/static/images/icons/fix.png" />
          </td>
          ${result.roles[0] === "64c8ac29ed7c1ebd4726d28a" ? `
            <td style="text-align: left">
              <img class="img-delete-qrcode" style="width:24px; height:24px; cursor: pointer" src="${host}/static/images/icons/delete.png" />
            </td>
          ` : `
            <td></td>
          `}
          <td>
            <input style="width:20px; height:20px;" class="checkBox" type="checkbox" />
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

  tableEl.on("click", ".img-delete-qrcode", function (event) {
    event.stopPropagation();

    const userId = $(this).closest("tr").attr("id");
    titleDelete.html("Xoá mã Qr Code");
    contentDelete.html(`Bạn chắc chắn muốn xoá mã Qr Code của tài khoản: ${userId}`);
    modalDelete.css("display", "block");
    body.css("overflow", "hidden");

    $("#btn-confirm-delete").off("click").on("click", function () {
      deleteQrCode(userId);
      $("#btn-confirm-delete").off("click");
    });
  });

  // redirect page employee
  tableEl.on("click", "tr", function () {
    var resultId = $(this).attr("_id");
    window.open("/profile/" + resultId, "_blank");
  });

  // api deleteQrCode
  function deleteQrCode(userId) {
    const token = getCookie("token");

    $.ajax({
      url: `${host}/api/auth/deleteQrCode`,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        "token": token,
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "userId": userId,
      }),
      success: function (response) {
        if (response.code === 200) {
          modalDelete.css("display", "none");
          listQrCode(page, limit, field = [], value = [], fromDate = null, toDate = null, orderBy);
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
    $("#btn-update-accept").prop("disabled", "true");
  });

  // click show popup update info
  tableEl.on("click", ".img-update-qrcode", function (event) {
    event.stopPropagation();
    $("#btn-update-accept").prop("disabled", "true");
    const userId_ = $(this).closest("tr").attr("id");
    getQrCode(userId_);

    $("#btn-update-accept").off("click").on("click", function () {
      updateQrCode(userId_, compressedDataURLUpdate);
      $("#inputImportUpdateImage").val("");
      $("#btn-update-accept").off("click");
    });
  });

  function getQrCode(userId_) {
    const token = getCookie("token");

    const usernameUpdate = $("#username__update");
    const nameUpdate = $("#fullName-update");
    const passwordUpdate = $("#password-update");
    const departmentUpdate = $("#department-update");
    const userIdUpdate = $("#userId-update");
    const emailUpdate = $("#email-update");
    const phoneNumberUpdate = $("#phoneNumber-update");
    const rolesUpdate = $("#roles-update");
    const departmentEngUpdate = $("#department-update-en");
    const nameEngUpdate = $("#fullName-update-en");
    const imageUpdate = $("#value-image-fake");

    $.ajax({
      url: `${host}/api/auth/getQrCode`,
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify({
        userId: userId_,
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
          phoneNumberUpdate.val(data.phoneNumber);
          rolesUpdate.val(data.roles);
          departmentEngUpdate.val(data.department_en);
          nameEngUpdate.val(data.fullName_en);
          imageUpdate.val(data.image);
        }
      },
      error: function (xhr, status, error) {
        customToastify(xhr.responseJSON.message, { background: BG_TOAST[2] });
      },
      complete: function (xhr) { },
    });
  }

  function updateQrCode(userId_, img) {
    const token = getCookie("token");

    const usernameUpdate = $("#username__update");
    const nameUpdate = $("#fullName-update");
    const passwordUpdate = $("#password-update");
    const departmentUpdate = $("#department-update");
    const userIdUpdate = $("#userId-update");
    const emailUpdate = $("#email-update");
    const phoneNumberUpdate = $("#phoneNumber-update");
    const rolesUpdate = $("#roles-update");
    const departmentEngUpdate = $("#department-update-en");
    const nameEngUpdate = $("#fullName-update-en");
    const imageUpdate = $("#value-image-fake");

    $.ajax({
      url: `${host}/api/auth/updateQrCode/${userId_}`,
      method: "PUT",
      contentType: 'application/json',
      data: JSON.stringify({
        username: usernameUpdate.val(),
        fullName: nameUpdate.val(),
        password: passwordUpdate.val(),
        department: departmentUpdate.val(),
        userId: userIdUpdate.val(),
        email: emailUpdate.val(),
        image: !compressedDataURLUpdate ? imageUpdate.val() : img,
        phoneNumber: phoneNumberUpdate.val(),
        roles: [rolesUpdate.val()],
        fullName_en: nameEngUpdate.val(),
        department_en: departmentEngUpdate.val()
      }),
      dataType: 'json',
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      },
      success: function (response) {
        if (+response.code === 200) {
          modalUpdate.css("display", "none");
          body.css("overflow", "auto");
          listQrCode(page, limit, field = [], value = [], fromDate = null, toDate = null, orderBy);
          customToastify("Cập nhật mã QR thành công!", { background: BG_TOAST[0] });
        }
      },
      error: function (xhr, status, error) {
        customToastify(xhr.responseJSON.message, { background: BG_TOAST[2] });
      },
      complete: function (xhr) { },
    });
  }

  // get list qr code
  function listQrCode(page, limit, field, value, fromDate, toDate, orderBy) {
    const token = getCookie("token");

    function fetchQrCodes(page, limit, field, value, fromDate, toDate, orderBy) {
      $.ajax({
        url: `${host}/api/auth/listQrCode`,
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json;charset=UTF-8",
        },
        data: JSON.stringify({
          page: page,
          limit: limit,
          field: field,
          value: value,
          fromDate: fromDate,
          toDate: toDate,
          orderBy: orderBy,
        }),
        beforeSend: function () {
          loading.css("display", "flex");
          tableEl.css("display", "none");
          paginate.css("display", "none");
        },
        success: function (response) {
          if (response.code === 200) {
            const data = response.data.data;
            const totalPages = response.data?.totalPages || 0;
            const totalItems = response.data?.totalItems || 0;
            const endItem = response.data?.endItem || 0;
            const startItem = response.data?.startItem || 0;
            generateTable(data, startItem);
            generateCountPage(startItem, endItem, totalItems);
            $('#pagination').twbsPagination('destroy');
            $('#pagination').twbsPagination({
              totalPages,
              visiblePages: 5,
              startPage: page,
              first: `<svg style="width:18px; height:18px" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="FirstPageIcon">
                        <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path>
                      </svg>`,
              prev: `<svg style="width:18px; height:18px" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateBeforeIcon">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                      </svg>`,
              next: `<svg style="width:18px; height:18px" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateNextIcon">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                      </svg>`,
              last: `<svg data-page=${pagePublic} data-api=${totalPages} style="width:18px; height:18px" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LastPageIcon">
                        <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path>
                      </svg>`,
              onPageClick: function (_, newPage) {
                pagePublic = newPage;
                if (pagePublic !== page) {
                  fetchQrCodes(pagePublic, limit, field, value, fromDate, toDate, orderBy);
                }
              },
            });
          }
        },
        error: function (xhr) {
          customToastify("Hệ thống đang bận! Vui lòng thử lại sau!", { background: BG_TOAST[2] });
        },
        complete: function (xhr) {
          if (xhr.responseJSON.data.totalItems > 0) {
            loading.css("display", "none");
            tableEl.css("display", "table-row-group");
            paginate.css("display", "flex");
          } else {
            paginate.css("display", "none");
          }
        },
      });
    }

    fetchQrCodes(page, limit, field, value, fromDate, toDate, orderBy);
  }

  // donwload file excel
  function exportToExcel() {
    const table = document.getElementById('table');
    const rows = table.getElementsByTagName('tr');
    let totalRows = rows.length;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");

    sheet.columns = [
      // {
      //   header: "STT",
      //   key: "stt",
      // },
      {
        header: "Mã nhân viên",
        key: "userId",
      },
      {
        header: "Họ tên",
        key: "fullName_vi",
      },
      {
        header: "Họ tên(Eng)",
        key: "fullName_en",
      },
      {
        header: "Số điện thoại",
        key: "numberPhone",
      },
      {
        header: "Email",
        key: "email",
      },
      {
        header: "Phòng ban",
        key: "department",
      },
      {
        header: "Phòng ban(Eng)",
        key: "department_en",
      },
      {
        header: "QRCODE",
        key: "qrCodeCardVisit",
      },
      // {
      //   header: "CardEmployee",
      //   key: "qrCodeCardEmployee",
      // },
    ];

    let exportAll = false;
    let checkedCount = 0;
    let imageRowIndex = 1;

    Array.from(rows).forEach((row, rowIndex) => {
      if (rowIndex > 0) {
        const cells = row.getElementsByTagName('td');
        if (cells.length > 0) {
          const checkbox = cells[13].querySelector('input[type="checkbox"]');
          if (!checkbox) {
            return;
          }

          if (checkbox.checked) {
            checkedCount++;
            totalRows = checkedCount;

            sheet.addRow({
              // stt: cells[0].innerHTML,
              userId: cells[1].innerHTML,
              fullName_vi: cells[2].innerHTML,
              fullName_en: cells[3].innerHTML,
              numberPhone: cells[4].innerHTML,
              email: cells[5].innerHTML,
              department: cells[6].innerHTML,
              department_en: cells[7].innerHTML,
            }).commit();

            const imgElementCardVisit = cells[11].querySelector('img');
            // const imgElementCardEmployee = cells[13].querySelector('img');

            const srcVisit = imgElementCardVisit.getAttribute('src');
            // const srcEmployee = imgElementCardEmployee.getAttribute('src');

            const qrCodeVisit = workbook.addImage({
              base64: srcVisit,
              extension: `${cells[2].innerHTML}_visit.png`,
            });

            // const qrCodeEmployee = workbook.addImage({
            //   base64: srcEmployee,
            //   extension: `${cells[2].innerHTML}_employee.png`,
            // });

            sheet.addImage(qrCodeVisit, {
              tl: { col: 7, row: imageRowIndex },
              ext: { width: 80, height: 80 },
            });

            // sheet.addImage(qrCodeEmployee, {
            //   tl: { col: 7, row: imageRowIndex },
            //   ext: { width: 80, height: 80 },
            // });

            // const imageTopLeftVisit = { col: 6, row: imageRowIndex };
            // const imageTopLeftEmployee = { col: 7, row: imageRowIndex };

            // imageTopLeftVisit.row += (imageRowIndex - 1) * imagePadding;
            // imageTopLeftEmployee.row += (imageRowIndex - 1) * imagePadding;

            imageRowIndex++;
          }
        }
      }
    });

    if (checkedCount === 0) {
      exportAll = true;
    }

    if (exportAll) {
      Array.from(rows).forEach((row, rowIndex) => {
        if (rowIndex > 0) {
          const cells = row.getElementsByTagName('td');
          if (cells.length > 0) {
            sheet.addRow({
              // stt: cells[0].innerHTML,
              userId: cells[1].innerHTML,
              fullName_vi: cells[2].innerHTML,
              fullName_en: cells[3].innerHTML,
              numberPhone: cells[4].innerHTML,
              email: cells[5].innerHTML,
              department: cells[6].innerHTML,
              department_en: cells[7].innerHTML,
            }).commit();

            const imgElementCardVisit = cells[11].querySelector('img');
            // const imgElementCardEmployee = cells[13].querySelector('img');

            const srcVisit = imgElementCardVisit.getAttribute('src');
            // const srcEmployee = imgElementCardEmployee.getAttribute('src');

            const qrCodeVisit = workbook.addImage({
              base64: srcVisit,
              extension: `${cells[2].innerHTML}_visit.png`,
            });

            // const qrCodeEmployee = workbook.addImage({
            //   base64: srcEmployee,
            //   extension: `${cells[2].innerHTML}_employee.png`,
            // });

            sheet.addImage(qrCodeVisit, {
              tl: { col: 7, row: imageRowIndex },
              ext: { width: 80, height: 80 },
            });

            // sheet.addImage(qrCodeEmployee, {
            //   tl: { col: 7, row: imageRowIndex },
            //   ext: { width: 80, height: 80 },
            // });

            // const imageTopLeftVisit = { col: 6, row: imageRowIndex };
            // const imageTopLeftEmployee = { col: 7, row: imageRowIndex };

            // imageTopLeftVisit.row += (imageRowIndex - 1) * imagePadding;
            // imageTopLeftEmployee.row += (imageRowIndex - 1) * imagePadding;

            imageRowIndex++;
          }
        }
      });
    }

    for (let i = 2; i <= totalRows; i++) {
      sheet.getRow(i).height = 85;
      sheet.getRow(i).alignment = { vertical: 'middle', horizontal: 'center' };
    }

    sheet.columns.forEach((column) => {
      const maxLength = column.values.reduce((acc, value) => {
        const length = value ? value.toString().length : 0;
        return Math.max(acc, length);
      }, column.header.length);
      column.width = maxLength < 19 ? 19 : maxLength + 2;

      column.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { size: 13, bold: false, name: "Times New Roman" };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
      });
    });

    const borderStyle = {
      style: 'thin',
      color: {
        argb: 'FF000000', // Mã màu đen
      },
    };

    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        const cellStyle = cell.style;
        cellStyle.border = {
          top: borderStyle,
          left: borderStyle,
          bottom: borderStyle,
          right: borderStyle,
        };
      });
    });

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'users.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }

  $("#myBtn-download").on("click", function () {
    exportToExcel();
  });

  // event click checkbox
  function toggleRow(checkbox) {
    const row = checkbox.parentNode.parentNode;
    if (checkbox.checked) {
      row.classList.add('selected');
    } else {
      row.classList.remove('selected');
    }
  }

  tableEl.on("click", ".checkBox", function (event) {
    event.stopPropagation();
    toggleRow(this);
  });

  // get value daterangepicker
  $(function () {
    // var daterangePicker = 
    $('input[name="daterange"]').daterangepicker({
      opens: 'left',
      timePicker: true,
      startDate: moment().format('DD/MM/YYYY 00:00'),
      endDate: moment().format('DD/MM/YYYY 23:59'),
      locale: {
        format: 'DD/MM/YYYY',
      },
      ranges: {
        'Hôm nay': [moment(), moment()],
        '7 ngày qua': [moment().subtract(6, 'days'), moment()],
        '30 ngày qua': [moment().subtract(29, 'days'), moment()],
      }
    }, function (start, end, label) {
      fromDate = start.format('YYYY-MM-DD 00:00');
      toDate = end.format('YYYY-MM-DD 23:59');
    });

    // var defaultStartDate = daterangePicker.data('daterangepicker').startDate.format('YYYY-MM-DD 00:00');
    // var defaultEndDate = daterangePicker.data('daterangepicker').endDate.format('YYYY-MM-DD 23:59');
    // fromDate = defaultStartDate;
    // toDate = defaultEndDate;
  });

  // check dateranger
  // let defaultValue = inputDateRanger.val();

  // checkDefaultValue(defaultValue);

  // inputDateRanger.on("input", function () {
  //   let inputValue = $(this).val();
  //   checkDefaultValue(inputValue);
  // });

  // function checkDefaultValue(value) {
  //   if (value === defaultValue) {
  //     btnSearch.prop("disabled", false);
  //   } else {
  //     btnSearch.prop("disabled", true);
  //   }
  // }

  //get img
  var cropper;
  var compressedDataURL;

  $('#inputImportImage').on('change', function (event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function (loadEvent) {
        $("#myModal-Image").css("display", "block");

        const imageURL = loadEvent.target.result;
        const imageElement = $('<img>');
        imageElement.attr('src', imageURL);
        imageElement.css('width', '100%');
        $('#show-image').html(imageElement);

        cropper = new Cropper(imageElement[0], {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          // autoCropArea: 1,
          cropBoxResizable: true,
        });
      };

      $("#btn-img-save-update").show();
      $("#cropButtonUpdate").show();
      $("#btn-img-confirm-update").css("display", 'none');

      reader.readAsDataURL(file);
    }
  });

  // drop img
  $('#cropButton').on('click', function () {
    if (cropper) {
      var cropData = cropper.getData();
      var canvas = cropper.getCroppedCanvas({
        width: cropData.width,
        height: cropData.height,
        imageSmoothingEnabled: true,
      });

      $('#show-image').html(canvas);

      canvas.toBlob(function (blob) {
        var reader = new FileReader();

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
          var image = new Image();

          image.onload = function () {
            var compressedCanvas = document.createElement('canvas');
            var ctx = compressedCanvas.getContext('2d');

            var maxWidth = 600;
            var maxHeight = 600;

            var width = image.width;
            var height = image.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            compressedCanvas.width = width;
            compressedCanvas.height = height;

            ctx.drawImage(image, 0, 0, width, height);

            compressedDataURL = compressedCanvas.toDataURL('image/jpeg', 0.6);
          };

          image.src = reader.result;

          $("#btn-img-save").hide();
          $("#cropButton").hide();
          $("#btn-img-save-confirm").css("display", 'flex');
        };
      }, 'image/jpeg', 0.6);
    }
  });

  // save img
  $("#btn-img-save").on('click', function () {
    var imageElement = $('#show-image img')[0];
    var image = new Image();

    image.onload = function () {
      var compressedCanvas = document.createElement('canvas');
      var ctx = compressedCanvas.getContext('2d');

      var maxWidth = 600;
      var maxHeight = 600;

      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      compressedCanvas.width = width;
      compressedCanvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);

      compressedDataURL = compressedCanvas.toDataURL('image/jpeg', 0.6);

      $('#show-image-update').html('<img src="' + compressedDataURL + '">');

      $("#btn-img-save").hide();
      $("#cropButton").hide();
      $("#btn-img-save-confirm").css("display", 'flex');
    };

    image.src = imageElement.src;
  });

  //update img
  var cropperUpdate;
  var compressedDataURLUpdate;

  $('#inputImportUpdateImage').on('change', function (event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function (loadEvent) {
        $("#myModal-Image-Update").css("display", "block");

        const imageURL = loadEvent.target.result;
        const imageElement = $('<img>');
        imageElement.attr('src', imageURL);
        imageElement.css('width', '100%');
        $('#show-image-update').html(imageElement);

        cropperUpdate = new Cropper(imageElement[0], {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          // autoCropArea: 1,
          cropBoxResizable: true,
        });
      };

      $("#btn-img-save-update").show();
      $("#cropButtonUpdate").show();
      $("#btn-img-confirm-update").css("display", 'none');

      reader.readAsDataURL(file);
    }
  });

  $('#cropButtonUpdate').on('click', function () {
    if (cropperUpdate) {
      var cropData = cropperUpdate.getData();
      var canvas = cropperUpdate.getCroppedCanvas({
        width: cropData.width,
        height: cropData.height,
        imageSmoothingEnabled: true,
      });

      $('#show-image-update').html(canvas);

      canvas.toBlob(function (blob) {
        var reader = new FileReader();

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
          var image = new Image();

          image.onload = function () {
            var compressedCanvas = document.createElement('canvas');
            var ctx = compressedCanvas.getContext('2d');

            var maxWidth = 600;
            var maxHeight = 600;

            var width = image.width;
            var height = image.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            compressedCanvas.width = width;
            compressedCanvas.height = height;

            ctx.drawImage(image, 0, 0, width, height);

            compressedDataURLUpdate = compressedCanvas.toDataURL('image/jpeg', 0.6);
          };

          image.src = reader.result;

          $("#btn-img-save-update").hide();
          $("#cropButtonUpdate").hide();
          $("#btn-img-confirm-update").css("display", 'flex');
        };
      }, 'image/jpeg', 0.6);
    }

  });

  $("#btn-img-save-update").on('click', function () {
    var imageElement = $('#show-image-update img')[0];
    var image = new Image();

    image.onload = function () {
      var compressedCanvas = document.createElement('canvas');
      var ctx = compressedCanvas.getContext('2d');

      var maxWidth = 600;
      var maxHeight = 600;

      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      compressedCanvas.width = width;
      compressedCanvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);

      compressedDataURLUpdate = compressedCanvas.toDataURL('image/jpeg', 0.6);

      $('#show-image-update').html('<img src="' + compressedDataURLUpdate + '">');

      $("#btn-img-save-update").hide();
      $("#cropButtonUpdate").hide();
      $("#btn-img-confirm-update").css("display", 'flex');
    };

    image.src = imageElement.src;
  });

})(jQuery);
