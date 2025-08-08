import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Person, ExcelSheet } from '../types/Person';

// Helper function to format dates from Excel
const formatDateFromExcel = (dateValue: any): string => {
  if (!dateValue) return '';
  
  console.log('Input date value:', dateValue, 'Type:', typeof dateValue);
  
  // If it's already a formatted string that looks like a date, return as is
  const dateStr = dateValue.toString().trim();
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(dateStr) || 
      /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(dateStr)) {
    console.log('Already formatted date:', dateStr);
    return dateStr;
  }
  
  // Handle Excel date serial number (most common case)
  if (typeof dateValue === 'number' && dateValue > 1 && dateValue < 2958466) { // Valid Excel date range
    try {
      console.log('Converting Excel serial number:', dateValue);
      
      // Excel date conversion - fix the off-by-one error
      // Excel serial number 1 = January 1, 1900
      // But we need to subtract 1 to get the correct date
      const EXCEL_EPOCH = new Date(1900, 0, 1); // January 1, 1900
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      
      // Subtract 1 from dateValue to correct the off-by-one issue
      const resultDate = new Date(EXCEL_EPOCH.getTime() + (dateValue - 1) * millisecondsPerDay);
      
      const day = resultDate.getDate().toString().padStart(2, '0');
      const month = (resultDate.getMonth() + 1).toString().padStart(2, '0');
      const year = resultDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      console.log('Converted to:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.warn('Error parsing Excel date serial:', dateValue, error);
    }
  }
  
  // Try to parse as a regular date string
  try {
    const parsedDate = new Date(dateValue);
    if (!isNaN(parsedDate.getTime())) {
      const day = parsedDate.getDate().toString().padStart(2, '0');
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = parsedDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (error) {
    // If all else fails, return the original value as string
    return dateStr;
  }
  
  return dateStr;
};

export const importExcelFile = (file: File): Promise<ExcelSheet[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheets: ExcelSheet[] = [];
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          // Skip empty sheets
          if (jsonData.length <= 1) return;
          
          const headers = jsonData[0];
          const people: Person[] = [];
          
          // Find the indices of required columns (Vietnamese format + legacy support)
          const sttIndex = headers.findIndex((header: string) => 
            header?.toString().toLowerCase().includes('stt') || 
            header?.toString().toLowerCase().includes('số thứ tự')
          );
          const nameIndex = headers.findIndex((header: string) => 
            header?.toString().toLowerCase().includes('họ và tên') ||
            header?.toString().toLowerCase().includes('họ tên') ||
            header?.toString().toLowerCase().includes('name')
          );
          const dateOfBirthIndex = headers.findIndex((header: string) => 
            header?.toString().toLowerCase().includes('ngày sinh') ||
            header?.toString().toLowerCase().includes('date of birth') ||
            header?.toString().toLowerCase().includes('birthday')
          );
          const passportIndex = headers.findIndex((header: string) => 
            header?.toString().toLowerCase().includes('số hộ chiếu') ||
            header?.toString().toLowerCase().includes('hộ chiếu') ||
            header?.toString().toLowerCase().includes('passport')
          );
          const visaTypeIndex = headers.findIndex((header: string) => 
            header?.toString().toLowerCase().includes('loại visa') ||
            header?.toString().toLowerCase().includes('visa type') ||
            header?.toString().toLowerCase().includes('visa')
          );
          const genderIndex = headers.findIndex((header: string) => 
            header?.toString().toLowerCase().includes('giới tính') ||
            header?.toString().toLowerCase().includes('gender')
          );
          // Legacy support
          const ageIndex = headers.findIndex((header: string) => 
            header?.toString().toLowerCase().includes('age') ||
            header?.toString().toLowerCase().includes('tuổi')
          );
          const addressIndex = headers.findIndex((header: string) => 
            header?.toString().toLowerCase().includes('address') ||
            header?.toString().toLowerCase().includes('địa chỉ')
          );
          
          // Process data rows
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            
            // Skip empty rows
            if (!row || row.every(cell => !cell)) continue;
            
            const person: Person = {
              id: `${sheetName}-${i}-${Date.now()}`, // More unique ID
              stt: sttIndex >= 0 ? (parseInt(row[sttIndex]?.toString()) || undefined) : undefined,
              name: nameIndex >= 0 ? (row[nameIndex]?.toString() || '') : '',
              gender: genderIndex >= 0 ? (row[genderIndex]?.toString() || '') : undefined,
              dateOfBirth: dateOfBirthIndex >= 0 ? formatDateFromExcel(row[dateOfBirthIndex]) : undefined,
              passportNumber: passportIndex >= 0 ? (row[passportIndex]?.toString() || '') : undefined,
              visaType: visaTypeIndex >= 0 ? (row[visaTypeIndex]?.toString() || '') : undefined,
              // Legacy fields for backward compatibility
              age: ageIndex >= 0 ? (parseInt(row[ageIndex]?.toString()) || undefined) : undefined,
              address: addressIndex >= 0 ? (row[addressIndex]?.toString() || '') : undefined,
              sheetName: sheetName
            };
            
            // Only add if name is not empty
            if (person.name.trim()) {
              people.push(person);
            }
          }
          
          if (people.length > 0) {
            sheets.push({
              name: sheetName,
              people: people
            });
          }
        });
        
        resolve(sheets);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (people: Person[], filename: string = 'exported_people.xlsx') => {
  try {
    // Prepare data for export with Vietnamese format
    const data = people.map((person, index) => ({
      'STT': person.stt || (index + 1),
      'Họ và tên': person.name,
      'Giới tính': person.gender || '',
      'Ngày sinh': person.dateOfBirth || '',
      'Số hộ chiếu': person.passportNumber || '',
      'Loại visa': person.visaType || '',
      // Include legacy fields if available
      ...(person.age !== undefined && { 'Tuổi': person.age }),
      ...(person.address && { 'Địa chỉ': person.address }),
      'Sheet gốc': person.sheetName || 'Unknown'
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported People');
    
    // Generate Excel file using array buffer method
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      compression: false // Disable compression to avoid crypto issues
    });
    
    // Save file
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};
