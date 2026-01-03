# Dental Clinic Management System

Hệ thống quản lý phòng khám nha khoa được xây dựng với React Native và Expo Router.

## Tính năng chính

- 📋 **Quản lý khám bệnh**: Tạo, xem và quản lý phiếu khám bệnh với thanh toán và quản lý nợ
- 👥 **Quản lý bệnh nhân**: Thông tin bệnh nhân, lịch sử khám bệnh, người thân
- 🏥 **Quản lý dịch vụ**: Dịch vụ nha khoa và các mặt bệnh
- 📅 **Lịch hẹn tái khám**: Quản lý lịch hẹn tái khám cho bệnh nhân
- 🏭 **Quản lý nhà cung cấp**: Quản lý xưởng sản xuất răng và đơn hàng
- 📦 **Quản lý vật tư**: Nhập/xuất vật tư, theo dõi tồn kho
- 💳 **Thanh toán & Nợ**: Quản lý thanh toán, theo dõi nợ bệnh nhân
- 📊 **Báo cáo & Thống kê**: Doanh thu, chi phí, thống kê theo ngày/tuần/tháng
- 💰 **Quản lý chi phí**: Theo dõi các khoản chi phí
- 📄 **Xuất PDF**: Xuất danh sách bệnh nhân khám bệnh theo mẫu

## Công nghệ sử dụng

- **React Native** với Expo
- **Expo Router** cho navigation
- **TypeScript** cho type safety
- **React Native Safe Area Context** cho responsive design

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Chạy ứng dụng:

```bash
npm start
```

Hoặc chạy trên các platform cụ thể:

```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## Cấu trúc dự án

```
├── app/              # Routes và screens (Expo Router)
├── components/       # Reusable components
├── constants/        # Constants và theme
├── contexts/         # React contexts
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Tính năng chi tiết

### Quản lý khám bệnh
- Tìm kiếm bệnh nhân nhanh (theo tên hoặc 3 số cuối số điện thoại)
- Thêm dịch vụ và mặt bệnh tùy chỉnh
- Lọc theo trạng thái (Hoàn thành, Đang chờ)
- Xem chi tiết và lịch sử khám bệnh
- Quản lý thanh toán và nợ: Thành tiền, Thanh toán, Còn nợ
- Tự động tính nợ: Nếu thành tiền = thanh toán → nợ = 0
- Tìm kiếm bệnh nhân còn nợ và trừ tiền nợ khi thanh toán

### Quản lý bệnh nhân
- Thông tin đầy đủ về bệnh nhân (Họ tên, SĐT, Ngày sinh, Địa chỉ, Ngày khám)
- Thông tin người thân (Ví dụ: Con - 03412412412)
- Lịch sử khám bệnh chi tiết
- Thống kê tổng số lần khám và tổng chi phí
- Danh sách bệnh nhân từ ngày đến ngày
- Tìm kiếm theo số điện thoại và tên

### Lịch hẹn tái khám
- Tạo lịch hẹn cho bệnh nhân
- Xem danh sách lịch hẹn theo ngày
- Hủy lịch hẹn
- Lịch tái khám với nội dung điều trị (nội bộ, không in cho khách)

### Quản lý nhà cung cấp (Xưởng sản xuất răng)
- Thông tin xưởng: Tên, SĐT, Địa chỉ
- Quản lý đơn hàng: Ngày gửi (tự động/tùy chỉnh), Tên bệnh nhân, SĐT
- Yêu cầu sản xuất (chất liệu, yêu cầu đặc biệt)
- Số lượng răng và tổng tiền

### Quản lý vật tư
- **Phần nhập**: Tên vật tư, Số lượng nhập, Giá nhập, Tổng giá nhập
- **Phần xuất**: Tên vật tư, Số lượng xuất, Ngày xuất, Tồn kho
- Theo dõi tồn kho tự động

### Thanh toán & Nợ
- Quản lý thanh toán trong phiếu khám bệnh
- Theo dõi số tiền còn nợ
- Tự động cập nhật nợ khi bệnh nhân thanh toán
- Tìm kiếm bệnh nhân còn nợ

### Báo cáo
- Thống kê doanh thu, chi phí, lợi nhuận
- Báo cáo theo ngày, tuần, tháng hoặc tùy chọn
- Doanh thu theo từng dịch vụ
- Báo cáo thu chi chi tiết theo ngày

### Xuất PDF
- Xuất danh sách bệnh nhân khám bệnh theo mẫu
- Bao gồm thông tin phòng khám, ngày tháng, danh sách bệnh nhân
- Hỗ trợ xuất PDF trên iPad và web

## Development

```bash
npm run lint  # Chạy linter
```

## License

Private project
