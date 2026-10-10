# Diendanthcsldc

Hãy đóng vai một Senior Full-stack Developer kiêm UI/UX Designer. Hãy xây dựng cho tôi website diễn đàn trường học bằng TIẾNG VIỆT, giao diện kiểu mạng xã hội (giống Facebook), tên là:



"DIỄN ĐÀN TRƯỜNG THCS TÂY NHA TRANG – PHÂN HIỆU 2"

(Tên cũ: THCS Lương Định Của)



Tôi có đính kèm ảnh nền: anhnen.jpg (dùng làm ảnh nền trang chào).



## 1. CÔNG NGHỆ (nếu không có đề xuất tốt hơn)

- Frontend: Next.js (React) + Tailwind CSS

- Backend/Database/Auth/Storage: Supabase (PostgreSQL)

- Realtime cho thông báo và bình luận

- Mobile-first, responsive hoàn toàn (học sinh chủ yếu dùng điện thoại)

- Hỗ trợ chế độ sáng/tối



## 2. TRANG CHÀO (Landing Page)

Khi vào web, hiện ra trang bắt đầu:

- Ảnh nền toàn màn hình là anhnen.jpg, phủ lớp tối nhẹ (overlay) để chữ dễ đọc

- Dòng chữ lớn ở giữa: "DIỄN ĐÀN TRƯỜNG THCS TÂY NHA TRANG – PHÂN HIỆU 2", bên dưới nhỏ hơn: "(Tên cũ: THCS Lương Định Của)"

- Có hiệu ứng chữ xuất hiện mượt và mũi tên gợi ý "kéo xuống"

- Kéo xuống sẽ thấy 2 nút nổi bật:

  + [Tham gia diễn đàn]

  + [Tìm hiểu thêm]



Nút [Tìm hiểu thêm]: cuộn mượt xuống (hoặc mở ra) một khu riêng giải thích về diễn đàn, gồm các phần:

  a) Giới thiệu & cội nguồn: trang web ra đời để giao lưu, thông báo, bổ sung tài liệu, thời khoá biểu cho học sinh; là nơi học sinh và giáo viên tự do chia sẻ những điều vui ở trường; giáo viên đăng tài liệu và thông báo cho học sinh. Có đoạn nói về việc trường đổi tên từ THCS Lương Định Của sang THCS Tây Nha Trang – Phân hiệu 2 (để chừa chỗ cho tôi bổ sung lịch sử trường sau)

  b) Chức năng chính: trình bày bằng các thẻ (card) có icon: Giao lưu – Thông báo – Tài liệu học tập – Thời khoá biểu – Góc vui trường học

  c) Hướng dẫn nhanh 3 bước: Đăng ký → Đăng nhập → Đăng bài

  d) Nội quy diễn đàn tóm tắt

  e) Người sáng lập: KToolCoder1802 – Nguyễn Hoàng Anh Khoa (kèm tick đỏ)

  Hãy tự thêm ý tưởng nội dung hay cho khu này (VD: sứ mệnh, giá trị "Vui vẻ – Văn minh – Hữu ích", câu hỏi thường gặp FAQ).



## 3. ĐĂNG KÝ / ĐĂNG NHẬP

Bấm [Tham gia diễn đàn] → hiện 2 nút [Đăng ký] / [Đăng nhập].



**3.1. Đăng ký (học sinh)** gồm các ô:

- Tên đăng nhập (user) – không trùng, kiểm tra hợp lệ

- Họ và tên

- Lớp (dạng chọn: 6A1, 6A2, ...)

- Email (KHÔNG bắt buộc, ghi chú "nếu có", dùng để khôi phục mật khẩu)

- Mật khẩu

- Nhập lại mật khẩu (phải trùng khớp)

- Tick đồng ý nội quy



**3.2. Đăng nhập**: chỉ gồm Tên đăng nhập + Mật khẩu (có nút hiện/ẩn mật khẩu).



**3.3. Đăng ký tài khoản giáo viên**

Ở góc nhỏ phía dưới của màn hình Đăng ký/Đăng nhập có đường link nhỏ: "Đăng ký tài khoản giáo viên". Bấm vào sẽ mở form riêng:

- Bước 1: chọn chức vụ (dạng chọn 1 trong 3): [Hiệu trưởng] / [Tổng phụ trách] / [Giáo viên bộ môn]

- Bước 2: sau khi chọn, hiện các ô nhập:

  + Tên đăng nhập (user) – không trùng

  + Họ và tên

  + Số điện thoại Zalo (kiểm tra định dạng số điện thoại Việt Nam)

  + Email (KHÔNG bắt buộc, ghi "nếu có")

  + Giáo viên môn: chỉ hiện và bắt buộc khi chọn "Giáo viên bộ môn" (ô chọn danh sách môn: Toán, Ngữ văn, Tiếng Anh, Vật lí, Hoá học, Sinh học, Lịch sử, Địa lí, GDCD, Tin học, Công nghệ, Âm nhạc, Mĩ thuật, Thể dục, khác...). Nếu chọn Hiệu trưởng hoặc Tổng phụ trách thì ẩn ô này.

  + Mật khẩu + Nhập lại mật khẩu (form giáo viên vẫn cần mật khẩu để đăng nhập)

  + Tick đồng ý nội quy



Quy trình sau khi đăng ký giáo viên:

- Đăng ký thành công nhưng CHƯA được cấp tick. Tài khoản tạm thời hoạt động như tài khoản thường (chưa có tick, chưa có quyền đăng ở Diễn đàn GV hay Bảng thông báo).

- Hệ thống tự động tạo một "yêu cầu xác minh tick" gửi về tài khoản tick ĐỎ (gồm: họ tên, user, chức vụ đã chọn, môn dạy, số Zalo, email, thời gian gửi).

- Hiển thị cho người đăng ký thông báo: "Đăng ký thành công! Yêu cầu của bạn đang chờ quản trị viên xác minh để cấp tick."

- Trên tài khoản giáo viên hiển thị trạng thái: "Đang chờ duyệt" / "Đã được duyệt" / "Bị từ chối (kèm lý do)".

- Tài khoản tick ĐỎ có chuông thông báo + mục "Yêu cầu duyệt tick" trong trang quản trị, hiển thị danh sách yêu cầu đang chờ. Mỗi yêu cầu có nút [Duyệt] và [Từ chối] (có ô nhập lý do). Nên có nút bấm gọi/mở Zalo theo số điện thoại để Admin liên hệ xác minh trước khi duyệt.

- Khi duyệt, hệ thống tự cấp tick đúng theo chức vụ:

  + Hiệu trưởng → tick VÀNG

  + Tổng phụ trách → tick HỒNG

  + Giáo viên bộ môn → tick XANH (kèm nhãn môn học, VD: "Giáo viên Toán")

- Người đăng ký nhận thông báo trong web khi được duyệt hoặc bị từ chối.

- Chống mạo danh: mỗi chức vụ Hiệu trưởng / Tổng phụ trách chỉ nên có 1 người; nếu đã có người giữ tick đó thì cảnh báo cho Admin khi duyệt. Giới hạn số lần gửi yêu cầu để chống spam.

- Số điện thoại Zalo là thông tin riêng tư: CHỈ tick đỏ xem được, tuyệt đối không hiển thị công khai trên trang cá nhân hay bài viết.



Lưu ý kỹ thuật: vì đăng nhập bằng username và email không bắt buộc, hãy thiết kế auth phù hợp (VD: tạo email nội bộ ảo từ username cho Supabase Auth, hoặc tự xây auth an toàn với mật khẩu băm bcrypt). Nếu người dùng không có email thì Admin có thể đặt lại mật khẩu giúp.



## 4. HỆ THỐNG TICK (HUY HIỆU) – hiển thị cạnh tên ở MỌI nơi (bài viết, bình luận, trang cá nhân)

- Học sinh: không có tick

- ✔ Tick XANH: Giáo viên bộ môn (do Admin duyệt)

- ✔ Tick VÀNG: Hiệu trưởng

- ✔ Tick HỒNG: Cô Tổng phụ trách

- ✔ Tick ĐỎ: Người sáng lập / Admin tối cao (KToolCoder1802 – Nguyễn Hoàng Anh Khoa) – tài khoản này được tạo sẵn trong hệ thống, không đăng ký qua form

Bấm/rê chuột vào tick hiện chú thích (VD: "Giáo viên Toán – đã xác minh").

CHỈ tick đỏ mới có quyền duyệt/cấp/thu hồi tick cho người khác.



## 5. TRANG CHỦ DIỄN ĐÀN (sau khi đăng nhập)

Thanh trên cùng (header):

- Bên TRÁI: nút menu 3 gạch (☰)

- Giữa: tên/logo diễn đàn

- Bên PHẢI: nút dấu [+] (đăng bài), chuông thông báo, và avatar/tài khoản (bấm vào có: Trang cá nhân, Đổi mật khẩu, Đăng xuất)



Nút [+]: mở khung đăng bài, MỌI người dùng (học sinh và giáo viên) đều dùng được. Cho phép nhập nội dung, đính kèm ảnh, video, file (PDF/Word/PPT).



Bảng tin trang chủ: hiển thị các bài đăng mới nhất (cuộn vô hạn). Mỗi bài có: avatar, tên + tick, lớp/môn, thời gian, nội dung, ảnh/file; thả cảm xúc (👍❤️😆😮😢); bình luận và trả lời bình luận; sửa/xoá bài của chính mình; nút báo cáo.



Menu ☰ (trượt ra từ bên trái) gồm các mục:



1. **📢 Bảng thông báo**

   - Chỉ tick VÀNG (Hiệu trưởng) và tick HỒNG (Tổng phụ trách) mới được đăng bài

   - Mọi người khác chỉ xem, thả cảm xúc và bình luận

   - Có thể ghim bài quan trọng lên đầu

   - Tick đỏ (Admin) vẫn có toàn quyền quản lý



2. **👩‍🏫 Diễn đàn GV**

   - Tất cả tài khoản có tick (xanh, vàng, hồng, đỏ) được đăng bài (tài liệu, bài giảng, thông báo cho học sinh)

   - Học sinh thường chỉ được xem, thả cảm xúc và bình luận

   - Hỗ trợ đăng file tài liệu, gắn nhãn theo môn học/lớp để dễ tìm



3. **🛠 Gốc Update**

   - Chỉ tick ĐỎ được đăng: thông báo bảo trì, nâng cấp, cập nhật tính năng của website

   - Mọi người xem, thả cảm xúc, bình luận



4. **ℹ️ Tìm hiểu thêm**

   - Hiển thị thông tin về trang web, mục đích, và người sáng lập: KToolCoder1802 – Nguyễn Hoàng Anh Khoa (tick đỏ)



(Ngoài 4 mục trên, menu có thêm "Trang chủ" và "Trang cá nhân". Riêng tài khoản tick đỏ có thêm mục "Quản trị" kèm số yêu cầu duyệt tick đang chờ.)



## 6. PHÂN QUYỀN (bắt buộc áp dụng ở tầng database, ví dụ Row Level Security, không chỉ ẩn nút ở giao diện)

| Khu vực | Ai được đăng | Ai xem/thả cảm xúc/bình luận |

|---|---|---|

| Trang chủ (bảng tin chung) | Mọi người | Mọi người |

| Bảng thông báo | Tick vàng, tick hồng (+ đỏ) | Mọi người |

| Diễn đàn GV | Mọi tick | Mọi người |

| Gốc Update | Tick đỏ | Mọi người |

| Yêu cầu duyệt tick + số Zalo | Người gửi chỉ xem yêu cầu của mình | Chỉ tick đỏ xem toàn bộ và xử lý |

Học sinh không được tự sửa cột vai trò/tick của chính mình (kể cả bằng cách gọi API trực tiếp).



## 7. AN TOÀN (RẤT QUAN TRỌNG vì người dùng là học sinh)

- Nút báo cáo bài viết/bình luận; Admin xử lý được

- Bộ lọc từ thô tục cơ bản

- Admin có thể ẩn/xoá bài, khoá tài khoản

- Chống spam (giới hạn số bài/phút, số lần gửi yêu cầu duyệt tick), giới hạn dung lượng và loại file upload

- Mã hoá mật khẩu, chống XSS/CSRF/SQL injection

- Không hiển thị thông tin nhạy cảm (số điện thoại, email) ra công khai



## 8. TRANG QUẢN TRỊ (chỉ tick đỏ)

- Danh sách "Yêu cầu duyệt tick" (Duyệt / Từ chối + lý do)

- Danh sách người dùng, cấp/thu hồi tick, đặt lại mật khẩu giúp người dùng

- Xử lý báo cáo, xoá/ẩn bài, thống kê cơ bản



## 9. GIAO DIỆN

- Hiện đại, thân thiện, sạch sẽ, màu chủ đạo lấy từ tông ảnh nền anhnen.jpg

- Hiệu ứng chuyển động mượt, loading dạng skeleton

- Tick xanh/vàng/hồng/đỏ có icon rõ ràng, dễ phân biệt

- Hiển thị tốt trên điện thoại



## 10. YÊU CẦU ĐẦU RA

1. Giải thích ngắn kiến trúc và cấu trúc thư mục

2. Thiết kế database (SQL tạo bảng + chính sách phân quyền), gồm bảng yêu cầu duyệt tick

3. Code đầy đủ, chạy được, chia theo từng file, có chú thích tiếng Việt

4. Hướng dẫn từng bước cài đặt, cấu hình, deploy (Vercel + Supabase) cho người mới

5. Làm theo từng giai đoạn, xong giai đoạn nào dừng lại hỏi tôi:

   (1) Trang chào + Tìm hiểu thêm → (2) Đăng ký/đăng nhập học sinh + đăng ký giáo viên + hệ thống tick → (3) Trang quản trị duyệt tick → (4) Trang chủ + đăng bài + bình luận/cảm xúc → (5) Menu ☰ với 4 mục và phân quyền → (6) An toàn + hoàn thiện

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://diendanthcsldc.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7c9e4be2-6b88-4976-a57a-a8e4805b9fc1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
