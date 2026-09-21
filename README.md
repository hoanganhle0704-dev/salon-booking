# Thang Ngo Hair Studio - Website Đặt Lịch Làm Tóc Trực Tuyến

Website đặt lịch dịch vụ tóc cao cấp được thiết kế theo phong cách **Minimalist Editorial** (Tối giản, trang nhã và hiện đại).

---

## 🌟 Điểm nổi bật & Tính năng chính

1. **Giao diện Minimalist Editorial:**
   - Tone màu kem ấm, trắng ngọc trai kết hợp với màu than chì và điểm xuyết các chi tiết sang trọng.
   - Font chữ nghệ thuật: *Cormorant Garamond* (tiêu đề phong cách tạp chí) & *Plus Jakarta Sans* (nội dung rõ ràng, sắc nét).
   - Chuẩn Responsive hoàn hảo trên điện thoại (Mobile) và máy tính (Desktop).

2. **Khám phá Dịch vụ & Bảng giá:**
   - Phân loại rõ ràng: Cắt & Tạo kiểu, Uốn & Nhuộm, Chăm sóc & Phục hồi chuyên sâu.
   - Bộ lọc danh mục thông minh và nút "Đặt lịch" đưa thẳng dịch vụ vào giỏ hẹn.

3. **Đội ngũ Nghệ nhân (Stylist Showcase):**
   - Giới thiệu Founder Thắng Ngô (Master Stylist) cùng các Senior Colorist và Barber.
   - Khách có thể chọn đích danh stylist hoặc để salon tự động sắp xếp chuyên viên phù hợp.

4. **Quy trình Đặt lịch 4 Bước Trực quan (Booking Wizard):**
   - **Bước 1:** Chọn dịch vụ (hỗ trợ chọn nhiều dịch vụ cùng lúc, tự tính tổng thời lượng và chi phí).
   - **Bước 2:** Chọn Stylist mong muốn.
   - **Bước 3:** Chọn Ngày (nút chọn nhanh Hôm nay, Ngày mai, Ngày kia hoặc chọn từ lịch) & Khung giờ trống.
   - **Bước 4:** Điền thông tin cá nhân (Tên, SĐT, Ghi chú) $\rightarrow$ Xác nhận đặt lịch.

5. **Vé Hẹn Điện Tử (E-Ticket / Booking Card):**
   - Sau khi hoàn tất, hệ thống tự động sinh mã hẹn riêng biệt (ví dụ: `TN-8924`).
   - Hỗ trợ xem thông tin tóm tắt và nút in/lưu vé hẹn tiện lợi.

6. **Tra Cứu Lịch Hẹn (Dành cho Khách Hàng):**
   - Chỉ cần nhập số điện thoại để tra cứu tất cả lịch hẹn đã đặt và trạng thái.
   - Cho phép khách hàng tự huỷ lịch nếu bận đột xuất.

7. **Bảng Quản Trị Salon (Admin Dashboard):**
   - Nút **"Quản Lý Salon"** ở góc trên thanh điều hướng.
   - Thống kê nhanh: Tổng lượt hẹn, Số đơn chờ duyệt, Doanh thu ước tính.
   - Duyệt đơn, đánh dấu hoàn thành hoặc huỷ đơn trực tiếp.
   - Lưu trữ dữ liệu an toàn trong `localStorage` (không mất khi F5 tải lại trang).

---

## 🚀 Cách Chạy Website

Không cần cài đặt Node.js hay Python phức tạp, bạn có thể chạy ngay lập tức bằng 1 trong các cách:

* **Cách 1 (Nhanh nhất):** Nhấp đúp chuột vào file `start.bat`.
* **Cách 2:** Mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Google Chrome, Microsoft Edge, Firefox,...).

---

## 📁 Cấu Trúc Thư Mục

```text
salon-booking/
├── index.html        # Giao diện chính (Landing page, Booking Wizard, Modal vé & Admin)
├── start.bat         # Phím tắt mở nhanh website trên trình duyệt
├── README.md         # Hướng dẫn chi tiết dự án
├── css/
│   └── style.css     # Định dạng phong cách Minimalist, hiệu ứng chuyển động, vé hẹn
└── js/
    ├── data.js       # Dữ liệu dịch vụ, stylist, bảng giá và các đơn mẫu
    └── app.js        # Logic xử lý đặt lịch 4 bước, lưu localStorage, tra cứu & admin
```
