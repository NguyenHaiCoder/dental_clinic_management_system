# Hướng dẫn Deploy lên Vercel

## Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

### Bước 1: Chuẩn bị
1. Đảm bảo code đã được push lên GitHub
2. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)

### Bước 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Chọn repository: `NguyenHaiCoder/dental_clinic_management_system`
3. Vercel sẽ tự động detect cấu hình từ `vercel.json`

### Bước 3: Cấu hình Build Settings
- **Framework Preset**: Other
- **Build Command**: `npm run build:web`
- **Output Directory**: `web-build`
- **Install Command**: `npm install`

### Bước 4: Deploy
1. Click **"Deploy"**
2. Chờ build hoàn tất (thường mất 2-5 phút)
3. Vercel sẽ cung cấp URL production

## Cách 2: Deploy qua Vercel CLI

### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Login vào Vercel
```bash
vercel login
```

### Bước 3: Deploy
```bash
vercel
```

Lần đầu tiên, Vercel sẽ hỏi:
- Set up and deploy? **Yes**
- Which scope? Chọn account của bạn
- Link to existing project? **No**
- Project name? `dental-clinic-management-system` (hoặc để mặc định)
- Directory? `./` (Enter để mặc định)

### Bước 4: Deploy Production
```bash
vercel --prod
```

## Cách 3: Tự động Deploy qua GitHub Integration

1. Vào Vercel Dashboard → Settings → Git
2. Kết nối GitHub account
3. Chọn repository `dental_clinic_management_system`
4. Vercel sẽ tự động deploy mỗi khi bạn push code lên `main` branch

## Kiểm tra sau khi Deploy

1. Truy cập URL được cung cấp bởi Vercel
2. Kiểm tra console browser để đảm bảo không có lỗi
3. Test các tính năng chính của ứng dụng

## Troubleshooting

### Lỗi Build
- Kiểm tra logs trong Vercel Dashboard
- Đảm bảo `npm run build:web` chạy thành công local
- Kiểm tra Node.js version (Vercel tự động detect, thường là 18.x hoặc 20.x)

### Lỗi Routing
- File `vercel.json` đã có cấu hình rewrites để handle client-side routing
- Nếu vẫn lỗi, kiểm tra lại cấu hình trong `app.json` (web.output phải là "static")

### Lỗi Dependencies
- Đảm bảo tất cả dependencies trong `package.json` đều có version cụ thể
- Kiểm tra `package-lock.json` đã được commit

## Environment Variables (nếu cần)

Nếu app cần environment variables:
1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Thêm các biến môi trường cần thiết
3. Redeploy để áp dụng thay đổi

## Custom Domain

1. Vào Vercel Dashboard → Project Settings → Domains
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn của Vercel

