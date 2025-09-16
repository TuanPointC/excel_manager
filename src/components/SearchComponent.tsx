import React, { useState, useMemo } from 'react';
import type { Person } from '../types/Person';

interface SearchComponentProps {
  allPeople: Person[];
  onPersonSelect: (person: Person) => void;
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

const SearchComponent: React.FC<SearchComponentProps> = ({ allPeople, onPersonSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPeople = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return allPeople.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPeople, searchTerm]);

  const handlePersonClick = (person: Person) => {
    onPersonSelect(person);
    // setSearchTerm(''); // Clear search after selection
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
    }
  };

  return (
    <div className="search-component">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="clear-search-btn"
            type="button"
            title="Xóa tìm kiếm (Esc)"
          >
            ✕
          </button>
        )}
        <span className="search-icon">🔍</span>
      </div>

      {searchTerm.trim() && (
        <div>
          <div className="search-results">
            {filteredPeople.length === 0 ? (
              <div className="no-results">Không tìm thấy người nào phù hợp với "{searchTerm}"</div>
            ) : (
              <div className="results-header">
                Tìm thấy {filteredPeople.length} kết quả
              </div>
            )}

            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className="search-result-item"
                onClick={() => handlePersonClick(person)}
              >
                <div className="person-info">
                  <div className="person-name">{person.name}</div>
                  <div className="person-details">
                    {person.gender && <span>Giới tính: <b>{person.gender}</b></span>}
                    {person.dateOfBirth && <span>  Ngày sinh: <b>{formatDateForDisplay(person.dateOfBirth)}</b></span>}
                    {person.passportNumber && <span>  Hộ chiếu: <b>{person.passportNumber}</b></span>}
                    {person.visaType && <span>  Visa: <b>{person.visaType}</b></span>}
                    {/* Show legacy fields if available */}
                    {person.age !== undefined && <span>  Tuổi: <b>{person.age}</b></span>}
                    {person.address && <span>  Địa chỉ: <b>{person.address}</b></span>}
                    {person.sheetName && <span className="sheet-name"> (từ {person.sheetName})</span>}
                  </div>
                </div>
                {/* <button className="add-btn">Thêm</button> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
