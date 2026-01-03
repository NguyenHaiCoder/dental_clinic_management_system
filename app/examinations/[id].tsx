import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ExaminationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();

  // Mock data - replace with actual data fetching
  // Lấy từ mock data trong examinations.tsx
  const mockExaminations: { [key: string]: any } = {
    '1': {
      id: '1',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        dateOfBirth: '15-05-1985',
        createdAt: new Date().toISOString(),
      },
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      symptoms: 'Đau răng số 6, sưng nướu',
      treatmentServices: [
        { id: '1', serviceName: 'Khám răng', price: 100000 },
        { id: '2', serviceName: 'Nhổ răng', price: 100000 },
      ],
      selectedDentistIds: ['1', '2'],
      totalCost: 200000,
      paidAmount: 100000,
      debt: 100000,
      status: 'completed' as const,
      dentistName: 'BS. Tuyết, BS. Phương',
      relative: 'Con-0341231231',
      followUpDates: ['03-01-2026', '05-01-2026'],
      followUpContent: 'Làm tiếp răng số 6, làm tiếp răng số 7',
      customerSignature: 'Nguyễn Văn A',
      dentistSignature: 'BS. Tuyết',
      createdAt: new Date().toISOString(),
    },
    '2': {
      id: '2',
      patientId: '2',
      patient: {
        id: '2',
        name: 'Trần Thị B',
        phone: '0907654321',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        dateOfBirth: '20-03-1990',
        createdAt: new Date().toISOString(),
      },
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      symptoms: 'Viêm nướu, chảy máu chân răng',
      treatmentServices: [
        { id: '1', serviceName: 'Khám răng', price: 100000 },
        { id: '2', serviceName: 'Lấy cao răng', price: 200000 },
      ],
      selectedDentistIds: ['2'],
      totalCost: 300000,
      paidAmount: 300000,
      debt: 0,
      status: 'completed' as const,
      dentistName: 'BS. Phương',
      relative: '',
      followUpDates: ['10-01-2026'],
      followUpContent: 'Tái khám sau điều trị',
      customerSignature: 'Trần Thị B',
      dentistSignature: 'BS. Phương',
      createdAt: new Date().toISOString(),
    },
    '3': {
      id: '3',
      patientId: '3',
      patient: {
        id: '3',
        name: 'Lê Văn C',
        phone: '0912345678',
        address: '789 Đường DEF, Quận 3, TP.HCM',
        dateOfBirth: '10-08-1992',
        createdAt: new Date().toISOString(),
      },
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      symptoms: 'Sâu răng số 7, đau nhức',
      treatmentServices: [
        { id: '1', serviceName: 'Khám răng', price: 100000 },
        { id: '2', serviceName: 'Trám răng', price: 500000 },
      ],
      selectedDentistIds: ['3'],
      totalCost: 600000,
      paidAmount: 400000,
      debt: 200000,
      status: 'completed' as const,
      dentistName: 'BS. Bình',
      relative: 'Ông-0923952123',
      followUpDates: [],
      customerSignature: 'Lê Văn C',
      dentistSignature: 'BS. Bình',
      createdAt: new Date().toISOString(),
    },
    '4': {
      id: '4',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        dateOfBirth: '15-05-1985',
        createdAt: new Date().toISOString(),
      },
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      symptoms: 'Răng khôn mọc lệch, đau nhức',
      treatmentServices: [
        { id: '1', serviceName: 'Khám răng', price: 100000 },
        { id: '2', serviceName: 'Nhổ răng khôn', price: 1500000 },
      ],
      selectedDentistIds: ['1'],
      totalCost: 1600000,
      paidAmount: 800000,
      debt: 800000,
      status: 'completed' as const,
      dentistName: 'BS. Tuyết',
      followUpDates: ['05-01-2026'],
      followUpContent: 'Kiểm tra vết thương sau nhổ răng',
      customerSignature: 'Nguyễn Văn A',
      dentistSignature: 'BS. Tuyết',
      createdAt: new Date().toISOString(),
    },
    '5': {
      id: '5',
      patientId: '2',
      patient: {
        id: '2',
        name: 'Trần Thị B',
        phone: '0907654321',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        dateOfBirth: '20-03-1990',
        createdAt: new Date().toISOString(),
      },
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      symptoms: 'Răng sứ bị vỡ, cần thay mới',
      treatmentServices: [
        { id: '1', serviceName: 'Khám răng', price: 100000 },
        { id: '2', serviceName: 'Làm răng sứ', price: 3000000 },
      ],
      selectedDentistIds: ['2', '3'],
      totalCost: 3100000,
      paidAmount: 3100000,
      debt: 0,
      status: 'completed' as const,
      dentistName: 'BS. Phương, BS. Bình',
      followUpDates: ['03-01-2026'],
      followUpContent: 'Kiểm tra răng sứ mới',
      customerSignature: 'Trần Thị B',
      dentistSignature: 'BS. Phương',
      createdAt: new Date().toISOString(),
    },
  };

  const examination = mockExaminations[id as string] || mockExaminations['1'];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang chờ';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const generatePDFHTML = () => {
    const exam = examination;
    const patient = exam.patient;
    
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
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #0066cc;
            }
            .clinic-name {
              color: #0066cc;
              font-size: 28px;
              font-weight: bold;
              margin: 0 0 15px 0;
            }
            .clinic-info {
              color: #0066cc;
              font-size: 14px;
              line-height: 1.8;
            }
            .clinic-info p {
              margin: 5px 0;
            }
            .clinic-info strong {
              font-weight: bold;
            }
            .clinic-info em {
              font-style: italic;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #0066cc;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #0066cc;
              margin: 0;
              font-size: 24px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #0066cc;
              margin-bottom: 10px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-row {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .info-label {
              font-weight: bold;
              color: #666;
              display: inline;
            }
            .info-value {
              color: #333;
              display: inline;
              margin-left: 5px;
            }
            .treatment-table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            .treatment-table th,
            .treatment-table td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            .treatment-table th {
              background-color: #0066cc;
              color: white;
            }
            .treatment-table tr:nth-child(even):not(.summary-row) {
              background-color: #f9f9f9;
            }
            .treatment-table .summary-row {
              background-color: #f5f5f5;
              border-top: 2px solid #ddd;
            }
            .treatment-table .summary-row.debt-row {
              background-color: #ffebee;
            }
            .signature-section {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              width: 45%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #333;
              margin-top: 60px;
              padding-top: 5px;
            }
            .follow-up-dates {
              margin-top: 10px;
            }
            .follow-up-date-item {
              padding: 8px 0;
              font-size: 14px;
              color: #333;
              min-height: 20px;
            }
            .follow-up-date-item.dotted-line {
              border-bottom: 1px dotted #999;
              padding-bottom: 12px;
              letter-spacing: 2px;
              word-break: break-all;
              overflow: hidden;
              width: 100%;
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

          <div class="header">
            <h1>HỒ SƠ KHÁM CHỮA BỆNH</h1>
          </div>

          <div class="section">
            <div class="section-title">I. THÔNG TIN BỆNH NHÂN</div>
            <div class="info-row">
              <span class="info-label">Họ và tên:</span>
              <span class="info-value">${patient?.name || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Số điện thoại:</span>
              <span class="info-value">${patient?.phone || 'N/A'}</span>
            </div>
            ${patient?.address ? `
            <div class="info-row">
              <span class="info-label">Địa chỉ:</span>
              <span class="info-value">${patient.address}</span>
            </div>
            ` : ''}
            ${patient?.dateOfBirth ? `
            <div class="info-row">
              <span class="info-label">Ngày sinh:</span>
              <span class="info-value">${patient.dateOfBirth}</span>
            </div>
            ` : ''}
            ${exam.relative ? `
            <div class="info-row">
              <span class="info-label">Người thân:</span>
              <span class="info-value">${exam.relative}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Ngày khám:</span>
              <span class="info-value">${formatDate(exam.date)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Bác sĩ:</span>
              <span class="info-value">${exam.dentistName || 'N/A'}</span>
            </div>
          </div>

          ${exam.symptoms ? `
          <div class="section">
            <div class="section-title">II. TRIỆU CHỨNG VÀ CHẨN ĐOÁN</div>
            <p>${exam.symptoms}</p>
          </div>
          ` : ''}

          ${exam.treatmentServices && exam.treatmentServices.length > 0 ? `
          <div class="section">
            <div class="section-title">III. KẾ HOẠCH ĐIỀU TRỊ (KÈM GIÁ TIỀN)</div>
            <table class="treatment-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Dịch vụ</th>
                  <th>Giá tiền</th>
                </tr>
              </thead>
              <tbody>
                ${exam.treatmentServices.map((service: any, index: number) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${service.serviceName}</td>
                    <td>${formatCurrency(service.price)}</td>
                  </tr>
                `).join('')}
                <tr class="summary-row">
                  <td></td>
                  <td style="font-weight: bold;">Thành tiền:</td>
                  <td style="font-weight: bold;">${formatCurrency(exam.totalCost || 0)}</td>
                </tr>
                ${exam.paidAmount !== undefined ? `
                <tr class="summary-row">
                  <td></td>
                  <td style="font-weight: bold;">Đã thanh toán:</td>
                  <td style="font-weight: bold;">${formatCurrency(exam.paidAmount)}</td>
                </tr>
                ` : ''}
                ${exam.debt !== undefined && exam.debt > 0 ? `
                <tr class="summary-row debt-row">
                  <td></td>
                  <td style="font-weight: bold;">Còn nợ:</td>
                  <td style="font-weight: bold; color: #d32f2f;">${formatCurrency(exam.debt)}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${exam.followUpDates && exam.followUpDates.length > 0 ? `
          <div class="section">
            <div class="section-title">V. LỊCH TÁI KHÁM</div>
            <div class="follow-up-dates">
              <div class="follow-up-date-item">${exam.followUpDates[0]}</div>
              <div class="follow-up-date-item dotted-line"></div>
              <div class="follow-up-date-item dotted-line"></div>
            </div>
          </div>
          ` : ''}

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">
                <strong>Chữ ký khách hàng</strong><br>
                ${exam.customerSignature || ''}
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line">
                <strong>Chữ ký bác sĩ</strong><br>
                ${exam.dentistSignature || ''}
              </div>
            </div>
          </div>

          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
            <p>Hồ sơ được tạo vào: ${formatDate(new Date().toISOString())}</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleExportPDF = async () => {
    try {
      const html = generatePDFHTML();
      
      if (Platform.OS === 'web') {
        // For web, open print dialog
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
        // For mobile, generate PDF
        await Print.printToFileAsync({ html });
        showToast('Đã xuất PDF thành công', 'success');
        // On mobile, you might want to share the file
        // You can use expo-sharing for this
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết khám bệnh</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status */}
        <View style={styles.statusContainer}>
          <StatusChip
            label={getStatusLabel(examination.status)}
            status={examination.status}
          />
        </View>

        {/* Patient Info */}
        <Card>
          <Text style={styles.sectionTitle}>Thông tin bệnh nhân</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tên:</Text>
            <Text style={styles.infoValue}>{examination.patient.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số điện thoại:</Text>
            <Text style={styles.infoValue}>{examination.patient.phone}</Text>
          </View>
        </Card>

        {/* Examination Info */}
        <Card>
          <Text style={styles.sectionTitle}>Thông tin khám bệnh</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày khám:</Text>
            <Text style={styles.infoValue}>{formatDate(examination.date)}</Text>
          </View>
          {examination.dentistName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bác sĩ:</Text>
              <Text style={styles.infoValue}>{examination.dentistName}</Text>
            </View>
          )}
        </Card>

        {/* Symptoms and Diagnosis */}
        {examination.symptoms && (
          <Card>
            <Text style={styles.sectionTitle}>II. Triệu chứng và chẩn đoán</Text>
            <Text style={styles.notesText}>{examination.symptoms}</Text>
          </Card>
        )}

        {/* Treatment Plan */}
        {examination.treatmentServices && examination.treatmentServices.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>III. Kế hoạch điều trị (kèm giá tiền)</Text>
            {examination.treatmentServices.map((service: any, index: number) => (
              <View key={index} style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                </View>
                <Text style={styles.servicePrice}>{formatCurrency(service.price)}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Payment Info */}
        <Card>
          <Text style={styles.sectionTitle}>Thanh toán</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thành tiền:</Text>
            <Text style={styles.infoValue}>{formatCurrency(examination.totalCost || 0)}</Text>
          </View>
          {examination.paidAmount !== undefined && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đã thanh toán:</Text>
              <Text style={styles.infoValue}>{formatCurrency(examination.paidAmount)}</Text>
            </View>
          )}
          {examination.debt !== undefined && examination.debt > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Còn nợ:</Text>
              <Text style={[styles.infoValue, styles.debtValue]}>
                {formatCurrency(examination.debt)}
              </Text>
            </View>
          )}
        </Card>

        {/* Follow-up Schedule */}
        {examination.followUpDates && examination.followUpDates.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Lịch tái khám</Text>
            {examination.followUpDates.map((date: string, index: number) => (
              <View key={index} style={styles.followUpDateItem}>
                <Ionicons name="calendar" size={16} color={colors.primary} />
                <Text style={styles.followUpDateText}>{date}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Follow-up Content (Internal) */}
        {examination.followUpContent && (
          <Card>
            <Text style={styles.sectionTitle}>Nội dung tái khám</Text>
            <Text style={styles.internalNote}>(Nội bộ xem, không in cho khách)</Text>
            <Text style={styles.notesText}>{examination.followUpContent}</Text>
          </Card>
        )}

        {/* Signatures */}
        {(examination.customerSignature || examination.dentistSignature) && (
          <Card>
            <Text style={styles.sectionTitle}>Chữ ký</Text>
            {examination.customerSignature && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Khách hàng:</Text>
                <Text style={styles.infoValue}>{examination.customerSignature}</Text>
              </View>
            )}
            {examination.dentistSignature && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bác sĩ:</Text>
                <Text style={styles.infoValue}>{examination.dentistSignature}</Text>
              </View>
            )}
          </Card>
        )}

        {/* Total */}
        <Card style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(examination.totalCost)}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Xuất PDF"
            onPress={handleExportPDF}
            fullWidth
            style={styles.exportButton}
          />
          <Button
            title="Xem lịch sử khám bệnh"
            onPress={() => router.push(`/patients/${examination.patientId}/history`)}
            fullWidth
            variant="outline"
            style={styles.historyButton}
            textStyle={styles.historyButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding.mobile,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: typography.title.mobile,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding.mobile,
    paddingBottom: spacing.xl,
  },
  statusContainer: {
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  serviceQuantity: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  servicePrice: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  notesText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  internalNote: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  followUpDateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  followUpDateText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  debtValue: {
    color: colors.error,
    fontFamily: typography.fontFamily.semiBold,
  },
  totalCard: {
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  actionButtons: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  exportButton: {
    marginBottom: 0,
  },
  historyButton: {
    marginTop: 0,
  },
  historyButtonText: {
    fontSize: typography.fontSize.base,
  },
});

