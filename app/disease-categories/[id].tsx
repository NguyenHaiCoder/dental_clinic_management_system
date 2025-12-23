import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';

export default function DiseaseCategoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data - replace with actual data fetching
  const [category, setCategory] = useState({
    id: id as string,
    name: 'Sâu răng',
    description: 'Điều trị sâu răng',
    price: 300000,
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || '',
    price: category.price.toString(),
  });

  const handleSave = () => {
    // Save logic here
    Alert.alert('Thành công', 'Đã cập nhật mặt bệnh thành công', [
      { text: 'OK', onPress: () => setIsEditing(false) },
    ]);
  };

  const handleToggleActive = () => {
    Alert.alert(
      category.isActive ? 'Ngừng hoạt động' : 'Kích hoạt',
      `Bạn có chắc chắn muốn ${category.isActive ? 'ngừng hoạt động' : 'kích hoạt'} mặt bệnh này?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            setCategory({ ...category, isActive: !category.isActive });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết mặt bệnh</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <Ionicons
            name={isEditing ? 'close' : 'pencil'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isEditing ? (
          <>
            <View style={styles.statusContainer}>
              <StatusChip
                label={category.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                status={category.isActive ? 'success' : 'error'}
              />
            </View>

            <Card>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tên mặt bệnh:</Text>
                <Text style={styles.infoValue}>{category.name}</Text>
              </View>
              {category.description && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mô tả:</Text>
                  <Text style={styles.infoValue}>{category.description}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Giá:</Text>
                <Text style={styles.infoValue}>{formatCurrency(category.price)}</Text>
              </View>
            </Card>

            <Button
              title={category.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
              onPress={handleToggleActive}
              variant={category.isActive ? 'destructive' : 'primary'}
              fullWidth
              style={styles.toggleButton}
            />
          </>
        ) : (
          <>
            <Input
              label="Tên mặt bệnh *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Ví dụ: Sâu răng, Viêm nướu..."
            />

            <Input
              label="Mô tả"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Mô tả về mặt bệnh..."
              multiline
              numberOfLines={3}
              style={styles.descriptionInput}
            />

            <Input
              label="Giá (₫) *"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="Nhập giá tiền"
              keyboardType="numeric"
            />

            <Button
              title="Lưu thay đổi"
              onPress={handleSave}
              fullWidth
              style={styles.saveButton}
            />
          </>
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
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggleButton: {
    marginTop: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});

