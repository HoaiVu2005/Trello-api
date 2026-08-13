<div align="center">
 
  
  # 🚀 Trello Clone (MERN Stack)
  
  **Một ứng dụng quản lý công việc và dự án mạnh mẽ, đồng bộ thời gian thực và giao diện hiện đại được lấy cảm hứng từ Trello.**
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
  [![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](#)
</div>

<hr/>

## 🎯 Giới Thiệu (Introduction)
Dự án **Trello Clone** được xây dựng với mục tiêu tái tạo lại trải nghiệm quản lý công việc mượt mà và trực quan của ứng dụng Trello gốc. Sử dụng **MERN Stack** (MongoDB, Express, React, Node.js) kết hợp với các công nghệ hiện đại như **Socket.IO** và **dnd-kit**, ứng dụng mang lại hiệu năng cao và khả năng đồng bộ dữ liệu theo thời gian thực, là minh chứng cho kiến thức Fullstack bài bản.

![App Screenshot](https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80) 
*(💡 Ghi chú: Hãy thay thế đường link ảnh phía trên bằng ảnh chụp màn hình dự án thực tế của bạn để github trông pro hơn nhé)*

---

## ✨ Tính Năng Nổi Bật (Core Features)

🔥 **Kéo Thả Đa Chiều (Advanced Drag & Drop):**
- Di chuyển thẻ (Card) linh hoạt giữa các danh sách (Column).
- Sắp xếp lại thứ tự danh sách (Column) trong Bảng (Board).
- Tự động tính toán lại vị trí (OrderIds) và cập nhật Database cực kỳ tối ưu.

⚡ **Đồng Bộ Thời Gian Thực (Real-time Synchronization):**
- Mọi thao tác (thêm, sửa, xoá, di chuyển thẻ) được đồng bộ ngay lập tức tới tất cả người dùng đang mở cùng bảng thông qua **Socket.IO**. Trải nghiệm làm việc nhóm (collaborative) hoàn hảo mà không cần reload trang.

🎨 **Giao Diện Hiện Đại (Modern UI/UX):**
- Thiết kế đẹp mắt, chuẩn Material Design với **Material UI (MUI v5)**.
- Hỗ trợ chuyển đổi mượt mà giữa chế độ **Sáng/Tối (Light/Dark mode)**.
- Tổ chức bố cục (layout) hợp lý, Responsive tốt.

🔒 **Bảo Mật & Xác Thực (Security):**
- Đăng ký, đăng nhập an toàn với hệ thống mã hóa mật khẩu.
- Quản lý phiên đăng nhập chặt chẽ bằng **JWT (JSON Web Tokens)**.
- Phân quyền và bảo vệ các API (Private Routes/Endpoints).

🛠 **Trải Nghiệm & Tiện Ích (Utilities):**
- Quản lý cấu trúc phân cấp chuẩn: Board > Column > Card.
- Tích hợp trình soạn thảo Markdown cho mô tả chi tiết của thẻ.
- Xử lý mượt mà tác vụ upload ảnh đính kèm (Cloudinary/Multer).

---

## 💻 Công Nghệ Sử Dụng (Tech Stack)

### 🎨 Frontend (`/Trello_Web`)
- **Framework:** React.js (v18) + Vite
- **UI Component:** Material UI (MUI v5), Emotion
- **State Management:** Redux Toolkit, Redux-Persist
- **Drag and Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Data Fetching & Forms:** Axios, React Hook Form
- **Real-time:** Socket.IO Client

### ⚙️ Backend (`/Trelo_Api`)
- **Environment & Framework:** Node.js, Express.js
- **Database:** MongoDB (Sử dụng Native MongoDB Driver)
- **Real-time:** Socket.IO
- **Authentication:** JWT, bcryptjs
- **File & Storage:** Multer, Cloudinary
- **Validation:** Joi
- **Mail Service:** Brevo / Resend

---

## 🚀 Hướng Dẫn Cài Đặt (Installation Guide)

### 1. Yêu cầu hệ thống
- **Node.js** (Khuyên dùng v18.x trở lên)
- **MongoDB** (Local hoặc sử dụng MongoDB Atlas)

### 2. Khởi chạy Backend (API)
```bash
# 1. Di chuyển vào thư mục Backend
cd Trelo_Api

# 2. Cài đặt các thư viện cần thiết
npm install
# hoặc yarn install

# 3. Tạo file .env và cấu hình (Xem mục Biến môi trường bên dưới)
cp .env.example .env

# 4. Chạy server ở chế độ phát triển
npm run dev
```

### 3. Khởi chạy Frontend (Web)
```bash
# 1. Di chuyển vào thư mục Frontend
cd Trello_Web

# 2. Cài đặt các thư viện
npm install
# hoặc yarn install

# 3. Chạy ứng dụng
npm run dev
```

---

## 🔑 Biến Môi Trường (Environment Variables)

Bạn cần tạo các file `.env` tại thư mục gốc của Backend và Frontend với cấu hình cơ bản sau:

**1. Thư mục `Trelo_Api/.env`:**
```env
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=trello_clone_db
APP_HOST=localhost
APP_PORT=8017

JWT_SECRET=your_super_secret_key

# Cấu hình lưu trữ ảnh Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cấu hình Email Service
BREVO_API_KEY=your_brevo_api_key
ADMIN_EMAIL_ADDRESS=admin@yourdomain.com
ADMIN_EMAIL_NAME=Admin
```

**2. Thư mục `Trello_Web/.env`:**
```env
# Địa chỉ API của Backend
VITE_API_ROOT=http://localhost:8017
```

---


> Nếu bạn thấy dự án này hay và hữu ích, đừng quên để lại **1 ⭐️ Star** để ủng hộ tác giả nhé!
