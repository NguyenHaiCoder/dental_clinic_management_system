// Type definitions for Dental Clinic Management System

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  occupation?: string; // Nghề nghiệp
  notes?: string;
  createdAt: string;
}

export interface DentalService {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface Examination {
  id: string;
  patientId: string;
  patient?: Patient;
  date: string;
  services: ExaminationService[];
  diseases: ExaminationDisease[];
  symptoms?: string; // Triệu chứng và chẩn đoán
  treatmentServices?: Array<{
    id: string;
    serviceName: string;
    price: number;
  }>; // Kế hoạch điều trị (dịch vụ tự nhập)
  selectedDentistIds?: string[]; // Danh sách bác sĩ đã chọn
  relative?: string; // Người thân
  medicalNotes?: string;
  totalCost: number;
  paidAmount?: number; // Số tiền đã thanh toán
  debt?: number; // Số tiền còn nợ
  status: 'completed' | 'pending' | 'cancelled' | 'appointment'; // appointment = có lịch hẹn
  dentistId?: string;
  dentistName?: string;
  followUpDates?: string[]; // Lịch tái khám
  followUpContent?: string; // Nội dung tái khám (nội bộ)
  createdAt: string;
}

export interface ExaminationService {
  serviceId: string;
  service?: DentalService;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export interface Statistics {
  totalPatients: number;
  totalExaminations: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
}

export interface RevenueByService {
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
}

export interface DiseaseCategory {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface ExaminationDisease {
  diseaseCategoryId: string;
  diseaseCategory?: DiseaseCategory;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  examinationId?: string; // Link to examination if it's a follow-up
  appointmentDate: string;
  content?: string; // Internal notes, not for printing
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string; // Tên xưởng
  phone: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  supplier?: Supplier;
  patientId: string;
  patient?: Patient;
  patientName: string;
  patientPhone: string;
  sentDate: string; // Ngày gửi (auto or custom)
  requirements?: string; // Yêu cầu (chất liệu, etc.)
  toothCount: number; // Số lượng răng
  totalAmount: number; // Tổng tiền
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string; // Tên vật tư
  unit?: string; // Đơn vị tính
  stock: number; // Tồn kho hiện tại
  createdAt: string;
}

export interface InventoryImport {
  id: string;
  itemId: string;
  item?: InventoryItem;
  quantity: number; // Số lượng nhập
  importPrice: number; // Giá nhập
  totalPrice: number; // Tổng giá nhập
  date: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryExport {
  id: string;
  itemId: string;
  item?: InventoryItem;
  quantity: number; // Số lượng xuất
  exportDate: string; // Ngày xuất
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  examinationId: string;
  amount: number; // Số tiền thanh toán
  paymentDate: string;
  paymentMethod?: 'cash' | 'card' | 'transfer';
  notes?: string;
  createdAt: string;
}

export interface PatientRelative {
  id: string;
  patientId: string;
  relationship: string; // Ví dụ: "Con", "Cha", "Mẹ"
  name?: string;
  phone: string;
  notes?: string;
  createdAt: string;
}


