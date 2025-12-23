import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { DiseaseCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export default function DiseaseCategoriesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [diseaseCategories, setDiseaseCategories] = useState<DiseaseCategory[]>([
    {
      id: '1',
      name: 'Sâu răng',
      description: 'Điều trị sâu răng',
      price: 300000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Viêm nướu',
      description: 'Điều trị viêm nướu',
      price: 250000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Răng khôn',
      description: 'Nhổ răng khôn',
      price: 1500000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Viêm tủy răng',
      description: 'Điều trị viêm tủy răng',
      price: 800000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Nứt răng',
      description: 'Điều trị răng bị nứt',
      price: 600000,
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const filteredCategories = diseaseCategories.filter((category) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.description?.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Các mặt bệnh</Text>
        <Button
          title="Thêm mới"
          onPress={() => router.push('/disease-categories/create')}
          size="small"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <Input
          placeholder="Tìm mặt bệnh theo tên"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />

        {/* Disease Categories List */}
        {filteredCategories.length === 0 ? (
          <EmptyState
            icon="medical-outline"
            title="Không có mặt bệnh"
            message="Chưa có mặt bệnh nào trong hệ thống."
          />
        ) : (
          <View style={styles.listContainer}>
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push(`/disease-categories/${category.id}`)}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    {category.description && (
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                    )}
                  </View>
                  <StatusChip
                    label={category.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                    status={category.isActive ? 'success' : 'error'}
                  />
                </View>
                <View style={styles.categoryFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Giá:</Text>
                    <Text style={styles.priceValue}>{formatCurrency(category.price)}</Text>
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
  searchInput: {
    marginBottom: spacing.md,
  },
  listContainer: {
    gap: spacing.sm,
  },
  categoryCard: {
    padding: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  categoryInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  priceLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
});

