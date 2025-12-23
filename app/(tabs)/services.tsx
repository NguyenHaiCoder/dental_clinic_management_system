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
import { DentalService } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export default function ServicesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<DentalService[]>([
    {
      id: '1',
      name: 'Khám răng tổng quát',
      description: 'Khám và đánh giá tình trạng răng miệng',
      price: 200000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Lấy cao răng',
      description: 'Làm sạch cao răng và mảng bám',
      price: 300000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Trám răng',
      description: 'Trám răng sâu bằng composite',
      price: 500000,
      isActive: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Nhổ răng',
      description: 'Nhổ răng sâu, răng khôn',
      price: 400000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Tẩy trắng răng',
      description: 'Tẩy trắng răng bằng công nghệ hiện đại',
      price: 2000000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  const filteredServices = services.filter((service) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return service.name.toLowerCase().includes(query);
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dịch vụ</Text>
        <View style={styles.headerRight}>
          <Button
            title="Mặt bệnh"
            onPress={() => router.push('/disease-categories')}
            variant="outline"
            size="small"
            style={styles.diseaseButton}
          />
          <Button
            title="Thêm mới"
            onPress={() => router.push('/services/create')}
            size="small"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <Input
          placeholder="Tìm dịch vụ theo tên"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <EmptyState
            icon="medical-outline"
            title="Không có dịch vụ"
            message="Chưa có dịch vụ nào trong hệ thống."
          />
        ) : (
          <View style={styles.listContainer}>
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(`/services/${service.id}`)}
              >
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    {service.description && (
                      <Text style={styles.serviceDescription}>{service.description}</Text>
                    )}
                  </View>
                  <StatusChip
                    label={service.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                    status={service.isActive ? 'success' : 'error'}
                  />
                </View>
                <View style={styles.serviceFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Giá:</Text>
                    <Text style={styles.priceValue}>{formatCurrency(service.price)}</Text>
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
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  diseaseButton: {
    marginRight: spacing.xs,
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
  listContainer: {
    gap: spacing.sm,
  },
  serviceCard: {
    padding: spacing.md,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  serviceInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  serviceName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  serviceDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  serviceFooter: {
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
