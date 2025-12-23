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
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ExaminationsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Mock data - replace with actual data fetching
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
      totalCost: 800000,
      status: 'completed',
      dentistName: 'BS. Nguyễn Thị C',
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
      totalCost: 550000,
      status: 'pending',
      dentistName: 'BS. Lê Văn D',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        createdAt: new Date().toISOString(),
      },
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      services: [],
      diseases: [],
      totalCost: 750000,
      status: 'completed',
      dentistName: 'BS. Lê Văn D',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
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
      totalCost: 1200000,
      status: 'completed',
      dentistName: 'BS. Nguyễn Thị C',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      patientId: '3',
      patient: {
        id: '3',
        name: 'Lê Văn C',
        phone: '0912345678',
        createdAt: new Date().toISOString(),
      },
      date: new Date().toISOString(),
      services: [],
      diseases: [],
      totalCost: 600000,
      status: 'pending',
      dentistName: 'BS. Lê Văn D',
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
    if (statusFilter !== 'all') {
      matchesStatus = exam.status === statusFilter;
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
            title="Hoàn thành"
            onPress={() => setStatusFilter('completed')}
            variant={statusFilter === 'completed' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
          />
          <Button
            title="Đang chờ"
            onPress={() => setStatusFilter('pending')}
            variant={statusFilter === 'pending' ? 'primary' : 'outline'}
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
                  </View>
                  <View style={styles.examFooter}>
                    <Text style={styles.examCost}>{formatCurrency(exam.totalCost)}</Text>
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
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterButton: {
    flex: 1,
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
  },
  examFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  examCost: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
});
