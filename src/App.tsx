import { useState } from 'react';
import FileUpload from './components/FileUpload';
import SearchComponent from './components/SearchComponent';
import PeopleTable from './components/PeopleTable';
import { exportToExcel } from './utils/excelUtils';
import type { Person, ExcelSheet } from './types/Person';
import './App.css';

function App() {
  const [importedSheets, setImportedSheets] = useState<ExcelSheet[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string>('');

  // Flatten all people from all sheets for searching
  const allPeople = importedSheets.flatMap(sheet => sheet.people);

  const handleFileImport = (sheets: ExcelSheet[]) => {
    setImportedSheets(sheets);
    setError('');
    
    const totalPeople = sheets.reduce((sum, sheet) => sum + sheet.people.length, 0);
    console.log(`Successfully imported ${sheets.length} sheet(s) with ${totalPeople} people total`);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handlePersonSelect = (person: Person) => {
    // Check if person is already selected
    const isAlreadySelected = selectedPeople.some(p => p.id === person.id);
    
    if (!isAlreadySelected) {
      setSelectedPeople(prev => [...prev, person]);
    }
  };

  const handleRemovePerson = (personId: string) => {
    setSelectedPeople(prev => prev.filter(person => person.id !== personId));
  };

  const handleExport = () => {
    try {
      exportToExcel(selectedPeople, `danh_sach_da_chon_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      setError(`Xuất file thất bại: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  };

  return (
    <div className="app">
      <header className="app-header-minimal">
        <h1>📊 Excel Manager</h1>
        <FileUpload onFileImport={handleFileImport} onError={handleError} />
        
        {importedSheets.length > 0 && (
          <div className="import-summary-minimal">
            ✅ {importedSheets.reduce((sum, sheet) => sum + sheet.people.length, 0)} người từ {importedSheets.length} sheet
          </div>
        )}
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={() => setError('')} className="close-error">✕</button>
          </div>
        )}

        {allPeople.length > 0 && (
          <section className="search-section">
            <h2>🔍 Tìm kiếm và chọn người</h2>
            <SearchComponent 
              allPeople={allPeople} 
              onPersonSelect={handlePersonSelect} 
            />
          </section>
        )}

        <PeopleTable 
          selectedPeople={selectedPeople}
          onRemovePerson={handleRemovePerson}
          onExport={handleExport}
        />
      </main>
    </div>
  );
}

export default App;
