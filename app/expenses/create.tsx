import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { getTodayDate } from '../../utils/formatters';

export default function CreateExpenseScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: getTodayDate(),
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const expenseCategories = [
    'Vật tư',
    'Tiện ích',
    'Nhân sự',
    'Thuê mặt bằng',
    'Marketing',
    'Khác',
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Vui lòng nhập số tiền';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Số tiền phải là số dương';
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    // Save logic here
    Alert.alert('Thành công', 'Đã ghi nhận chi phí thành công', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Ghi nhận chi phí</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Input
          label="Mô tả *"
          value={formData.description}
          onChangeText={(text) => {
            setFormData({ ...formData, description: text });
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          placeholder="Ví dụ: Mua vật tư y tế, Tiền điện..."
          error={errors.description}
        />

        <Input
          label="Số tiền (₫) *"
          value={formData.amount}
          onChangeText={(text) => {
            setFormData({ ...formData, amount: text });
            if (errors.amount) setErrors({ ...errors, amount: '' });
          }}
          placeholder="Nhập số tiền"
          keyboardType="numeric"
          error={errors.amount}
        />

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Danh mục *</Text>
          <View style={styles.categoryGrid}>
            {expenseCategories.map((category) => {
              const isSelected = formData.category === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    isSelected && styles.categoryOptionSelected,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, category });
                    if (errors.category) setErrors({ ...errors, category: '' });
                  }}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      isSelected && styles.categoryOptionTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        <Input
          label="Ngày"
          value={formData.date}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
          placeholder="YYYY-MM-DD"
        />

        <Button
          title="Lưu chi phí"
          onPress={handleSave}
          fullWidth
          style={styles.saveButton}
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
  categoryContainer: {
    marginBottom: spacing.md,
  },
  categoryLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  categoryOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  categoryOptionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  categoryOptionTextSelected: {
    color: colors.primary,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.error,
    marginTop: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});

