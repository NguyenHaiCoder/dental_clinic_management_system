import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../../components/Card';
import EmptyState from '../../../components/EmptyState';
import StatusChip from '../../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../../constants/theme';
import { Examination } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function PatientHistoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data - replace with actual data fetching
  const mockPatientData = {
    '1': {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
    },
    '2': {
      name: 'Trần Thị B',
      phone: '0907654321',
    },
    '3': {
      name: 'Lê Văn C',
      phone: '0912345678',
    },
  };

  const patientData = mockPatientData[id as keyof typeof mockPatientData] || mockPatientData['1'];
  const patientName = patientData.name;

  // Mock examination history - different for each patient
  // Sử dụng cấu trúc mới từ examinations.tsx
  const mockHistoryData: { [key: string]: Examination[] } = {
    '1': [
    {
      id: '1',
      patientId: id as string,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
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
      status: 'completed',
      dentistName: 'BS. Tuyết, BS. Phương',
      followUpDates: ['03-01-2026', '05-01-2026'],
      followUpContent: 'Làm tiếp răng số 6, làm tiếp răng số 7',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      patientId: id as string,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
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
      status: 'completed',
      dentistName: 'BS. Tuyết',
      followUpDates: ['05-01-2026'],
      followUpContent: 'Kiểm tra vết thương sau nhổ răng',
      createdAt: new Date().toISOString(),
    },
  ],
  '2': [
    {
      id: '2',
      patientId: '2',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
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
      status: 'completed',
      dentistName: 'BS. Phương',
      followUpDates: ['10-01-2026'],
      followUpContent: 'Tái khám sau điều trị',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      patientId: '2',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
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
      status: 'completed',
      dentistName: 'BS. Phương, BS. Bình',
      followUpDates: ['03-01-2026'],
      followUpContent: 'Kiểm tra răng sứ mới',
      createdAt: new Date().toISOString(),
    },
  ],
  '3': [
    {
      id: '3',
      patientId: '3',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
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
      status: 'completed',
      dentistName: 'BS. Bình',
      followUpDates: [],
      createdAt: new Date().toISOString(),
    },
  ],
  };

  const examinationHistory = mockHistoryData[id as keyof typeof mockHistoryData] || mockHistoryData['1'];

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

  const totalRevenue = examinationHistory.reduce((sum, exam) => sum + exam.totalCost, 0);
  const totalExaminations = examinationHistory.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử khám bệnh</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Info Summary */}
        <Card style={styles.patientCard}>
          <View style={styles.patientHeader}>
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{patientName}</Text>
              <Text style={styles.patientId}>Mã BN: {id}</Text>
            </View>
          </View>
        </Card>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Ionicons name="document-text-outline" size={24} color={colors.info} />
            <Text style={styles.statValue}>{totalExaminations}</Text>
            <Text style={styles.statLabel}>Tổng số lần khám</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color={colors.success} />
            <Text style={styles.statValue}>{formatCurrency(totalRevenue)}</Text>
            <Text style={styles.statLabel}>Tổng chi phí</Text>
          </Card>
        </View>

        {/* Examination History List */}
        {examinationHistory.length === 0 ? (
          <EmptyState
            icon="document-outline"
            title="Chưa có lịch sử khám bệnh"
            message="Bệnh nhân chưa có lịch sử khám bệnh trong hệ thống."
          />
        ) : (
          <View style={styles.listContainer}>
            {examinationHistory.map((exam) => (
              <Card
                key={exam.id}
                style={styles.examCard}
                onPress={() => router.push(`/examinations/${exam.id}`)}
              >
                <View style={styles.examHeader}>
                  <View style={styles.examHeaderLeft}>
                    <Text style={styles.examDate}>{formatDate(exam.date)}</Text>
                    {exam.dentistName && (
                      <Text style={styles.examDentist}>{exam.dentistName}</Text>
                    )}
                  </View>
                  <StatusChip
                    label={getStatusLabel(exam.status)}
                    status={exam.status as any}
                  />
                </View>

                {/* Symptoms */}
                {exam.symptoms && (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>Triệu chứng và chẩn đoán:</Text>
                    <Text style={styles.notesText}>{exam.symptoms}</Text>
                  </View>
                )}

                {/* Treatment Services */}
                {exam.treatmentServices && exam.treatmentServices.length > 0 && (
                  <View style={styles.servicesSection}>
                    <Text style={styles.sectionLabel}>Kế hoạch điều trị:</Text>
                    {exam.treatmentServices.map((service: any, idx: number) => (
                      <View key={idx} style={styles.serviceItem}>
                        <Text style={styles.serviceName}>• {service.serviceName}</Text>
                        <Text style={styles.servicePrice}>{formatCurrency(service.price)}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Payment Info */}
                <View style={styles.paymentSection}>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Đã thanh toán:</Text>
                    <Text style={styles.paymentValue}>
                      {formatCurrency(exam.paidAmount || 0)}
                    </Text>
                  </View>
                  {exam.debt && exam.debt > 0 && (
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Còn nợ:</Text>
                      <Text style={[styles.paymentValue, styles.debtValue]}>
                        {formatCurrency(exam.debt)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Follow-up Dates */}
                {exam.followUpDates && exam.followUpDates.length > 0 && (
                  <View style={styles.followUpSection}>
                    <Text style={styles.sectionLabel}>Lịch tái khám:</Text>
                    {exam.followUpDates.map((date: string, idx: number) => (
                      <View key={idx} style={styles.followUpItem}>
                        <Ionicons name="calendar" size={14} color={colors.primary} />
                        <Text style={styles.followUpText}>{date}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.examFooter}>
                  <Text style={styles.totalLabel}>Tổng cộng:</Text>
                  <Text style={styles.totalValue}>{formatCurrency(exam.totalCost)}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
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
    flex: 1,
    marginLeft: spacing.sm,
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
  patientCard: {
    marginBottom: spacing.md,
    backgroundColor: `${colors.primary}10`,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  patientId: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContainer: {
    gap: spacing.md,
  },
  examCard: {
    padding: spacing.md,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  examHeaderLeft: {
    flex: 1,
  },
  examDate: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  examDentist: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  servicesSection: {
    marginBottom: spacing.sm,
  },
  diseasesSection: {
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  serviceName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    flex: 1,
  },
  servicePrice: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  notesSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  paymentSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  paymentLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  paymentValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  debtValue: {
    color: colors.error,
  },
  followUpSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  followUpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  followUpText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary,
  },
  examFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
});

