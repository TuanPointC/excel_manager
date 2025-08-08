import React from 'react';
import type { Person } from '../types/Person';

interface PeopleTableProps {
  selectedPeople: Person[];
  onRemovePerson: (personId: string) => void;
  onExport: () => void;
}

// Helper function to format date for display
const formatDateForDisplay = (dateValue: string | undefined): string => {
  if (!dateValue) return '';
  
  const dateStr = dateValue.trim();
  
  // If it's already in DD/MM/YYYY format, return as is
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  
  // If it's in YYYY-MM-DD format, convert to DD/MM/YYYY
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  
  // Try to parse and reformat other date formats
  try {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      const day = parsedDate.getDate().toString().padStart(2, '0');
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = parsedDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (error) {
    // Return original if can't parse
    return dateStr;
  }
  
  return dateStr;
};

const PeopleTable: React.FC<PeopleTableProps> = ({ 
  selectedPeople, 
  onRemovePerson, 
  onExport 
}) => {
  return (
    <div className="people-table">
      <div className="table-header">
        <h3>Danh sách đã chọn ({selectedPeople.length})</h3>
        {selectedPeople.length > 0 && (
          <button onClick={onExport} className="export-btn">
            📊 Xuất Excel
          </button>
        )}
      </div>
      
      {selectedPeople.length === 0 ? (
        <div className="empty-table">
          <p>Chưa có người nào được chọn. Sử dụng tìm kiếm ở trên để tìm và thêm người vào danh sách.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="people-data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Số hộ chiếu</th>
                <th>Loại visa</th>
                <th>Sheet gốc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {selectedPeople.map((person, index) => (
                <tr key={person.id}>
                  <td className="stt-cell">{person.stt || (index + 1)}</td>
                  <td className="name-cell">{person.name}</td>
                  <td className="gender-cell">{person.gender || ''}</td>
                  <td className="date-cell">{formatDateForDisplay(person.dateOfBirth)}</td>
                  <td className="passport-cell">{person.passportNumber || ''}</td>
                  <td className="visa-cell">{person.visaType || ''}</td>
                  <td className="sheet-cell">{person.sheetName || 'Unknown'}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => onRemovePerson(person.id)}
                      className="remove-btn"
                      title="Xóa khỏi danh sách"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PeopleTable;
