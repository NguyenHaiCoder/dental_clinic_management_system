import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ExaminationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data - replace with actual data fetching
  const mockExaminations: { [key: string]: any } = {
    '1': {
      id: '1',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
      },
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      services: [
        { name: 'Khám răng tổng quát', price: 200000, quantity: 1 },
        { name: 'Lấy cao răng', price: 300000, quantity: 1 },
      ],
      diseases: [
        { name: 'Sâu răng', price: 300000, quantity: 1 },
      ],
      medicalNotes: 'Bệnh nhân cần vệ sinh răng miệng tốt hơn. Hẹn tái khám sau 1 tuần.',
      totalCost: 800000,
      status: 'completed' as const,
      dentistName: 'BS. Nguyễn Thị C',
    },
    '2': {
      id: '2',
      patientId: '2',
      patient: {
        id: '2',
        name: 'Trần Thị B',
        phone: '0907654321',
      },
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      services: [
        { name: 'Lấy cao răng', price: 300000, quantity: 1 },
      ],
      diseases: [
        { name: 'Viêm nướu', price: 250000, quantity: 1 },
      ],
      medicalNotes: 'Bệnh nhân bị viêm nướu nhẹ, đã điều trị và hướng dẫn vệ sinh răng miệng.',
      totalCost: 550000,
      status: 'pending' as const,
      dentistName: 'BS. Lê Văn D',
    },
    '3': {
      id: '3',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
      },
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      services: [
        { name: 'Trám răng', price: 500000, quantity: 1 },
      ],
      diseases: [
        { name: 'Viêm nướu', price: 250000, quantity: 1 },
      ],
      medicalNotes: 'Điều trị viêm nướu, bệnh nhân cần uống thuốc theo đơn.',
      totalCost: 750000,
      status: 'completed' as const,
      dentistName: 'BS. Lê Văn D',
    },
    '4': {
      id: '4',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
      },
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      services: [
        { name: 'Khám răng tổng quát', price: 200000, quantity: 1 },
      ],
      diseases: [],
      medicalNotes: 'Khám định kỳ, tình trạng răng miệng ổn định.',
      totalCost: 200000,
      status: 'completed' as const,
      dentistName: 'BS. Nguyễn Thị C',
    },
    '5': {
      id: '5',
      patientId: '2',
      patient: {
        id: '2',
        name: 'Trần Thị B',
        phone: '0907654321',
      },
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      services: [
        { name: 'Lấy cao răng', price: 300000, quantity: 1 },
      ],
      diseases: [
        { name: 'Viêm nướu', price: 250000, quantity: 1 },
      ],
      medicalNotes: 'Bệnh nhân bị viêm nướu nhẹ, đã điều trị và hướng dẫn vệ sinh răng miệng.',
      totalCost: 550000,
      status: 'completed' as const,
      dentistName: 'BS. Lê Văn D',
    },
    '6': {
      id: '6',
      patientId: '2',
      patient: {
        id: '2',
        name: 'Trần Thị B',
        phone: '0907654321',
      },
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      services: [
        { name: 'Khám răng tổng quát', price: 200000, quantity: 1 },
        { name: 'Trám răng', price: 500000, quantity: 1 },
      ],
      diseases: [],
      medicalNotes: 'Khám và trám 1 răng sâu, bệnh nhân cần tái khám sau 2 tuần.',
      totalCost: 700000,
      status: 'completed' as const,
      dentistName: 'BS. Nguyễn Thị C',
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

        {/* Services */}
        {examination.services.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Dịch vụ</Text>
            {examination.services.map((service, index) => (
              <View key={index} style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceQuantity}>Số lượng: {service.quantity}</Text>
                </View>
                <Text style={styles.servicePrice}>
                  {formatCurrency(service.price * service.quantity)}
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* Disease Categories */}
        {examination.diseases && examination.diseases.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Các mặt bệnh</Text>
            {examination.diseases.map((disease, index) => (
              <View key={index} style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{disease.name}</Text>
                  <Text style={styles.serviceQuantity}>Số lượng: {disease.quantity}</Text>
                </View>
                <Text style={styles.servicePrice}>
                  {formatCurrency(disease.price * disease.quantity)}
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* Medical Notes */}
        {examination.medicalNotes && (
          <Card>
            <Text style={styles.sectionTitle}>Ghi chú y tế</Text>
            <Text style={styles.notesText}>{examination.medicalNotes}</Text>
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

        {/* View Patient History Button */}
        <Button
          title="Xem lịch sử khám bệnh"
          onPress={() => router.push(`/patients/${examination.patientId}/history`)}
          fullWidth
          variant="outline"
          style={styles.historyButton}
          textStyle={styles.historyButtonText}
        />
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
  historyButton: {
    marginTop: spacing.lg,
  },
  historyButtonText: {
    fontSize: typography.fontSize.base,
  },
});

