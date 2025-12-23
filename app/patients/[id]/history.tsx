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
  const mockHistoryData: { [key: string]: Examination[] } = {
    '1': [
    {
      id: '1',
      patientId: id as string,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      services: [
        {
          serviceId: '1',
          service: {
            id: '1',
            name: 'Khám răng tổng quát',
            price: 200000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 200000,
          subtotal: 200000,
        },
        {
          serviceId: '2',
          service: {
            id: '2',
            name: 'Lấy cao răng',
            price: 300000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 300000,
          subtotal: 300000,
        },
      ],
      diseases: [
        {
          diseaseCategoryId: '1',
          diseaseCategory: {
            id: '1',
            name: 'Sâu răng',
            price: 300000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 300000,
          subtotal: 300000,
        },
      ],
      medicalNotes: 'Bệnh nhân cần vệ sinh răng miệng tốt hơn. Hẹn tái khám sau 1 tuần.',
      totalCost: 800000,
      status: 'completed',
      dentistName: 'BS. Nguyễn Thị C',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      patientId: id as string,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      services: [
        {
          serviceId: '3',
          service: {
            id: '3',
            name: 'Trám răng',
            price: 500000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 500000,
          subtotal: 500000,
        },
      ],
      diseases: [
        {
          diseaseCategoryId: '2',
          diseaseCategory: {
            id: '2',
            name: 'Viêm nướu',
            price: 250000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 250000,
          subtotal: 250000,
        },
      ],
      medicalNotes: 'Điều trị viêm nướu, bệnh nhân cần uống thuốc theo đơn.',
      totalCost: 750000,
      status: 'completed',
      dentistName: 'BS. Lê Văn D',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      patientId: id as string,
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      services: [
        {
          serviceId: '1',
          service: {
            id: '1',
            name: 'Khám răng tổng quát',
            price: 200000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 200000,
          subtotal: 200000,
        },
      ],
      diseases: [],
      medicalNotes: 'Khám định kỳ, tình trạng răng miệng ổn định.',
      totalCost: 200000,
      status: 'completed',
      dentistName: 'BS. Nguyễn Thị C',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      patientId: id as string,
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
      services: [
        {
          serviceId: '2',
          service: {
            id: '2',
            name: 'Lấy cao răng',
            price: 300000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 300000,
          subtotal: 300000,
        },
      ],
      diseases: [
        {
          diseaseCategoryId: '1',
          diseaseCategory: {
            id: '1',
            name: 'Sâu răng',
            price: 300000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 2,
          price: 300000,
          subtotal: 600000,
        },
      ],
      medicalNotes: 'Phát hiện 2 răng bị sâu, đã điều trị và trám răng.',
      totalCost: 900000,
      status: 'completed',
      dentistName: 'BS. Lê Văn D',
      createdAt: new Date().toISOString(),
    },
  ],
  '2': [
    {
      id: '5',
      patientId: '2',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      services: [
        {
          serviceId: '2',
          service: {
            id: '2',
            name: 'Lấy cao răng',
            price: 300000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 300000,
          subtotal: 300000,
        },
      ],
      diseases: [
        {
          diseaseCategoryId: '2',
          diseaseCategory: {
            id: '2',
            name: 'Viêm nướu',
            price: 250000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 250000,
          subtotal: 250000,
        },
      ],
      medicalNotes: 'Bệnh nhân bị viêm nướu nhẹ, đã điều trị và hướng dẫn vệ sinh răng miệng.',
      totalCost: 550000,
      status: 'completed',
      dentistName: 'BS. Lê Văn D',
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      patientId: '2',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      services: [
        {
          serviceId: '1',
          service: {
            id: '1',
            name: 'Khám răng tổng quát',
            price: 200000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 200000,
          subtotal: 200000,
        },
        {
          serviceId: '3',
          service: {
            id: '3',
            name: 'Trám răng',
            price: 500000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 500000,
          subtotal: 500000,
        },
      ],
      diseases: [],
      medicalNotes: 'Khám và trám 1 răng sâu, bệnh nhân cần tái khám sau 2 tuần.',
      totalCost: 700000,
      status: 'completed',
      dentistName: 'BS. Nguyễn Thị C',
      createdAt: new Date().toISOString(),
    },
  ],
  '3': [
    {
      id: '4',
      patientId: '3',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      services: [
        {
          serviceId: '1',
          service: {
            id: '1',
            name: 'Khám răng tổng quát',
            price: 200000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 200000,
          subtotal: 200000,
        },
        {
          serviceId: '3',
          service: {
            id: '3',
            name: 'Trám răng',
            price: 500000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 2,
          price: 500000,
          subtotal: 1000000,
        },
      ],
      diseases: [
        {
          diseaseCategoryId: '1',
          diseaseCategory: {
            id: '1',
            name: 'Sâu răng',
            price: 300000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 2,
          price: 300000,
          subtotal: 600000,
        },
      ],
      medicalNotes: 'Bệnh nhân mới, phát hiện 2 răng sâu, đã trám răng. Hẹn tái khám sau 1 tháng.',
      totalCost: 1800000,
      status: 'completed',
      dentistName: 'BS. Nguyễn Thị C',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      patientId: '3',
      date: new Date().toISOString(), // Today
      services: [
        {
          serviceId: '2',
          service: {
            id: '2',
            name: 'Lấy cao răng',
            price: 300000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 300000,
          subtotal: 300000,
        },
      ],
      diseases: [
        {
          diseaseCategoryId: '2',
          diseaseCategory: {
            id: '2',
            name: 'Viêm nướu',
            price: 250000,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          quantity: 1,
          price: 250000,
          subtotal: 250000,
        },
      ],
      medicalNotes: 'Khám định kỳ, có dấu hiệu viêm nướu nhẹ, đã điều trị.',
      totalCost: 550000,
      status: 'pending',
      dentistName: 'BS. Lê Văn D',
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

                {/* Services */}
                {exam.services.length > 0 && (
                  <View style={styles.servicesSection}>
                    <Text style={styles.sectionLabel}>Dịch vụ:</Text>
                    {exam.services.map((service, idx) => (
                      <View key={idx} style={styles.serviceItem}>
                        <Text style={styles.serviceName}>
                          • {service.service?.name || 'N/A'}
                        </Text>
                        <Text style={styles.servicePrice}>
                          {formatCurrency(service.subtotal)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Diseases */}
                {exam.diseases && exam.diseases.length > 0 && (
                  <View style={styles.diseasesSection}>
                    <Text style={styles.sectionLabel}>Mặt bệnh:</Text>
                    {exam.diseases.map((disease, idx) => (
                      <View key={idx} style={styles.serviceItem}>
                        <Text style={styles.serviceName}>
                          • {disease.diseaseCategory?.name || 'N/A'} (x{disease.quantity})
                        </Text>
                        <Text style={styles.servicePrice}>
                          {formatCurrency(disease.subtotal)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Medical Notes */}
                {exam.medicalNotes && (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>Ghi chú:</Text>
                    <Text style={styles.notesText}>{exam.medicalNotes}</Text>
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

