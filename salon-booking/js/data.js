// Dữ liệu ban đầu cho Thang Ngo Hair Studio

const SALON_DATA = {
  name: "Thang Ngo Hair Studio",
  slogan: "Nghệ thuật kiến tạo vẻ đẹp mái tóc theo phong cách tối giản & thanh lịch",
  address: "Số 1 Ngách 91/40, Nguyễn Chí Thanh, Hà Nội",
  phone: "0988 123 456",
  openHours: "09:00 - 20:30 (Hàng ngày)",
  email: "contact@thangngohair.vn",

  categories: [
    { id: "all", name: "Tất cả dịch vụ" },
    { id: "cut", name: "Cắt & Tạo kiểu" },
    { id: "color-perm", name: "Uốn & Nhuộm" },
    { id: "care", name: "Chăm sóc & Phục hồi" }
  ],

  services: [
    {
      id: "srv-1",
      name: "Cắt Thiết Kế Nữ & Sấy Tạo Kiểu",
      category: "cut",
      price: 280000,
      duration: 50,
      description: "Tư vấn dáng khuôn mặt, cắt định hình layer/bob hiện đại và sấy tạo kiểu bồng bềnh tự nhiên.",
      popular: true
    },
    {
      id: "srv-2",
      name: "Cắt Tạo Kiểu Nam Cao Cấp",
      category: "cut",
      price: 150000,
      duration: 35,
      description: "Cắt form tóc chuẩn men, cạo viền sắc nét, gội xả sảng khoái và vuốt sáp tạo kiểu.",
      popular: false
    },
    {
      id: "srv-3",
      name: "Cắt & Tạo Kiểu Với Founder Thắng Ngô",
      category: "cut",
      price: 450000,
      duration: 60,
      description: "Master Stylist Thắng Ngô trực tiếp tư vấn và thiết kế kiểu tóc độc quyền chuẩn tỷ lệ vàng.",
      popular: true
    },
    {
      id: "srv-4",
      name: "Uốn Sóng Lơi Hàn Quốc / Uốn Phồng Chân",
      category: "color-perm",
      price: 850000,
      duration: 120,
      description: "Công nghệ uốn organic giữ ẩm, tạo sóng lơi bồng bềnh, mềm mượt tự nhiên không khô xơ.",
      popular: true
    },
    {
      id: "srv-5",
      name: "Nhuộm Màu Thời Trang / Tone Lạnh / Balayage",
      category: "color-perm",
      price: 1100000,
      duration: 150,
      description: "Sử dụng thuốc nhuộm cao cấp từ Ý/Nhật Bản, lên chuẩn tone màu, bền màu và bóng tóc.",
      popular: true
    },
    {
      id: "srv-6",
      name: "Tẩy Tóc Khử Vàng & Nâng Tone Chuyên Sâu",
      category: "color-perm",
      price: 750000,
      duration: 120,
      description: "Tẩy tóc dịu nhẹ với tinh chất bảo vệ biểu bì, hạn chế tối đa cảm giác rát da đầu.",
      popular: false
    },
    {
      id: "srv-7",
      name: "Phục Hồi Tóc Hư Tổn Keratin Thủy Phân",
      category: "care",
      price: 550000,
      duration: 60,
      description: "Bổ sung protein và độ ẩm sâu vào lõi tóc, hồi sinh mái tóc khô xơ và chẻ ngọn.",
      popular: false
    },
    {
      id: "srv-8",
      name: "Gội Dưỡng Sinh Thảo Dược & Massage Cổ Vai Gáy",
      category: "care",
      price: 180000,
      duration: 45,
      description: "Nước gội thảo mộc nấu tươi kết hợp bấm huyệt đã thông kinh lạc, thư giãn tuyệt đối.",
      popular: true
    },
    {
      id: "srv-9",
      name: "Combo Toàn Diện: Cắt + Phục Hồi + Gội Thư Giãn",
      category: "care",
      price: 890000,
      duration: 100,
      description: "Gói làm mới toàn diện: Cắt thiết kế, hấp phục hồi chuyên sâu và gội massage xả stress.",
      popular: true
    }
  ],

  stylists: [
    {
      id: "any",
      name: "Stylist Phù Hợp Nhất (Tự Động)",
      role: "Đội ngũ chuyên viên",
      exp: "Được salon sắp xếp theo khung giờ tối ưu nhất của bạn",
      rating: "5.0",
      avatar: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80",
      badge: "Linh hoạt nhất"
    },
    {
      id: "thang-ngo",
      name: "Thắng Ngô",
      role: "Founder & Master Stylist",
      exp: "10+ năm kinh nghiệm • Tu nghiệp Vidal Sassoon London",
      rating: "5.0",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      badge: "Founder"
    },
    {
      id: "lan-chi",
      name: "Lan Chi",
      role: "Senior Colorist",
      exp: "6 năm kinh nghiệm • Chuyên gia Balayage & Pastel Colors",
      rating: "4.9",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
      badge: "Color Specialist"
    },
    {
      id: "minh-duc",
      name: "Minh Đức",
      role: "Creative Stylist & Barber",
      exp: "5 năm kinh nghiệm • Phong cách Hiện đại & Textured Fade",
      rating: "4.9",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      badge: "Men Styling"
    }
  ],

  timeSlots: [
    "09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30"
  ],

  // Dữ liệu mẫu ban đầu để demo quản lý
  initialBookings: [
    {
      id: "TN-9421",
      customerName: "Nguyễn Minh Châu",
      customerPhone: "0912345678",
      services: ["srv-1", "srv-8"],
      serviceNames: "Cắt Thiết Kế Nữ & Sấy Tạo Kiểu, Gội Dưỡng Sinh Thảo Dược",
      totalPrice: 460000,
      totalDuration: 95,
      stylistId: "thang-ngo",
      stylistName: "Thắng Ngô",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "10:00",
      note: "Tóc mỏng, muốn uốn nhẹ chân tóc",
      status: "confirmed", // pending, confirmed, completed, cancelled
      createdAt: new Date().toISOString()
    },
    {
      id: "TN-8832",
      customerName: "Trần Hoàng Long",
      customerPhone: "0987654321",
      services: ["srv-2"],
      serviceNames: "Cắt Tạo Kiểu Nam Cao Cấp",
      totalPrice: 150000,
      totalDuration: 35,
      stylistId: "minh-duc",
      stylistName: "Minh Đức",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "14:30",
      note: "Cắt sát 2 bên side",
      status: "pending",
      createdAt: new Date().toISOString()
    },
    {
      id: "TN-7615",
      customerName: "Lê Phương Thảo",
      customerPhone: "0905123987",
      services: ["srv-5", "srv-7"],
      serviceNames: "Nhuộm Màu Thời Trang / Tone Lạnh, Phục Hồi Tóc Hư Tổn Keratin",
      totalPrice: 1650000,
      totalDuration: 210,
      stylistId: "lan-chi",
      stylistName: "Lan Chi",
      date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      time: "13:30",
      note: "Muốn nhuộm nâu tây khói",
      status: "pending",
      createdAt: new Date().toISOString()
    }
  ]
};

// Định dạng tiền tệ VND
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}
