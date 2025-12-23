// Type definitions for Dental Clinic Management System

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
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
  medicalNotes?: string;
  totalCost: number;
  status: 'completed' | 'pending' | 'cancelled';
  dentistId?: string;
  dentistName?: string;
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


