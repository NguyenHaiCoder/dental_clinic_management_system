import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { Examination } from '../../types';
import { formatCurrency, formatDate, getVietnamNow } from '../../utils/formatters';

export default function ExaminationsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'appointment-today' | 'appointment-upcoming' | 'debt'>('all');

  // Helper function to parse dd-mm-yyyy date string to Date object
  const parseDateString = (dateStr: string): Date | null => {
    try {
      const [day, month, year] = dateStr.split('-').map(Number);
      if (day && month && year) {
        // Create date in UTC+7 (Vietnam timezone)
        const date = new Date();
        date.setFullYear(year, month - 1, day);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    } catch {
      // Invalid date format
    }
    return null;
  };

  // Helper function to check if date string is today
  const isToday = (dateStr: string): boolean => {
    const date = parseDateString(dateStr);
    if (!date) return false;
    const today = getVietnamNow();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to check if date string is in the future (after today)
  const isFuture = (dateStr: string): boolean => {
    const date = parseDateString(dateStr);
    if (!date) return false;
    const today = getVietnamNow();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // Mock data - replace with actual data fetching
  // Mock data với thông tin đầy đủ từ hồ sơ khám chữa bệnh
  const todayStr = formatDate(getVietnamNow());
  const tomorrow = new Date(getVietnamNow());
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);
  const nextWeek = new Date(getVietnamNow());
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = formatDate(nextWeek);

  const examinations: Examination[] = [
    {
      id: '1',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
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
      status: 'completed',
      dentistName: 'BS. Tuyết, BS. Phương',
      followUpDates: [todayStr, tomorrowStr], // Hôm nay và ngày mai
      followUpContent: 'Làm tiếp răng số 6, làm tiếp răng số 7',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      patientId: '2',
      patient: {
        id: '2',
        name: 'Trần Thị B',
        phone: '0907654321',
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
      status: 'completed',
      dentistName: 'BS. Phương',
      followUpDates: [nextWeekStr], // Tuần sau
      followUpContent: 'Tái khám sau điều trị',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      patientId: '3',
      patient: {
        id: '3',
        name: 'Lê Văn C',
        phone: '0912345678',
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
      status: 'completed',
      dentistName: 'BS. Bình',
      followUpDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
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
      status: 'completed',
      dentistName: 'BS. Tuyết',
      followUpDates: [tomorrowStr], // Ngày mai
      followUpContent: 'Kiểm tra vết thương sau nhổ răng',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      patientId: '2',
      patient: {
        id: '2',
        name: 'Trần Thị B',
        phone: '0907654321',
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
      status: 'completed',
      dentistName: 'BS. Phương, BS. Bình',
      followUpDates: [todayStr], // Hôm nay
      followUpContent: 'Kiểm tra răng sứ mới',
      createdAt: new Date().toISOString(),
    },
  ];

  const dailySummary = {
    patients: examinations.length,
    revenue: examinations.reduce((sum, exam) => sum + exam.totalCost, 0),
  };

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

  const filteredExaminations = examinations.filter((exam) => {
    // Filter by search query
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      const isNumericQuery = /^\d+$/.test(query);
      const nameMatch = exam.patient?.name.toLowerCase().includes(query.toLowerCase()) || false;
      
      let phoneMatch = false;
      if (isNumericQuery && query.length <= 3) {
        // If query is numeric and length <= 3, ONLY check last 3 digits (exact match or substring)
        const phoneLast3 = exam.patient?.phone.slice(-3) || '';
        phoneMatch = phoneLast3 === query || phoneLast3.includes(query);
      } else if (isNumericQuery && query.length > 3) {
        // If query is numeric and length > 3, check full phone number
        phoneMatch = exam.patient?.phone.includes(query) || false;
      } else {
        // If query is not numeric, check name only (don't search in phone)
        phoneMatch = false;
      }
      
      matchesSearch = nameMatch || phoneMatch;
    }

    // Filter by status
    let matchesStatus = true;
    if (statusFilter === 'appointment-today') {
      // Lọc bệnh nhân có lịch hẹn hôm nay
      matchesStatus =
        !!(exam.followUpDates && exam.followUpDates.length > 0 && exam.followUpDates.some((date) => isToday(date)));
    } else if (statusFilter === 'appointment-upcoming') {
      // Lọc bệnh nhân có lịch hẹn sắp tới (sau hôm nay)
      matchesStatus =
        !!(exam.followUpDates && exam.followUpDates.length > 0 && exam.followUpDates.some((date) => isFuture(date)));
    } else if (statusFilter === 'debt') {
      // Lọc bệnh nhân nợ tiền
      matchesStatus = !!(exam.debt && exam.debt > 0) || (exam.totalCost > (exam.paidAmount || 0));
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Khám bệnh</Text>
        <Button
          title="Tạo mới"
          onPress={() => router.push('/examinations/create')}
          size="small"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Summary */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Ionicons name="people-outline" size={20} color={colors.primary} />
            <View style={styles.summaryText}>
              <Text style={styles.summaryValue}>{dailySummary.patients}</Text>
              <Text style={styles.summaryLabel}>Bệnh nhân hôm nay</Text>
            </View>
          </Card>
          <Card style={styles.summaryCard}>
            <Ionicons name="cash-outline" size={20} color={colors.success} />
            <View style={styles.summaryText}>
              <Text style={styles.summaryValue}>
                {formatCurrency(dailySummary.revenue)}
              </Text>
              <Text style={styles.summaryLabel}>Doanh thu hôm nay</Text>
            </View>
          </Card>
        </View>

        {/* Search */}
        <Input
          placeholder="Tìm bệnh nhân theo tên hoặc 3 số cuối số điện thoại"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />

        {/* Status Filter Buttons */}
        <View style={styles.filterContainer}>
          <Button
            title="Tất cả"
            onPress={() => setStatusFilter('all')}
            variant={statusFilter === 'all' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
          />
          <Button
            title="Lịch hẹn hôm nay"
            onPress={() => setStatusFilter('appointment-today')}
            variant={statusFilter === 'appointment-today' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
          />
          <Button
            title="Lịch hẹn sắp tới"
            onPress={() => setStatusFilter('appointment-upcoming')}
            variant={statusFilter === 'appointment-upcoming' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
          />
          <Button
            title="Bệnh nhân nợ"
            onPress={() => setStatusFilter('debt')}
            variant={statusFilter === 'debt' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
          />
        </View>

        {/* Examinations List */}
        {filteredExaminations.length === 0 ? (
          <EmptyState
            icon="document-outline"
            title="Không có dữ liệu khám bệnh"
            message="Không có dữ liệu khám bệnh trong khoảng thời gian này."
          />
        ) : (
          <View style={styles.listContainer}>
            {filteredExaminations.map((exam) => (
              <Card
                key={exam.id}
                style={styles.examCard}
                onPress={() => router.push(`/examinations/${exam.id}`)}
              >
                  <View style={styles.examHeader}>
                    <View style={styles.examHeaderLeft}>
                      <Text style={styles.examPatientName}>
                        {exam.patient?.name || 'N/A'}
                      </Text>
                      <Text style={styles.examPhone}>{exam.patient?.phone}</Text>
                    </View>
                    <StatusChip
                      label={getStatusLabel(exam.status)}
                      status={exam.status as any}
                    />
                  </View>
                  {exam.symptoms && (
                    <View style={styles.examSymptoms}>
                      <Text style={styles.examSymptomsText} numberOfLines={2}>
                        {exam.symptoms}
                      </Text>
                    </View>
                  )}
                  {exam.treatmentServices && exam.treatmentServices.length > 0 && (
                    <View style={styles.examServices}>
                      <Text style={styles.examServicesLabel}>Dịch vụ:</Text>
                      <Text style={styles.examServicesText} numberOfLines={2}>
                        {exam.treatmentServices.map((s) => s.serviceName).join(', ')}
                      </Text>
                    </View>
                  )}
                  <View style={styles.examDetails}>
                    <View style={styles.examDetailRow}>
                      <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.examDetailText}>
                        {formatDate(exam.date)}
                      </Text>
                    </View>
                    {exam.dentistName && (
                      <View style={styles.examDetailRow}>
                        <Ionicons name="medical-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.examDetailText}>{exam.dentistName}</Text>
                      </View>
                    )}
                    {exam.followUpDates && exam.followUpDates.length > 0 && (
                      <View style={styles.examDetailRow}>
                        <Ionicons name="calendar" size={16} color={colors.primary} />
                        <Text style={[styles.examDetailText, styles.followUpText]}>
                          Tái khám: {exam.followUpDates.join(', ')}
                        </Text>
                      </View>
                    )}
                    {exam.debt && exam.debt > 0 && (
                      <View style={styles.examDetailRow}>
                        <Ionicons name="alert-circle" size={16} color={colors.error} />
                        <Text style={[styles.examDetailText, styles.debtText]}>
                          Còn nợ: {formatCurrency(exam.debt)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.examFooter}>
                    <View style={styles.examFooterLeft}>
                      <Text style={styles.examCost}>{formatCurrency(exam.totalCost)}</Text>
                      {exam.paidAmount !== undefined && exam.paidAmount > 0 && (
                        <Text style={styles.examPaidAmount}>
                          Đã trả: {formatCurrency(exam.paidAmount)}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
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
  summaryContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  summaryText: {
    flex: 1,
  },
  summaryValue: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterButton: {
    flex: 1,
    minWidth: '45%',
  },
  listContainer: {
    gap: spacing.sm,
  },
  examCard: {
    padding: spacing.md,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  examHeaderLeft: {
    flex: 1,
  },
  examPatientName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  examPhone: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  examSymptoms: {
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: `${colors.primary}10`,
    borderRadius: spacing.xs,
  },
  examSymptomsText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  examServices: {
    marginBottom: spacing.sm,
  },
  examServicesLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  examServicesText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  examDetails: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  examDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  examDetailText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  followUpText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
  debtText: {
    color: colors.error,
    fontFamily: typography.fontFamily.medium,
  },
  examFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  examFooterLeft: {
    flex: 1,
  },
  examCost: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  examPaidAmount: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
});
