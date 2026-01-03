import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { useToast } from '../../contexts/ToastContext';
import { Examination, Patient } from '../../types';
import { formatDate, getVietnamNow } from '../../utils/formatters';

export default function PatientsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateFilterModal, setShowDateFilterModal] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    from: formatDate(getVietnamNow()),
    to: formatDate(getVietnamNow()),
  });

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    try {
      // Parse date - could be YYYY-MM-DD or dd-mm-yyyy
      let birthDate: Date;
      if (dateOfBirth.includes('-')) {
        const parts = dateOfBirth.split('-');
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          birthDate = new Date(dateOfBirth);
        } else {
          // dd-mm-yyyy format
          birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        birthDate = new Date(dateOfBirth);
      }
      
      const today = getVietnamNow();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  // Helper function to format date for filter (dd/mm/yyyy)
  const formatDateForFilter = (dateStr: string): string => {
    try {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> dd-mm-yyyy
        const [year, month, day] = parts;
        return `${day}-${month}-${year}`;
      }
      // Already dd-mm-yyyy
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Helper to parse date from dd-mm-yyyy or yyyy-mm-dd to Date
  const parseInputDate = (value: string): Date => {
    if (!value) return new Date('');
    try {
      const parts = value.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // yyyy-mm-dd
          return new Date(value);
        }
        // dd-mm-yyyy
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
      return new Date(value);
    } catch {
      return new Date(value);
    }
  };

  // Helper function to format date of birth for display
  const formatDateOfBirth = (dateOfBirth?: string): string => {
    if (!dateOfBirth) return '';
    try {
      // Check if already in dd-mm-yyyy format
      if (dateOfBirth.includes('-') && dateOfBirth.split('-')[0].length <= 2) {
        // Already in dd-mm-yyyy format, return as is
        return dateOfBirth;
      }
      // Otherwise, try to format using formatDate
      return formatDate(dateOfBirth);
    } catch {
      return dateOfBirth;
    }
  };

  // Mock data - replace with actual data fetching
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      dateOfBirth: '15-05-1985',
      gender: 'male',
      occupation: 'Kỹ sư',
      notes: 'Bệnh nhân có tiền sử dị ứng thuốc',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Trần Thị B',
      phone: '0907654321',
      email: 'tranthib@example.com',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      dateOfBirth: '20-03-1990',
      gender: 'female',
      occupation: 'Giáo viên',
      notes: 'Bệnh nhân cần theo dõi định kỳ',
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Lê Văn C',
      phone: '0912345678',
      email: 'levanc@example.com',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      dateOfBirth: '10-08-1992',
      gender: 'male',
      occupation: 'Sinh viên',
      notes: 'Bệnh nhân mới, chưa có tiền sử',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Mock examinations data to get examination dates, symptoms, and treatment
  const mockExaminations: Examination[] = [
    {
      id: '1',
      patientId: '1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      symptoms: 'Đau răng số 6, sưng nướu',
      treatmentServices: [
        { id: '1', serviceName: 'Khám răng', price: 100000 },
        { id: '2', serviceName: 'Nhổ răng', price: 100000 },
      ],
      totalCost: 200000,
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      patientId: '2',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      symptoms: 'Viêm nướu, chảy máu chân răng',
      treatmentServices: [
        { id: '1', serviceName: 'Khám răng', price: 100000 },
        { id: '2', serviceName: 'Lấy cao răng', price: 200000 },
      ],
      totalCost: 300000,
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      patientId: '3',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      symptoms: 'Sâu răng số 7, đau nhức',
      treatmentServices: [
        { id: '1', serviceName: 'Khám răng', price: 100000 },
        { id: '2', serviceName: 'Trám răng', price: 500000 },
      ],
      totalCost: 600000,
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
  ];

  // Get patients with their latest examination in the date range
  const getPatientsWithExaminations = () => {
    const fromDate = parseInputDate(dateFilter.from);
    const toDate = parseInputDate(dateFilter.to);
    toDate.setHours(23, 59, 59, 999);

    return patients
      .map((patient) => {
        const patientExams = mockExaminations
          .filter(
            (exam) =>
              exam.patientId === patient.id &&
              new Date(exam.date) >= fromDate &&
              new Date(exam.date) <= toDate
          )
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (patientExams.length === 0) return null;

        const latestExam = patientExams[0];
        return {
          patient,
          examination: latestExam,
        };
      })
      .filter((item): item is { patient: Patient; examination: Examination } => item !== null);
  };

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.phone.includes(query) ||
      patient.email?.toLowerCase().includes(query)
    );
  });

  const handleExportPDF = async () => {
    try {
      const patientsWithExams = getPatientsWithExaminations();
      const html = generatePatientListPDFHTML(patientsWithExams, dateFilter, calculateAge);
      
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.print();
            showToast('Đã mở hộp thoại in', 'success');
          }
        }
      } else {
        await Print.printToFileAsync({ html });
        showToast('Đã xuất PDF thành công', 'success');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Có lỗi xảy ra khi xuất PDF', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bệnh nhân</Text>
        <Button
          title="Thêm mới"
          onPress={() => router.push('/patients/create')}
          size="small"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Filter and Export */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.dateFilterButton}
            onPress={() => setShowDateFilterModal(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.dateFilterText}>
              Từ: {formatDateForFilter(dateFilter.from)} - Đến: {formatDateForFilter(dateFilter.to)}
            </Text>
          </TouchableOpacity>
          <Button
            title="Xuất PDF"
            onPress={handleExportPDF}
            size="small"
            style={styles.exportButton}
          />
        </View>

        {/* Search */}
        <Input
          placeholder="Tìm bệnh nhân theo tên, số điện thoại hoặc email"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="Không có dữ liệu bệnh nhân"
            message="Chưa có bệnh nhân nào trong hệ thống."
          />
        ) : (
          <View style={styles.listContainer}>
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                style={styles.patientCard}
                onPress={() => router.push(`/patients/${patient.id}`)}
              >
                <View style={styles.patientHeader}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <View style={styles.patientDetails}>
                      <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.patientDetailText}>{patient.phone}</Text>
                    </View>
                    {patient.email && (
                      <View style={styles.patientDetails}>
                        <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.patientDetailText}>{patient.email}</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>
                {patient.dateOfBirth && (
                  <View style={styles.patientFooter}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.patientFooterText}>
                      Sinh ngày: {formatDateOfBirth(patient.dateOfBirth)}
                    </Text>
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Date Filter Modal */}
      <Modal
        visible={showDateFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lọc theo ngày</Text>
              <TouchableOpacity onPress={() => setShowDateFilterModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Input
                label="Từ ngày"
                value={dateFilter.from}
                onChangeText={(text) => setDateFilter((prev) => ({ ...prev, from: text }))}
                placeholder="dd-mm-yyyy"
                style={styles.dateInput}
              />
              <Input
                label="Đến ngày"
                value={dateFilter.to}
                onChangeText={(text) => setDateFilter((prev) => ({ ...prev, to: text }))}
                placeholder="dd-mm-yyyy"
                style={styles.dateInput}
              />
              <Button
                title="Áp dụng"
                onPress={() => {
                  setShowDateFilterModal(false);
                  showToast('Đã cập nhật bộ lọc', 'success');
                }}
                fullWidth
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function generatePatientListPDFHTML(
  patientsWithExams: Array<{ patient: Patient; examination: Examination }>,
  dateFilter: { from: string; to: string },
  calculateAge: (dateOfBirth?: string) => number | null
) {
    const getGenderLabel = (gender?: string) => {
      switch (gender) {
        case 'male':
          return 'Nam';
        case 'female':
          return 'Nữ';
        default:
          return '';
      }
    };

    const getTreatmentText = (exam: Examination): string => {
      if (exam.treatmentServices && exam.treatmentServices.length > 0) {
        return exam.treatmentServices.map((s) => s.serviceName).join(', ');
      }
      return '';
    };

    const formatDateForFilter = (dateStr: string): string => {
      try {
        // Convert YYYY-MM-DD to dd/mm/yyyy
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      } catch {
        return dateStr;
      }
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .clinic-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #0066cc;
            }
            .clinic-name {
              color: #0066cc;
              font-size: 24px;
              font-weight: bold;
              margin: 0 0 10px 0;
            }
            .clinic-info {
              color: #0066cc;
              font-size: 13px;
              line-height: 1.6;
            }
            .clinic-info p {
              margin: 3px 0;
            }
            .title {
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              margin: 20px 0;
              text-transform: uppercase;
            }
            .date-range {
              text-align: center;
              margin-bottom: 20px;
              font-size: 14px;
            }
            .patient-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 11px;
            }
            .patient-table th,
            .patient-table td {
              border: 1px solid #333;
              padding: 6px;
              text-align: left;
            }
            .patient-table th {
              background-color: #f0f0f0;
              font-weight: bold;
              text-align: center;
            }
            .patient-table td {
              vertical-align: top;
            }
            .footer {
              margin-top: 40px;
              text-align: right;
            }
            .footer-date {
              margin-bottom: 60px;
            }
            .signature-line {
              border-top: 1px solid #333;
              width: 200px;
              margin-left: auto;
              padding-top: 5px;
              text-align: center;
            }
            @media print {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="clinic-header">
            <h1 class="clinic-name">NHA KHOA HỒNG TUYẾT</h1>
            <div class="clinic-info">
              <p><strong>Địa chỉ:</strong> <em>Số 130 đường 5/2, Quán Toan, Hồng Bàng, Hải Phòng</em></p>
              <p><strong>Điện thoại:</strong> 0983749275</p>
              <p><strong>Giấy phép KCB:</strong> 329/2013/GPHĐ-SYT</p>
            </div>
          </div>

          <div class="title">DANH SÁCH BỆNH NHÂN KHÁM BỆNH</div>

          <div class="date-range">
            <strong>Từ ngày:</strong> ${formatDateForFilter(dateFilter.from)} - 
            <strong>Đến ngày:</strong> ${formatDateForFilter(dateFilter.to)}
          </div>

          <table class="patient-table">
            <thead>
              <tr>
                <th style="width: 3%;">STT</th>
                <th style="width: 8%;">Ngày khám</th>
                <th style="width: 12%;">Họ và tên</th>
                <th style="width: 5%;">Tuổi</th>
                <th style="width: 6%;">Giới tính</th>
                <th style="width: 10%;">Nghề nghiệp</th>
                <th style="width: 15%;">Địa chỉ</th>
                <th style="width: 18%;">Chẩn đoán (Hoặc triệu chứng chính)</th>
                <th style="width: 23%;">Điều trị</th>
              </tr>
            </thead>
            <tbody>
              ${patientsWithExams.map((item, index) => {
                const age = calculateAge(item.patient.dateOfBirth);
                return `
                  <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${formatDate(item.examination.date)}</td>
                    <td>${item.patient.name.toUpperCase()}</td>
                    <td style="text-align: center;">${age !== null ? age : ''}</td>
                    <td>${getGenderLabel(item.patient.gender)}</td>
                    <td>${item.patient.occupation || ''}</td>
                    <td>${item.patient.address || ''}</td>
                    <td>${item.examination.symptoms || ''}</td>
                    <td>${getTreatmentText(item.examination)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="footer-date">
              <strong>Ngày ${new Date(getVietnamNow()).getDate()} Tháng ${new Date(getVietnamNow()).getMonth() + 1} Năm ${new Date(getVietnamNow()).getFullYear()}</strong>
            </div>
            <div class="signature-line">
              <strong>(Người lập biểu)</strong>
            </div>
          </div>
        </body>
      </html>
    `;
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  dateFilterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  dateFilterText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  exportButton: {
    minWidth: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding.mobile,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: typography.title.mobile,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding.mobile,
    paddingBottom: spacing.xl,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    width: '90%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  dateInput: {
    marginBottom: spacing.md,
  },
  modalButton: {
    marginTop: spacing.sm,
  },
  listContainer: {
    gap: spacing.sm,
  },
  patientCard: {
    padding: spacing.md,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  patientDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs / 2,
  },
  patientDetailText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  patientFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  patientFooterText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
});
