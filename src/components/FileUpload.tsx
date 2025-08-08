import React, { useRef } from 'react';
import type { ExcelSheet } from '../types/Person';

interface FileUploadProps {
  onFileImport: (sheets: ExcelSheet[]) => void;
  onError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileImport, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      onError('Vui lòng chọn file Excel hợp lệ (.xlsx hoặc .xls)');
      return;
    }

    try {
      const { importExcelFile } = await import('../utils/excelUtils');
      const sheets = await importExcelFile(file);
      
      if (sheets.length === 0) {
        onError('Không tìm thấy dữ liệu hợp lệ trong file Excel');
        return;
      }
      
      onFileImport(sheets);
    } catch (error) {
      onError(`Lỗi đọc file Excel: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button 
        onClick={handleUploadClick}
        className="upload-btn"
      >
        📁 Nhập file Excel
      </button>
    </div>
  );
};

export default FileUpload;
