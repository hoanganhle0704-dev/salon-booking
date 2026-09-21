// ==========================================================================
// Thang Ngo Hair Studio - Core Application Logic
// ==========================================================================

const STORAGE_KEY = "thang_ngo_salon_bookings";

// Global Application State
const appState = {
  currentStep: 1,
  selectedServiceIds: [],
  selectedStylistId: "any",
  selectedDate: "",
  selectedTime: "",
  customer: {
    name: "",
    phone: "",
    note: ""
  },
  bookings: []
};

// ==========================================================================
// 1. Khởi tạo và Nạp Dữ Liệu
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadBookingsFromStorage();
  initDefaultDate();
  renderServiceMenu();
  renderStylistsShowcase();
  renderBookingStep1();
  renderBookingStep2();
  renderBookingStep3Dates();
  renderBookingStep3TimeSlots();
  setupEventListeners();
  updateWizardUI();
  updateBookingSummary();
  updateAdminStats();
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

function loadBookingsFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appState.bookings = JSON.parse(saved);
    } catch (e) {
      console.error("Lỗi đọc dữ liệu localStorage:", e);
      appState.bookings = [...SALON_DATA.initialBookings];
    }
  } else {
    appState.bookings = [...SALON_DATA.initialBookings];
    saveBookingsToStorage();
  }
}

function saveBookingsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.bookings));
  updateAdminStats();
}

function initDefaultDate() {
  // Mặc định chọn ngày mai
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  appState.selectedDate = tomorrow.toISOString().split("T")[0];
  appState.selectedTime = "10:00"; // Giờ mặc định
}

// ==========================================================================
// 2. Render Giao Diện Showcase (Dịch vụ & Stylist)
// ==========================================================================
function renderServiceMenu(activeCategoryId = "all") {
  const filterContainer = document.getElementById("serviceCategoryFilter");
  const gridContainer = document.getElementById("servicesGrid");
  if (!filterContainer || !gridContainer) return;

  // Render Tabs
  filterContainer.innerHTML = SALON_DATA.categories.map(cat => `
    <button 
      class="px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${
        cat.id === activeCategoryId 
          ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
      }"
      onclick="handleFilterCategory('${cat.id}')">
      ${cat.name}
    </button>
  `).join("");

  // Filter items
  const filteredServices = activeCategoryId === "all" 
    ? SALON_DATA.services 
    : SALON_DATA.services.filter(s => s.category === activeCategoryId);

  // Render Cards
  gridContainer.innerHTML = filteredServices.map(srv => `
    <div class="minimal-card rounded-2xl p-6 flex flex-col justify-between relative group">
      ${srv.popular ? `
        <span class="absolute top-4 right-4 bg-stone-100 border border-stone-200 text-stone-800 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
          Phổ biến
        </span>
      ` : ''}
      <div>
        <div class="text-[11px] text-stone-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-stone-400"></i>
          Khoảng ${srv.duration} phút
        </div>
        <h3 class="font-serif text-xl font-medium text-stone-900 group-hover:text-amber-800 transition">
          ${srv.name}
        </h3>
        <p class="text-stone-600 text-xs mt-2.5 leading-relaxed font-light">
          ${srv.description}
        </p>
      </div>

      <div class="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span class="text-[10px] text-stone-400 uppercase tracking-wider block">Giá niêm yết</span>
          <span class="font-serif text-lg font-bold text-stone-900">${formatCurrency(srv.price)}</span>
        </div>
        <button 
          onclick="selectServiceAndStartBooking('${srv.id}')"
          class="text-xs bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-1">
          <span>Đặt lịch</span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

window.handleFilterCategory = function(catId) {
  renderServiceMenu(catId);
};

window.selectServiceAndStartBooking = function(serviceId) {
  if (!appState.selectedServiceIds.includes(serviceId)) {
    appState.selectedServiceIds.push(serviceId);
  }
  goToStep(1);
  renderBookingStep1();
  updateBookingSummary();
  const el = document.getElementById("booking-section");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

function renderStylistsShowcase() {
  const container = document.getElementById("stylistsGrid");
  if (!container) return;

  // Lọc bỏ mục 'any' trong showcase
  const displayStylists = SALON_DATA.stylists.filter(st => st.id !== "any");

  container.innerHTML = displayStylists.map(st => `
    <div class="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col group">
      <div class="aspect-[4/5] overflow-hidden bg-stone-100 relative">
        <img src="${st.avatar}" alt="${st.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <span class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-stone-900 text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
          ${st.badge}
        </span>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-lg font-bold text-stone-900">${st.name}</h3>
            <span class="text-xs font-semibold text-stone-800 flex items-center gap-1">
              ★ ${st.rating}
            </span>
          </div>
          <div class="text-xs text-stone-500 font-medium mt-0.5">${st.role}</div>
          <p class="text-stone-600 text-xs mt-2.5 leading-relaxed font-light">${st.exp}</p>
        </div>
        <button 
          onclick="selectStylistAndStartBooking('${st.id}')"
          class="w-full mt-2 border border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white text-stone-800 py-2 rounded-xl text-xs font-medium transition">
          Đặt Lịch Cùng ${st.name}
        </button>
      </div>
    </div>
  `).join("");
}

window.selectStylistAndStartBooking = function(stylistId) {
  appState.selectedStylistId = stylistId;
  renderBookingStep2();
  updateBookingSummary();
  const el = document.getElementById("booking-section");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// ==========================================================================
// 3. Render Booking Wizard (4 Bước)
// ==========================================================================

// Bước 1: Danh sách dịch vụ để chọn
function renderBookingStep1() {
  const container = document.getElementById("bookingServiceList");
  if (!container) return;

  const countBadge = document.getElementById("selectedServiceCount");
  if (countBadge) countBadge.textContent = appState.selectedServiceIds.length;

  container.innerHTML = SALON_DATA.services.map(srv => {
    const isSelected = appState.selectedServiceIds.includes(srv.id);
    return `
      <div 
        class="service-card p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 ${
          isSelected 
            ? 'selected border-stone-900 bg-stone-50/80 shadow-sm' 
            : 'border-stone-200 bg-white hover:border-stone-400'
        }"
        onclick="toggleServiceSelection('${srv.id}')">
        
        <div class="flex items-start gap-3">
          <div class="mt-1 w-4 h-4 rounded border flex items-center justify-center transition ${
            isSelected ? 'bg-stone-900 border-stone-900 text-white' : 'border-stone-400 bg-white'
          }">
            ${isSelected ? '<i data-lucide="check" class="w-3 h-3"></i>' : ''}
          </div>
          <div>
            <div class="font-medium text-stone-900 text-sm">${srv.name}</div>
            <div class="text-[11px] text-stone-500 mt-0.5 line-clamp-1">${srv.description}</div>
            <div class="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3"></i>
              ${srv.duration} phút
            </div>
          </div>
        </div>

        <div class="font-serif font-bold text-stone-900 text-sm whitespace-nowrap">
          ${formatCurrency(srv.price)}
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

window.toggleServiceSelection = function(srvId) {
  const index = appState.selectedServiceIds.indexOf(srvId);
  if (index > -1) {
    appState.selectedServiceIds.splice(index, 1);
  } else {
    appState.selectedServiceIds.push(srvId);
  }
  renderBookingStep1();
  updateBookingSummary();
};

// Bước 2: Danh sách Stylist để chọn
function renderBookingStep2() {
  const container = document.getElementById("bookingStylistList");
  if (!container) return;

  container.innerHTML = SALON_DATA.stylists.map(st => {
    const isSelected = appState.selectedStylistId === st.id;
    return `
      <div 
        class="stylist-card p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center gap-4 ${
          isSelected 
            ? 'selected border-stone-900 bg-stone-50/80 shadow-sm' 
            : 'border-stone-200 bg-white hover:border-stone-400'
        }"
        onclick="chooseStylist('${st.id}')">
        
        <img src="${st.avatar}" alt="${st.name}" class="w-14 h-14 rounded-full object-cover border border-stone-200 shrink-0">
        
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-stone-900 text-sm truncate">${st.name}</h4>
            <span class="text-xs font-semibold text-stone-800">★ ${st.rating}</span>
          </div>
          <p class="text-xs text-stone-500 truncate">${st.role}</p>
          <p class="text-[11px] text-stone-400 mt-0.5 line-clamp-1">${st.exp}</p>
        </div>

        <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
          isSelected ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300'
        }">
          ${isSelected ? '<span class="w-2 h-2 bg-white rounded-full"></span>' : ''}
        </div>
      </div>
    `;
  }).join("");
}

window.chooseStylist = function(stylistId) {
  appState.selectedStylistId = stylistId;
  renderBookingStep2();
  updateBookingSummary();
};

// Bước 3: Chọn Ngày và Giờ
function renderBookingStep3Dates() {
  const pillsContainer = document.getElementById("quickDatePills");
  const customDatePicker = document.getElementById("customDatePicker");
  if (!pillsContainer || !customDatePicker) return;

  const today = new Date();
  const dates = [
    { label: "Hôm nay", offset: 0 },
    { label: "Ngày mai", offset: 1 },
    { label: "Ngày kia", offset: 2 }
  ];

  pillsContainer.innerHTML = dates.map(d => {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + d.offset);
    const dateStr = targetDate.toISOString().split("T")[0];
    const isSelected = appState.selectedDate === dateStr;

    // Định dạng ngày hiển thị (VD: 22/09)
    const displayDay = `${targetDate.getDate()}/${targetDate.getMonth() + 1}`;

    return `
      <button 
        type="button"
        class="py-2 px-3 rounded-lg border text-xs font-medium text-center transition ${
          isSelected 
            ? 'bg-stone-900 text-white border-stone-900' 
            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
        }"
        onclick="handleSelectDate('${dateStr}')">
        <span class="block font-semibold">${d.label}</span>
        <span class="text-[10px] opacity-80">${displayDay}</span>
      </button>
    `;
  }).join("");

  // Min date là hôm nay
  const minDateStr = today.toISOString().split("T")[0];
  customDatePicker.min = minDateStr;
  customDatePicker.value = appState.selectedDate;

  customDatePicker.onchange = (e) => {
    handleSelectDate(e.target.value);
  };

  const displayEl = document.getElementById("selectedDateDisplay");
  if (displayEl) {
    const parts = appState.selectedDate.split("-");
    if (parts.length === 3) {
      displayEl.textContent = `Ngày: ${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
}

window.handleSelectDate = function(dateStr) {
  if (!dateStr) return;
  appState.selectedDate = dateStr;
  renderBookingStep3Dates();
  renderBookingStep3TimeSlots();
  updateBookingSummary();
};

function renderBookingStep3TimeSlots() {
  const container = document.getElementById("bookingTimeSlotGrid");
  if (!container) return;

  // Kiểm tra xem slot nào đã bị đặt kín cho stylist đã chọn trong ngày đã chọn
  // (Nếu stylist là 'any' thì slot vẫn khả dụng nếu chưa kín hết tất cả thợ)
  const bookedSlots = appState.bookings
    .filter(b => b.date === appState.selectedDate && b.status !== "cancelled")
    .filter(b => appState.selectedStylistId === "any" || b.stylistId === appState.selectedStylistId)
    .map(b => b.time);

  container.innerHTML = SALON_DATA.timeSlots.map(slot => {
    const isBooked = bookedSlots.filter(t => t === slot).length >= 2; // Giả sử mỗi slot nhận tối đa 2 khách cùng lúc
    const isSelected = appState.selectedTime === slot;

    if (isBooked) {
      return `
        <div class="time-slot py-2.5 px-2 rounded-lg border border-stone-200 bg-stone-100 text-stone-400 text-xs text-center cursor-not-allowed line-through" title="Khung giờ này đã kín">
          ${slot}
        </div>
      `;
    }

    return `
      <button 
        type="button"
        class="time-slot py-2.5 px-2 rounded-lg border text-xs font-medium text-center transition ${
          isSelected 
            ? 'selected bg-stone-900 text-white border-stone-900' 
            : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
        }"
        onclick="handleSelectTime('${slot}')">
        ${slot}
      </button>
    `;
  }).join("");
}

window.handleSelectTime = function(timeStr) {
  appState.selectedTime = timeStr;
  renderBookingStep3TimeSlots();
  updateBookingSummary();
};

// Cập nhật Tóm Tắt Lịch Hẹn (Summary Sidebar)
function updateBookingSummary() {
  const summaryStylist = document.getElementById("summaryStylist");
  const summaryDateTime = document.getElementById("summaryDateTime");
  const summaryDuration = document.getElementById("summaryDuration");
  const summaryServicesList = document.getElementById("summaryServicesList");
  const summaryTotalPrice = document.getElementById("summaryTotalPrice");

  const stylistObj = SALON_DATA.stylists.find(s => s.id === appState.selectedStylistId);
  if (summaryStylist) {
    summaryStylist.textContent = stylistObj ? stylistObj.name : "Chưa chọn";
  }

  if (summaryDateTime) {
    if (appState.selectedDate && appState.selectedTime) {
      const p = appState.selectedDate.split("-");
      summaryDateTime.textContent = `${appState.selectedTime} • ${p[2]}/${p[1]}/${p[0]}`;
    } else {
      summaryDateTime.textContent = "Chưa chọn";
    }
  }

  // Tính tổng dịch vụ
  const selectedObjects = SALON_DATA.services.filter(s => appState.selectedServiceIds.includes(s.id));
  const totalDuration = selectedObjects.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = selectedObjects.reduce((sum, s) => sum + s.price, 0);

  if (summaryDuration) {
    summaryDuration.textContent = totalDuration > 0 ? `~${totalDuration} phút` : "0 phút";
  }

  if (summaryTotalPrice) {
    summaryTotalPrice.textContent = formatCurrency(totalPrice);
  }

  if (summaryServicesList) {
    if (selectedObjects.length === 0) {
      summaryServicesList.innerHTML = '<span class="text-stone-400 italic">Chưa chọn dịch vụ nào</span>';
    } else {
      summaryServicesList.innerHTML = selectedObjects.map(s => `
        <div class="flex justify-between items-center">
          <span class="truncate pr-2">• ${s.name}</span>
          <span class="text-stone-500 whitespace-nowrap">${formatCurrency(s.price)}</span>
        </div>
      `).join("");
    }
  }
}

// Chuyển Bước Wizard
function goToStep(stepNumber) {
  // Validate khi đi tới bước tiếp theo
  if (stepNumber > appState.currentStep) {
    if (appState.currentStep === 1 && appState.selectedServiceIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 dịch vụ trước khi tiếp tục!");
      return;
    }
    if (appState.currentStep === 2 && !appState.selectedStylistId) {
      appState.selectedStylistId = "any";
    }
    if (appState.currentStep === 3 && (!appState.selectedDate || !appState.selectedTime)) {
      alert("Vui lòng chọn ngày và giờ hẹn mong muốn!");
      return;
    }
  }

  appState.currentStep = stepNumber;
  updateWizardUI();
}

function updateWizardUI() {
  const steps = [1, 2, 3, 4];
  steps.forEach(st => {
    const container = document.getElementById(`step${st}Container`);
    if (container) {
      if (st === appState.currentStep) {
        container.classList.remove("hidden");
        container.classList.add("animate-fade-in");
      } else {
        container.classList.add("hidden");
        container.classList.remove("animate-fade-in");
      }
    }

    // Cập nhật Step Indicator Header
    const stepIndicator = document.querySelector(`.step-item[data-step="${st}"]`);
    if (stepIndicator) {
      const numberEl = stepIndicator.querySelector(".step-number");
      const labelEl = stepIndicator.querySelector("span");
      if (st === appState.currentStep) {
        stepIndicator.classList.add("active");
        stepIndicator.classList.remove("completed");
        if (numberEl) {
          numberEl.className = "step-number w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-stone-900 bg-stone-900 text-white flex items-center justify-center font-semibold text-xs sm:text-sm";
        }
        if (labelEl) labelEl.className = "text-[11px] sm:text-xs font-semibold text-stone-900";
      } else if (st < appState.currentStep) {
        stepIndicator.classList.add("completed");
        stepIndicator.classList.remove("active");
        if (numberEl) {
          numberEl.className = "step-number w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-stone-400 bg-stone-200 text-stone-800 flex items-center justify-center font-semibold text-xs sm:text-sm";
        }
        if (labelEl) labelEl.className = "text-[11px] sm:text-xs font-medium text-stone-600";
      } else {
        stepIndicator.classList.remove("active", "completed");
        if (numberEl) {
          numberEl.className = "step-number w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-stone-200 text-stone-400 flex items-center justify-center font-semibold text-xs sm:text-sm";
        }
        if (labelEl) labelEl.className = "text-[11px] sm:text-xs font-medium text-stone-400";
      }
    }
  });

  // Nút Quay Lại
  const btnPrev = document.getElementById("btnPrevStep");
  if (btnPrev) {
    if (appState.currentStep > 1) {
      btnPrev.classList.remove("hidden");
    } else {
      btnPrev.classList.add("hidden");
    }
  }

  // Nút Tiếp Tục / Hoàn Tất
  const btnNextText = document.getElementById("btnNextText");
  const btnNextIcon = document.getElementById("btnNextIcon");
  if (btnNextText) {
    if (appState.currentStep === 1) btnNextText.textContent = "Tiếp tục: Chọn Stylist";
    else if (appState.currentStep === 2) btnNextText.textContent = "Tiếp tục: Chọn Ngày & Giờ";
    else if (appState.currentStep === 3) btnNextText.textContent = "Tiếp tục: Nhập Thông Tin";
    else if (appState.currentStep === 4) {
      btnNextText.textContent = "Xác Nhận Đặt Lịch Ngay";
      if (btnNextIcon) btnNextIcon.setAttribute("data-lucide", "check-circle");
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================================================
// 4. Hoàn Tất Đặt Lịch & Vé Xác Nhận (Ticket Modal)
// ==========================================================================
function submitBooking() {
  const nameInput = document.getElementById("custName");
  const phoneInput = document.getElementById("custPhone");
  const noteInput = document.getElementById("custNote");

  const name = nameInput ? nameInput.value.trim() : "";
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const note = noteInput ? noteInput.value.trim() : "";

  if (!name) {
    alert("Vui lòng nhập họ và tên của bạn!");
    nameInput && nameInput.focus();
    return;
  }

  if (!phone || phone.length < 9) {
    alert("Vui lòng nhập số điện thoại hợp lệ để nhận mã xác nhận!");
    phoneInput && phoneInput.focus();
    return;
  }

  const selectedObjects = SALON_DATA.services.filter(s => appState.selectedServiceIds.includes(s.id));
  const stylistObj = SALON_DATA.stylists.find(s => s.id === appState.selectedStylistId);
  const totalDuration = selectedObjects.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = selectedObjects.reduce((sum, s) => sum + s.price, 0);

  // Sinh mã đặt lịch ngẫu nhiên dạng TN-XXXX
  const bookingId = "TN-" + Math.floor(1000 + Math.random() * 9000);

  const newBooking = {
    id: bookingId,
    customerName: name,
    customerPhone: phone,
    services: [...appState.selectedServiceIds],
    serviceNames: selectedObjects.map(s => s.name).join(", "),
    totalPrice: totalPrice,
    totalDuration: totalDuration,
    stylistId: appState.selectedStylistId,
    stylistName: stylistObj ? stylistObj.name : "Stylist Bất Kỳ",
    date: appState.selectedDate,
    time: appState.selectedTime,
    note: note,
    status: "pending", // Mới đặt: Chờ xác nhận
    createdAt: new Date().toISOString()
  };

  // Lưu vào danh sách
  appState.bookings.unshift(newBooking);
  saveBookingsToStorage();

  // Gửi thông báo tức thì đến điện thoại chủ salon (Telegram & Google Sheets)
  sendTelegramNotification(newBooking);
  sendGoogleSheetsNotification(newBooking);

  // Hiển thị vé xác nhận
  showSuccessModal(newBooking);

  // Reset Form
  if (nameInput) nameInput.value = "";
  if (phoneInput) phoneInput.value = "";
  if (noteInput) noteInput.value = "";
  appState.selectedServiceIds = [];
  appState.currentStep = 1;
  renderBookingStep1();
  updateWizardUI();
  updateBookingSummary();
}

function showSuccessModal(booking) {
  const modal = document.getElementById("bookingSuccessModal");
  if (!modal) return;

  document.getElementById("ticketBookingId").textContent = booking.id;
  document.getElementById("ticketCustName").textContent = booking.customerName;
  document.getElementById("ticketCustPhone").textContent = booking.customerPhone;
  document.getElementById("ticketStylist").textContent = booking.stylistName;

  const p = booking.date.split("-");
  document.getElementById("ticketDateTime").textContent = `${booking.time} • Ngày ${p[2]}/${p[1]}/${p[0]}`;
  document.getElementById("ticketServices").textContent = booking.serviceNames;
  document.getElementById("ticketTotal").textContent = formatCurrency(booking.totalPrice);

  modal.classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
}

function closeModal() {
  const modal = document.getElementById("bookingSuccessModal");
  if (modal) modal.classList.add("hidden");
}

// ==========================================================================
// 5. Tra Cứu Lịch Hẹn (Customer Lookup)
// ==========================================================================
function handleLookup(e) {
  e.preventDefault();
  const phoneInput = document.getElementById("lookupPhone");
  const resultsContainer = document.getElementById("lookupResults");
  if (!phoneInput || !resultsContainer) return;

  const phoneQuery = phoneInput.value.trim().replace(/\s+/g, "");
  if (!phoneQuery) return;

  // Lọc lịch hẹn theo số điện thoại
  const matched = appState.bookings.filter(b => 
    b.customerPhone.replace(/\s+/g, "").includes(phoneQuery)
  );

  resultsContainer.classList.remove("hidden");

  if (matched.length === 0) {
    resultsContainer.innerHTML = `
      <div class="text-center py-6 text-stone-500 text-xs">
        <i data-lucide="calendar-x" class="w-8 h-8 mx-auto text-stone-300 mb-2"></i>
        Không tìm thấy lịch hẹn nào với số điện thoại <strong>${phoneInput.value}</strong>.
      </div>
    `;
  } else {
    resultsContainer.innerHTML = matched.map(b => {
      const p = b.date.split("-");
      let statusBadge = "";
      if (b.status === "confirmed") {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Đã Xác Nhận</span>';
      } else if (b.status === "pending") {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Chờ Salon Xác Nhận</span>';
      } else if (b.status === "completed") {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">Đã Hoàn Thành</span>';
      } else {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">Đã Huỷ</span>';
      }

      return `
        <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-stone-900">${b.id}</span>
              ${statusBadge}
            </div>
            <div class="font-medium text-stone-800">${b.serviceNames}</div>
            <div class="text-stone-500 text-[11px]">
              Chuyên viên: <strong>${b.stylistName}</strong> • Thời gian: <strong>${b.time} ngày ${p[2]}/${p[1]}/${p[0]}</strong>
            </div>
          </div>

          <div class="flex items-center gap-3 self-end sm:self-center">
            <span class="font-serif font-bold text-stone-900">${formatCurrency(b.totalPrice)}</span>
            ${b.status !== "cancelled" && b.status !== "completed" ? `
              <button 
                onclick="cancelCustomerBooking('${b.id}')"
                class="text-[11px] text-rose-600 hover:text-rose-800 border border-rose-200 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition">
                Huỷ Lịch Hẹn
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");
  }

  if (window.lucide) window.lucide.createIcons();
}

window.cancelCustomerBooking = function(bookingId) {
  if (confirm(`Bạn có chắc chắn muốn huỷ lịch hẹn ${bookingId} không?`)) {
    const booking = appState.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = "cancelled";
      saveBookingsToStorage();
      // Render lại kết quả tìm kiếm
      const phoneInput = document.getElementById("lookupPhone");
      if (phoneInput && phoneInput.value) {
        document.getElementById("lookupForm").dispatchEvent(new Event("submit"));
      }
      renderBookingStep3TimeSlots();
      alert("Đã huỷ lịch hẹn thành công!");
    }
  }
};

// ==========================================================================
// 6. Khu Vực Quản Lý Dành Cho Salon (Admin Dashboard)
// ==========================================================================
function updateAdminStats() {
  const totalEl = document.getElementById("statTotalBookings");
  const pendingEl = document.getElementById("statPendingBookings");
  const confirmedEl = document.getElementById("statConfirmedBookings");
  const revenueEl = document.getElementById("statEstimatedRevenue");

  const total = appState.bookings.length;
  const pending = appState.bookings.filter(b => b.status === "pending").length;
  const confirmed = appState.bookings.filter(b => b.status === "confirmed").length;
  const estimatedRevenue = appState.bookings
    .filter(b => b.status !== "cancelled")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (confirmedEl) confirmedEl.textContent = confirmed;
  if (revenueEl) revenueEl.textContent = formatCurrency(estimatedRevenue);
}

function renderAdminTable(filterStatus = "all") {
  const tbody = document.getElementById("adminBookingsTableBody");
  if (!tbody) return;

  const filtered = filterStatus === "all" 
    ? appState.bookings 
    : appState.bookings.filter(b => b.status === filterStatus);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-stone-400">
          Không có lịch hẹn nào phù hợp bộ lọc.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(b => {
    let statusClass = "";
    let statusText = "";

    if (b.status === "confirmed") {
      statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      statusText = "Đã Xác Nhận";
    } else if (b.status === "pending") {
      statusClass = "bg-amber-50 text-amber-700 border-amber-200";
      statusText = "Chờ Duyệt";
    } else if (b.status === "completed") {
      statusClass = "bg-stone-100 text-stone-600 border-stone-200";
      statusText = "Hoàn Thành";
    } else {
      statusClass = "bg-rose-50 text-rose-700 border-rose-200";
      statusText = "Đã Huỷ";
    }

    const p = b.date.split("-");
    const formattedDate = `${p[2]}/${p[1]}/${p[0]}`;

    return `
      <tr class="hover:bg-stone-50/60 transition">
        <td class="py-3.5 px-3 font-mono font-bold text-stone-900">${b.id}</td>
        <td class="py-3.5 px-3">
          <div class="font-medium text-stone-900">${b.customerName}</div>
          <div class="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
            <span>${b.customerPhone}</span>
            <a href="https://zalo.me/${b.customerPhone.replace(/[^0-9]/g, '')}" target="_blank" class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-semibold hover:bg-blue-100 transition" title="Nhắn tin Zalo">Zalo</a>
            <a href="tel:${b.customerPhone.replace(/[^0-9]/g, '')}" class="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 text-[9px] font-semibold hover:bg-stone-200 transition" title="Gọi điện">Gọi</a>
          </div>
          ${b.note ? `<div class="text-[10px] text-stone-400 italic mt-0.5">"${b.note}"</div>` : ''}
        </td>
        <td class="py-3.5 px-3 max-w-[200px] truncate text-stone-700" title="${b.serviceNames}">
          ${b.serviceNames}
        </td>
        <td class="py-3.5 px-3 text-stone-700">${b.stylistName}</td>
        <td class="py-3.5 px-3 whitespace-nowrap">
          <div class="font-medium text-stone-900">${b.time}</div>
          <div class="text-[11px] text-stone-500">${formattedDate}</div>
        </td>
        <td class="py-3.5 px-3 text-right font-medium text-stone-900">
          ${formatCurrency(b.totalPrice)}
        </td>
        <td class="py-3.5 px-3 text-center">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass}">
            ${statusText}
          </span>
        </td>
        <td class="py-3.5 px-3 text-center whitespace-nowrap">
          <div class="inline-flex items-center gap-1">
            ${b.status === "pending" ? `
              <button onclick="updateBookingStatus('${b.id}', 'confirmed')" class="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[10px] transition" title="Xác nhận lịch hẹn">
                Duyệt
              </button>
            ` : ''}
            ${b.status === "confirmed" ? `
              <button onclick="updateBookingStatus('${b.id}', 'completed')" class="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] transition" title="Đánh dấu đã phục vụ xong">
                Xong
              </button>
            ` : ''}
            ${b.status !== "cancelled" ? `
              <button onclick="updateBookingStatus('${b.id}', 'cancelled')" class="px-2 py-1 border border-stone-300 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded text-[10px] transition" title="Huỷ đơn">
                Huỷ
              </button>
            ` : `
              <button onclick="deleteBookingPermanently('${b.id}')" class="px-2 py-1 text-stone-400 hover:text-rose-600 text-[10px] transition" title="Xoá vĩnh viễn">
                Xoá
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.updateBookingStatus = function(bookingId, newStatus) {
  const booking = appState.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = newStatus;
    saveBookingsToStorage();
    const filter = document.getElementById("adminStatusFilter");
    renderAdminTable(filter ? filter.value : "all");
    renderBookingStep3TimeSlots();
  }
};

window.deleteBookingPermanently = function(bookingId) {
  if (confirm(`Xoá vĩnh viễn đơn ${bookingId}?`)) {
    appState.bookings = appState.bookings.filter(b => b.id !== bookingId);
    saveBookingsToStorage();
    const filter = document.getElementById("adminStatusFilter");
    renderAdminTable(filter ? filter.value : "all");
  }
};

function openAdminModal() {
  const modal = document.getElementById("adminModal");
  if (!modal) return;
  updateAdminStats();
  renderAdminTable("all");
  modal.classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
}

function closeAdminModal() {
  const modal = document.getElementById("adminModal");
  if (modal) modal.classList.add("hidden");
}

// Xác thực bảo mật Quản Trị Viên (Mã PIN)
const ADMIN_PIN_KEY = "thang_ngo_salon_admin_pin";
const DEFAULT_ADMIN_PIN = "250704";

function getAdminPin() {
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_ADMIN_PIN;
}

function setAdminPin(newPin) {
  localStorage.setItem(ADMIN_PIN_KEY, newPin);
}

function openAdminAuthModal() {
  const authModal = document.getElementById("adminAuthModal");
  const pinInput = document.getElementById("adminPinInput");
  const pinError = document.getElementById("adminPinError");
  if (!authModal) return;

  if (pinInput) pinInput.value = "";
  if (pinError) pinError.classList.add("hidden");
  authModal.classList.remove("hidden");
  if (pinInput) setTimeout(() => pinInput.focus(), 100);
  if (window.lucide) window.lucide.createIcons();
}

function closeAdminAuthModal() {
  const authModal = document.getElementById("adminAuthModal");
  if (authModal) authModal.classList.add("hidden");
}

function resetSampleData() {
  if (confirm("Khôi phục lại toàn bộ đơn đặt lịch mẫu ban đầu?")) {
    appState.bookings = [...SALON_DATA.initialBookings];
    saveBookingsToStorage();
    renderAdminTable("all");
    alert("Đã khôi phục dữ liệu mẫu thành công!");
  }
}

// ==========================================================================
// 7. Thiết Lập Event Listeners
// ==========================================================================
function setupEventListeners() {
  // Wizard Next & Prev
  const btnNext = document.getElementById("btnNextStep");
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (appState.currentStep === 4) {
        submitBooking();
      } else {
        goToStep(appState.currentStep + 1);
      }
    });
  }

  const btnPrev = document.getElementById("btnPrevStep");
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      goToStep(appState.currentStep - 1);
    });
  }

  // Click trực tiếp vào các nút số trên thanh Step Indicator
  document.querySelectorAll(".step-item").forEach(item => {
    item.addEventListener("click", () => {
      const stepNum = parseInt(item.getAttribute("data-step"), 10);
      if (stepNum < appState.currentStep) {
        goToStep(stepNum);
      }
    });
  });

  // Modal đóng
  const btnCloseModal = document.getElementById("btnCloseModal");
  if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);

  const btnDoneModal = document.getElementById("btnDoneModal");
  if (btnDoneModal) btnDoneModal.addEventListener("click", closeModal);

  // Tra cứu Form
  const lookupForm = document.getElementById("lookupForm");
  if (lookupForm) lookupForm.addEventListener("submit", handleLookup);

  // Secret Admin Lock & PIN Authentication
  const btnSecretAdmin = document.getElementById("btnSecretAdmin");
  if (btnSecretAdmin) btnSecretAdmin.addEventListener("click", openAdminAuthModal);

  const btnCancelPin = document.getElementById("btnCancelPin");
  if (btnCancelPin) btnCancelPin.addEventListener("click", closeAdminAuthModal);

  const adminPinForm = document.getElementById("adminPinForm");
  if (adminPinForm) {
    adminPinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pinInput = document.getElementById("adminPinInput");
      const pinError = document.getElementById("adminPinError");
      const enteredPin = pinInput ? pinInput.value.trim() : "";

      if (enteredPin === getAdminPin()) {
        closeAdminAuthModal();
        openAdminModal();
      } else {
        if (pinError) pinError.classList.remove("hidden");
        if (pinInput) {
          pinInput.value = "";
          pinInput.focus();
        }
      }
    });
  }

  // Phím tắt bàn phím mở Quản lý: Ctrl + Shift + A
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      openAdminAuthModal();
    }
  });

  // Mở quản lý qua URL hash: #admin
  if (window.location.hash === "#admin") {
    openAdminAuthModal();
  }

  const btnCloseAdmin = document.getElementById("btnCloseAdmin");
  if (btnCloseAdmin) btnCloseAdmin.addEventListener("click", closeAdminModal);

  const adminFilter = document.getElementById("adminStatusFilter");
  if (adminFilter) {
    adminFilter.addEventListener("change", (e) => {
      renderAdminTable(e.target.value);
    });
  }

  // Notification Settings Panel
  const btnOpenNotif = document.getElementById("btnOpenNotificationSettings");
  const panelNotif = document.getElementById("notificationSettingsPanel");
  const btnCloseNotif = document.getElementById("btnCloseNotificationSettings");

  if (btnOpenNotif && panelNotif) {
    btnOpenNotif.addEventListener("click", () => {
      panelNotif.classList.toggle("hidden");
      loadNotificationSettingsUI();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (btnCloseNotif && panelNotif) {
    btnCloseNotif.addEventListener("click", () => {
      panelNotif.classList.add("hidden");
    });
  }

  const btnSaveTele = document.getElementById("btnSaveTelegramSettings");
  if (btnSaveTele) {
    btnSaveTele.addEventListener("click", () => {
      const settings = getNotificationSettings();
      settings.telegramEnabled = document.getElementById("chkTelegramEnabled").checked;
      settings.telegramToken = document.getElementById("txtTelegramToken").value.trim();
      settings.telegramChatId = document.getElementById("txtTelegramChatId").value.trim();
      saveNotificationSettings(settings);
      alert("Đã lưu cài đặt Telegram thành công!");
    });
  }

  const btnTestTele = document.getElementById("btnTestTelegram");
  if (btnTestTele) {
    btnTestTele.addEventListener("click", testTelegramNotification);
  }

  const btnSaveSheets = document.getElementById("btnSaveSheetsSettings");
  if (btnSaveSheets) {
    btnSaveSheets.addEventListener("click", () => {
      const settings = getNotificationSettings();
      settings.sheetsEnabled = document.getElementById("chkSheetsEnabled").checked;
      settings.sheetsWebhook = document.getElementById("txtSheetsWebhook").value.trim();
      saveNotificationSettings(settings);
      alert("Đã lưu cài đặt Google Sheets thành công!");
    });
  }

  // Đổi mã PIN quản trị
  const btnSaveNewPin = document.getElementById("btnSaveNewPin");
  if (btnSaveNewPin) {
    btnSaveNewPin.addEventListener("click", () => {
      const pinInput = document.getElementById("txtNewAdminPin");
      const status = document.getElementById("pinChangeStatus");
      const newPin = pinInput ? pinInput.value.trim() : "";

      if (!newPin || newPin.length < 4) {
        alert("Vui lòng nhập mã PIN từ 4 ký tự trở lên!");
        return;
      }

      setAdminPin(newPin);
      if (pinInput) pinInput.value = "";
      if (status) {
        status.textContent = "✓ Đã đổi mã PIN thành công!";
        setTimeout(() => { status.textContent = ""; }, 3000);
      }
      alert(`Đã đổi mã PIN quản lý salon thành công! Mã PIN mới của bạn là: ${newPin}`);
    });
  }

  // Tự động nạp cài đặt thông báo lúc mở
  loadNotificationSettingsUI();
}

// ==========================================================================
// 8. Tích Hợp Thông Báo (Telegram Bot & Google Sheets)
// ==========================================================================
const NOTIFICATION_SETTINGS_KEY = "thang_ngo_notification_settings";

function getNotificationSettings() {
  const saved = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Lỗi đọc cài đặt thông báo:", e);
    }
  }
  return {
    telegramEnabled: false,
    telegramToken: "",
    telegramChatId: "",
    sheetsEnabled: false,
    sheetsWebhook: ""
  };
}

function saveNotificationSettings(settings) {
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
}

function loadNotificationSettingsUI() {
  const settings = getNotificationSettings();
  const chkTelegram = document.getElementById("chkTelegramEnabled");
  const txtToken = document.getElementById("txtTelegramToken");
  const txtChatId = document.getElementById("txtTelegramChatId");
  const chkSheets = document.getElementById("chkSheetsEnabled");
  const txtSheets = document.getElementById("txtSheetsWebhook");

  if (chkTelegram) chkTelegram.checked = !!settings.telegramEnabled;
  if (txtToken) txtToken.value = settings.telegramToken || "";
  if (txtChatId) txtChatId.value = settings.telegramChatId || "";
  if (chkSheets) chkSheets.checked = !!settings.sheetsEnabled;
  if (txtSheets) txtSheets.value = settings.sheetsWebhook || "";
}

async function sendTelegramNotification(booking) {
  const settings = getNotificationSettings();
  if (!settings.telegramEnabled || !settings.telegramToken || !settings.telegramChatId) {
    return;
  }

  const cleanPhone = booking.customerPhone.replace(/[^0-9]/g, '');
  const p = booking.date.split("-");
  const formattedDate = `${p[2]}/${p[1]}/${p[0]}`;

  const message = `🔔 CÓ LỊCH HẸN MỚI TẠI THANG NGO HAIR STUDIO!
━━━━━━━━━━━━━━━━━━
👤 Khách hàng: ${booking.customerName}
📞 Số điện thoại: ${booking.customerPhone}
✂️ Dịch vụ: ${booking.serviceNames}
💇 Chuyên viên: ${booking.stylistName}
⏰ Thời gian: ${booking.time} • Ngày ${formattedDate}
💰 Tổng chi phí: ${formatCurrency(booking.totalPrice)}
📝 Ghi chú: ${booking.note || "Không có"}
🔖 Mã lịch hẹn: #${booking.id}
━━━━━━━━━━━━━━━━━━
👉 Nhắn Zalo xác nhận: https://zalo.me/${cleanPhone}`;

  try {
    await fetch(`https://api.telegram.org/bot${settings.telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: message
      })
    });
  } catch (err) {
    console.error("Lỗi gửi tin nhắn Telegram:", err);
  }
}

async function sendGoogleSheetsNotification(booking) {
  const settings = getNotificationSettings();
  if (!settings.sheetsEnabled || !settings.sheetsWebhook) {
    return;
  }

  try {
    await fetch(settings.sheetsWebhook, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });
  } catch (err) {
    console.error("Lỗi gửi Google Sheets:", err);
  }
}

async function testTelegramNotification() {
  const txtToken = document.getElementById("txtTelegramToken");
  const txtChatId = document.getElementById("txtTelegramChatId");
  const statusMsg = document.getElementById("telegramStatusMsg");

  const token = txtToken ? txtToken.value.trim() : "";
  const chatId = txtChatId ? txtChatId.value.trim() : "";

  if (!token || !chatId) {
    alert("Vui lòng điền cả Bot Token và Chat ID trước khi gửi thử!");
    return;
  }

  if (statusMsg) statusMsg.textContent = "Đang gửi thử...";

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🎉 KẾT NỐI THÀNH CÔNG!\nThang Ngo Hair Studio đã kết nối với Telegram của bạn. Từ giờ, mỗi khi có khách đặt lịch, chuông điện thoại của bạn sẽ reo tức thì!"
      })
    });
    const data = await res.json();
    if (data.ok) {
      if (statusMsg) statusMsg.textContent = "✅ Gửi thử thành công! Hãy kiểm tra Telegram của bạn.";
      alert("Đã gửi tin nhắn thử thành công! Hãy mở Telegram trên điện thoại để xem thông báo.");
    } else {
      if (statusMsg) statusMsg.textContent = "❌ Lỗi: " + (data.description || "Token/Chat ID không đúng");
      alert("Không gửi được: " + (data.description || "Vui lòng kiểm tra lại Bot Token và Chat ID"));
    }
  } catch (e) {
    if (statusMsg) statusMsg.textContent = "❌ Lỗi kết nối mạng";
    alert("Lỗi kết nối tới máy chủ Telegram!");
  }
}
