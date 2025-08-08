# Quản lý danh sách Excel

Ứng dụng React TypeScript để quản lý dữ liệu người từ file Excel với tính năng tìm kiếm và xuất file.

## Tính năng

- **📁 Nhập file Excel**: Tải lên file Excel với nhiều sheet chứa dữ liệu người
- **🔍 Tìm kiếm**: Tìm kiếm người theo tên trên tất cả sheet đã nhập
- **� Quản lý lựa chọn**: Thêm/xóa người vào/khỏi bảng lựa chọn
- **📊 Xuất Excel**: Xuất danh sách đã chọn ra file Excel mới

## Định dạng dữ liệu

Ứng dụng hỗ trợ định dạng tiếng Việt với các cột:

- **STT**: Số thứ tự
- **Họ và tên**: Họ và tên đầy đủ (bắt buộc)
- **Ngày sinh**: Ngày sinh
- **Số hộ chiếu**: Số hộ chiếu
- **Loại visa**: Loại visa

Ví dụ:
| STT | Họ và tên | Ngày sinh | Số hộ chiếu | Loại visa |
|-----|-----------|-----------|-------------|-----------|
| 1 | Nguyễn Văn A | 01/01/1990 | A1234567 | Du lịch |
| 2 | Trần Thị B | 15/05/1985 | B7654321 | Công tác |

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Building for Production

```bash
npm run build
```

## Usage

1. **Import Excel File**: Click "Import Excel File" and select an Excel file (.xlsx or .xls) containing people data
   - The app expects columns with headers like "name", "age", and "address" (case insensitive)
   - Multiple sheets are supported

2. **Search People**: Use the search box to find people by name
   - Search is case insensitive and matches partial names
   - Results show name, age, address, and source sheet

3. **Select People**: Click the "Add" button next to search results to add people to your selection

4. **Manage Selection**: View selected people in the table below
   - Remove people using the ❌ button
   - Export all selected people using the "Export to Excel" button

## Excel File Format

Your Excel file should have columns with these headers (case insensitive):
- **Name** (required): Person's full name
- **Age** (optional): Person's age as a number
- **Address** (optional): Person's address

Example:
| Name | Age | Address |
|------|-----|---------|
| John Doe | 30 | 123 Main St |
| Jane Smith | 25 | 456 Oak Ave |

## Kiểm tra ứng dụng

### Tạo file Excel thử nghiệm

Bạn có thể tạo file Excel thử nghiệm với cấu trúc sau:

**Sheet 1: "Nhân viên"**
| STT | Họ và tên | Ngày sinh | Số hộ chiếu | Loại visa |
|-----|-----------|-----------|-------------|-----------|
| 1 | Nguyễn Văn An | 01/01/1990 | A1234567 | Du lịch |
| 2 | Trần Thị Bình | 15/05/1985 | B7654321 | Công tác |
| 3 | Lê Hoàng Cường | 20/12/1992 | C9876543 | Học tập |

**Sheet 2: "Khách hàng"**
| STT | Họ và tên | Ngày sinh | Số hộ chiếu | Loại visa |
|-----|-----------|-----------|-------------|-----------|
| 1 | Phạm Thị Dung | 08/03/1988 | D1122334 | Thăm thân |
| 2 | Võ Minh Tuấn | 12/07/1995 | E5566778 | Du lịch |

### Các bước kiểm tra

1. Lưu dữ liệu trên thành file Excel (.xlsx)
2. Mở ứng dụng trong trình duyệt
3. Nhấn "Nhập file Excel" và chọn file thử nghiệm
4. Bạn sẽ thấy thông báo thành công hiển thị các sheet đã nhập
5. Sử dụng ô tìm kiếm để tìm người theo tên
6. Nhấn "Thêm" để thêm người vào danh sách lựa chọn
7. Sử dụng nút "Xuất Excel" để tải xuống danh sách đã chọn

## Tương thích ngược

Ứng dụng vẫn hỗ trợ định dạng cũ với các cột:
- Name (Tên)
- Age (Tuổi) 
- Address (Địa chỉ)

## Khởi động

## Dependencies

- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **xlsx**: Excel file processing
- **file-saver**: File download functionality

## Project Structure

```
src/
├── components/          # React components
│   ├── FileUpload.tsx   # Excel file import
│   ├── SearchComponent.tsx  # People search
│   └── PeopleTable.tsx  # Selected people table
├── types/
│   └── Person.ts        # TypeScript interfaces
├── utils/
│   └── excelUtils.ts    # Excel processing utilities
├── App.tsx              # Main application component
└── App.css              # Application styles
```

## Development

This project uses:
- **Vite** for fast development and building
- **TypeScript** for type safety
- **ESLint** for code quality
- Modern React patterns with hooks

To contribute or modify:
1. Follow TypeScript best practices
2. Use functional components with hooks
3. Maintain proper error handling
4. Test with various Excel file formats

## Browser Support

Modern browsers that support ES6+ features:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
