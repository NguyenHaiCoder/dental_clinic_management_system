import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { Patient } from '../../types';
import { formatDate } from '../../utils/formatters';

export default function PatientsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data fetching
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      dateOfBirth: '1990-01-15',
      gender: 'male',
      notes: 'Bệnh nhân có tiền sử dị ứng thuốc',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
    },
    {
      id: '2',
      name: 'Trần Thị B',
      phone: '0907654321',
      email: 'tranthib@example.com',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      dateOfBirth: '1985-05-20',
      gender: 'female',
      notes: 'Bệnh nhân cần theo dõi định kỳ',
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), // 200 days ago
    },
    {
      id: '3',
      name: 'Lê Văn C',
      phone: '0912345678',
      email: 'levanc@example.com',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      dateOfBirth: '1992-08-10',
      gender: 'male',
      notes: 'Bệnh nhân mới, chưa có tiền sử',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
  ];

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.phone.includes(query) ||
      patient.email?.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bệnh nhân</Text>
        <Button
          title="Thêm mới"
          onPress={() => router.push('/patients/create')}
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
          placeholder="Tìm bệnh nhân theo tên, số điện thoại hoặc email"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="Không có dữ liệu bệnh nhân"
            message="Chưa có bệnh nhân nào trong hệ thống."
          />
        ) : (
          <View style={styles.listContainer}>
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                style={styles.patientCard}
                onPress={() => router.push(`/patients/${patient.id}`)}
              >
                <View style={styles.patientHeader}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <View style={styles.patientDetails}>
                      <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.patientDetailText}>{patient.phone}</Text>
                    </View>
                    {patient.email && (
                      <View style={styles.patientDetails}>
                        <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.patientDetailText}>{patient.email}</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>
                {patient.dateOfBirth && (
                  <View style={styles.patientFooter}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.patientFooterText}>
                      Sinh ngày: {formatDate(patient.dateOfBirth)}
                    </Text>
                  </View>
                )}
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
  searchInput: {
    marginBottom: spacing.md,
  },
  listContainer: {
    gap: spacing.sm,
  },
  patientCard: {
    padding: spacing.md,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  patientDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs / 2,
  },
  patientDetailText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  patientFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  patientFooterText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
});
