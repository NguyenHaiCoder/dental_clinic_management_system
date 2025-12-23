# Dental Clinic Management System

Hệ thống quản lý phòng khám nha khoa được xây dựng với React Native và Expo Router.

## Tính năng chính

- 📋 **Quản lý khám bệnh**: Tạo, xem và quản lý phiếu khám bệnh
- 👥 **Quản lý bệnh nhân**: Thông tin bệnh nhân, lịch sử khám bệnh
- 🏥 **Quản lý dịch vụ**: Dịch vụ nha khoa và các mặt bệnh
- 📊 **Báo cáo & Thống kê**: Doanh thu, chi phí, thống kê theo ngày/tuần/tháng
- 💰 **Quản lý chi phí**: Theo dõi các khoản chi phí

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

### Quản lý bệnh nhân
- Thông tin đầy đủ về bệnh nhân
- Lịch sử khám bệnh chi tiết
- Thống kê tổng số lần khám và tổng chi phí

### Báo cáo
- Thống kê doanh thu, chi phí, lợi nhuận
- Báo cáo theo ngày, tuần, tháng hoặc tùy chọn
- Doanh thu theo từng dịch vụ

## Development

```bash
npm run lint  # Chạy linter
```

## License

Private project
