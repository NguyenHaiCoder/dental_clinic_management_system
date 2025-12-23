import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ExpensesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data fetching
  const expenses: Expense[] = [
    {
      id: '1',
      description: 'Mua vật tư y tế',
      amount: 5000000,
      category: 'Vật tư',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      description: 'Tiền điện tháng 12',
      amount: 2000000,
      category: 'Tiện ích',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      description: 'Lương nhân viên',
      amount: 15000000,
      category: 'Nhân sự',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  const filteredExpenses = expenses.filter((expense) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      expense.description.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query)
    );
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi phí</Text>
        <Button
          title="Thêm mới"
          onPress={() => router.push('/expenses/create')}
          size="small"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Ionicons name="receipt-outline" size={24} color={colors.warning} />
            <View style={styles.summaryText}>
              <Text style={styles.summaryValue}>{formatCurrency(totalExpenses)}</Text>
              <Text style={styles.summaryLabel}>Tổng chi phí</Text>
            </View>
          </View>
        </Card>

        {/* Search */}
        <Input
          placeholder="Tìm chi phí theo mô tả hoặc danh mục"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="Không có chi phí"
            message="Chưa có chi phí nào trong hệ thống."
          />
        ) : (
          <View style={styles.listContainer}>
            {filteredExpenses.map((expense) => (
              <Card key={expense.id} style={styles.expenseCard}>
                <View style={styles.expenseHeader}>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <View style={styles.expenseMeta}>
                      <View style={styles.expenseCategory}>
                        <Ionicons name="pricetag-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.expenseCategoryText}>{expense.category}</Text>
                      </View>
                      <View style={styles.expenseDate}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.expenseDateText}>{formatDate(expense.date)}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding.mobile,
    paddingBottom: spacing.xl,
  },
  summaryCard: {
    marginBottom: spacing.md,
    backgroundColor: `${colors.warning}10`,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryText: {
    flex: 1,
  },
  summaryValue: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  listContainer: {
    gap: spacing.sm,
  },
  expenseCard: {
    padding: spacing.md,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expenseInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  expenseDescription: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  expenseMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  expenseCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  expenseCategoryText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  expenseDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  expenseDateText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  expenseAmount: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.warning,
  },
});

