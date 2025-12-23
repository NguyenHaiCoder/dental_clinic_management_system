import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { formatCurrency, formatDate, getTodayDate, getDateRange } from '../../utils/formatters';

export default function ReportsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [customDateRange, setCustomDateRange] = useState({
    start: getDateRange(7).start,
    end: getTodayDate(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Calculate date range based on selected period
  const getCurrentDateRange = () => {
    switch (selectedPeriod) {
      case 'today':
        return { start: getTodayDate(), end: getTodayDate() };
      case 'week':
        return getDateRange(7);
      case 'month':
        return getDateRange(30);
      case 'custom':
        return customDateRange;
      default:
        return { start: getTodayDate(), end: getTodayDate() };
    }
  };

  const dateRange = getCurrentDateRange();

  // Mock data based on date range - replace with actual data fetching
  const calculateMockStats = () => {
    const daysDiff = Math.ceil(
      (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const days = daysDiff || 1;

    // Base stats per day
    const dailyRevenue = 2500000;
    const dailyExpenses = 800000;
    const dailyPatients = 8;
    const dailyExaminations = 10;

    return {
      revenue: dailyRevenue * days,
      expenses: dailyExpenses * days,
      profit: (dailyRevenue - dailyExpenses) * days,
      patients: dailyPatients * days,
      examinations: dailyExaminations * days,
    };
  };

  const stats = calculateMockStats();

  // Mock revenue by service based on period
  const calculateRevenueByService = () => {
    const daysDiff = Math.ceil(
      (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const days = daysDiff || 1;

    return [
      {
        serviceName: 'Khám răng tổng quát',
        revenue: 200000 * 4 * days,
        count: 4 * days,
      },
      {
        serviceName: 'Lấy cao răng',
        revenue: 300000 * 3 * days,
        count: 3 * days,
      },
      {
        serviceName: 'Trám răng',
        revenue: 500000 * 2 * days,
        count: 2 * days,
      },
      {
        serviceName: 'Sâu răng',
        revenue: 300000 * 2 * days,
        count: 2 * days,
      },
      {
        serviceName: 'Viêm nướu',
        revenue: 250000 * 2 * days,
        count: 2 * days,
      },
      {
        serviceName: 'Nhổ răng',
        revenue: 400000 * 1 * days,
        count: 1 * days,
      },
    ];
  };

  const revenueByService = calculateRevenueByService();

  const periods = [
    { key: 'today' as const, label: 'Hôm nay' },
    { key: 'week' as const, label: '7 ngày' },
    { key: 'month' as const, label: '30 ngày' },
    { key: 'custom' as const, label: 'Tùy chọn' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Báo cáo</Text>
        <TouchableOpacity
          style={styles.expenseButton}
          onPress={() => router.push('/expenses')}
        >
          <Ionicons name="receipt-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          {periods.map((period) => (
            <Button
              key={period.key}
              title={period.label}
              onPress={() => {
                setSelectedPeriod(period.key);
                if (period.key === 'custom') {
                  setShowDatePicker(true);
                }
              }}
              variant={selectedPeriod === period.key ? 'primary' : 'outline'}
              size="small"
              style={styles.periodButton}
            />
          ))}
        </View>

        {/* Date Range Display */}
        <Card style={styles.dateRangeCard}>
          <View style={styles.dateRangeRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <View style={styles.dateRangeText}>
              <Text style={styles.dateRangeLabel}>Khoảng thời gian:</Text>
              <Text style={styles.dateRangeValue}>
                {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Custom Date Range Picker */}
        {selectedPeriod === 'custom' && (
          <Card style={styles.customDateCard}>
            <Text style={styles.sectionTitle}>Chọn khoảng thời gian</Text>
            <Input
              label="Từ ngày"
              value={customDateRange.start}
              onChangeText={(text) =>
                setCustomDateRange({ ...customDateRange, start: text })
              }
              placeholder="YYYY-MM-DD"
            />
            <Input
              label="Đến ngày"
              value={customDateRange.end}
              onChangeText={(text) =>
                setCustomDateRange({ ...customDateRange, end: text })
              }
              placeholder="YYYY-MM-DD"
            />
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/expenses')}
          >
            <Ionicons name="receipt-outline" size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Quản lý chi phí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/disease-categories')}
          >
            <Ionicons name="medical-outline" size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Các mặt bệnh</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="cash-outline" size={24} color={colors.success} />
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(stats.revenue)}</Text>
            <Text style={styles.summaryLabel}>Doanh thu</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="receipt-outline" size={24} color={colors.warning} />
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(stats.expenses)}</Text>
            <Text style={styles.summaryLabel}>Chi phí</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trending-up-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(stats.profit)}</Text>
            <Text style={styles.summaryLabel}>Lợi nhuận</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="people-outline" size={24} color={colors.info} />
            </View>
            <Text style={styles.summaryValue}>{stats.patients}</Text>
            <Text style={styles.summaryLabel}>Bệnh nhân</Text>
          </Card>
        </View>

        {/* Revenue vs Expense */}
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Doanh thu vs Chi phí</Text>
          <View style={styles.barChart}>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.revenueBar, { height: '70%' }]}>
                <Text style={styles.barLabel}>Doanh thu</Text>
                <Text style={styles.barValue}>{formatCurrency(stats.revenue)}</Text>
              </View>
            </View>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.expenseBar, { height: '30%' }]}>
                <Text style={styles.barLabel}>Chi phí</Text>
                <Text style={styles.barValue}>{formatCurrency(stats.expenses)}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Revenue by Service */}
        <Card style={styles.revenueCard}>
          <Text style={styles.sectionTitle}>Doanh thu theo dịch vụ</Text>
          {revenueByService.map((item, index) => (
            <View key={index} style={styles.revenueItem}>
              <View style={styles.revenueItemLeft}>
                <Text style={styles.revenueServiceName}>{item.serviceName}</Text>
                <Text style={styles.revenueCount}>{item.count} lần</Text>
              </View>
              <Text style={styles.revenueAmount}>{formatCurrency(item.revenue)}</Text>
            </View>
          ))}
        </Card>
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
  expenseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  periodContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  periodButton: {
    flex: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    width: '47%',
    alignItems: 'center',
    padding: spacing.md,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  barChart: {
    flexDirection: 'row',
    height: 200,
    gap: spacing.md,
    alignItems: 'flex-end',
  },
  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  revenueBar: {
    backgroundColor: colors.success,
  },
  expenseBar: {
    backgroundColor: colors.warning,
  },
  barLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  barValue: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  revenueCard: {
    marginBottom: spacing.lg,
  },
  revenueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  revenueItemLeft: {
    flex: 1,
  },
  revenueServiceName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  revenueCount: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  revenueAmount: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  dateRangeCard: {
    marginBottom: spacing.md,
  },
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateRangeText: {
    flex: 1,
  },
  dateRangeLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dateRangeValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  customDateCard: {
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
});
