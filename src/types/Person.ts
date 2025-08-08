export interface Person {
  id: string;
  stt?: number; // STT - Sequence Number
  name: string; // Họ và tên - Full Name
  gender?: string; // Giới tính - Gender
  dateOfBirth?: string; // Ngày sinh - Date of Birth
  passportNumber?: string; // Số hộ chiếu - Passport Number
  visaType?: string; // Loại visa - Visa Type
  // Keep legacy fields for backward compatibility
  age?: number;
  address?: string;
  sheetName?: string; // To track which sheet this person came from
}

export interface ExcelSheet {
  name: string;
  people: Person[];
}
