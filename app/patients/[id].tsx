import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';

export default function PatientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data - replace with actual data fetching
  const mockPatients = {
    '1': {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      dateOfBirth: '1990-01-15',
      gender: 'male' as 'male' | 'female' | 'other',
      notes: 'Bệnh nhân có tiền sử dị ứng thuốc',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
    '2': {
      id: '2',
      name: 'Trần Thị B',
      phone: '0907654321',
      email: 'tranthib@example.com',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      dateOfBirth: '1985-05-20',
      gender: 'female' as 'male' | 'female' | 'other',
      notes: 'Bệnh nhân cần theo dõi định kỳ',
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    },
    '3': {
      id: '3',
      name: 'Lê Văn C',
      phone: '0912345678',
      email: 'levanc@example.com',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      dateOfBirth: '1992-08-10',
      gender: 'male' as 'male' | 'female' | 'other',
      notes: 'Bệnh nhân mới, chưa có tiền sử',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };

  const [patient, setPatient] = useState(
    mockPatients[id as keyof typeof mockPatients] || mockPatients['1']
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patient.name,
    phone: patient.phone,
    email: patient.email || '',
    address: patient.address || '',
    dateOfBirth: patient.dateOfBirth || '',
    notes: patient.notes || '',
  });

  const handleSave = () => {
    // Save logic here
    Alert.alert('Thành công', 'Đã cập nhật thông tin bệnh nhân thành công', [
      { text: 'OK', onPress: () => setIsEditing(false) },
    ]);
  };

  const handleViewHistory = () => {
    // Navigate to patient examination history
    router.push(`/patients/${id}/history`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết bệnh nhân</Text>
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
            <Card>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Họ và tên:</Text>
                <Text style={styles.infoValue}>{patient.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số điện thoại:</Text>
                <Text style={styles.infoValue}>{patient.phone}</Text>
              </View>
              {patient.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{patient.email}</Text>
                </View>
              )}
              {patient.address && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Địa chỉ:</Text>
                  <Text style={styles.infoValue}>{patient.address}</Text>
                </View>
              )}
              {patient.dateOfBirth && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày sinh:</Text>
                  <Text style={styles.infoValue}>{formatDate(patient.dateOfBirth)}</Text>
                </View>
              )}
              {patient.notes && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ghi chú:</Text>
                  <Text style={styles.infoValue}>{patient.notes}</Text>
                </View>
              )}
            </Card>

            <Button
              title="Xem lịch sử khám bệnh"
              onPress={handleViewHistory}
              fullWidth
              style={styles.historyButton}
            />
          </>
        ) : (
          <>
            <Input
              label="Họ và tên *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Nhập họ và tên"
            />

            <Input
              label="Số điện thoại *"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Nhập email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Địa chỉ"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Nhập địa chỉ"
            />

            <Input
              label="Ngày sinh"
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              placeholder="YYYY-MM-DD"
            />

            <Input
              label="Ghi chú"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Ghi chú về bệnh nhân..."
              multiline
              numberOfLines={3}
              style={styles.notesInput}
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
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  historyButton: {
    marginTop: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});

