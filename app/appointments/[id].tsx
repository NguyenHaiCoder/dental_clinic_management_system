import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { useToast } from '../../contexts/ToastContext';
import { Appointment } from '../../types';
import { formatDate } from '../../utils/formatters';

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patient: { id: '1', name: 'Nguyễn Văn A', phone: '0901234567', createdAt: new Date().toISOString() },
    appointmentDate: new Date().toISOString(),
    content: 'Làm tiếp răng số 6, làm tiếp răng số 7',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    patientId: '2',
    patient: { id: '2', name: 'Trần Thị B', phone: '0907654321', createdAt: new Date().toISOString() },
    appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    content: 'Tái khám sau điều trị',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    patientId: '3',
    patient: { id: '3', name: 'Lê Văn C', phone: '0912345678', createdAt: new Date().toISOString() },
    appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    content: 'Kiểm tra sau niềng răng',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    patientId: '1',
    patient: { id: '1', name: 'Nguyễn Văn A', phone: '0901234567', createdAt: new Date().toISOString() },
    appointmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    content: 'Đã hoàn thành điều trị',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
];

export default function AppointmentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();

  const found = useMemo(() => mockAppointments.find((a) => a.id === id), [id]);
  const [appointment, setAppointment] = useState<Appointment | null>(found || null);
  const [rescheduleModal, setRescheduleModal] = useState<{ visible: boolean; date: string }>({
    visible: false,
    date: appointment ? formatDate(appointment.appointmentDate) : '',
  });

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Lịch hẹn</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyText}>Không tìm thấy lịch hẹn</Text>
        </View>
      </SafeAreaView>
    );
  }

  const updateStatus = (status: Appointment['status']) => {
    setAppointment((prev) => (prev ? { ...prev, status } : prev));
  };

  const handleCheckIn = () => {
    updateStatus('completed');
    showToast('Đã check-in và hoàn thành lịch hẹn', 'success');
  };

  const handleOpenReschedule = () => {
    setRescheduleModal({
      visible: true,
      date: formatDate(appointment.appointmentDate),
    });
  };

  const applyReschedule = () => {
    setAppointment((prev) =>
      prev ? { ...prev, appointmentDate: rescheduleModal.date, status: 'scheduled' } : prev
    );
    showToast('Đã cập nhật lịch hẹn', 'success');
    setRescheduleModal({ visible: false, date: '' });
  };

  const statusLabel =
    appointment.status === 'scheduled'
      ? 'Đã hẹn'
      : appointment.status === 'completed'
      ? 'Hoàn thành'
      : 'Đã hủy';

  const statusType =
    appointment.status === 'scheduled'
      ? 'info'
      : appointment.status === 'completed'
      ? 'success'
      : 'error';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết lịch hẹn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Bệnh nhân:</Text>
            <Text style={styles.value}>{appointment.patient?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>SĐT:</Text>
            <Text style={styles.value}>{appointment.patient?.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ngày hẹn:</Text>
            <Text style={styles.value}>{formatDate(appointment.appointmentDate)}</Text>
          </View>
          {appointment.content ? (
            <View style={styles.row}>
              <Text style={styles.label}>Nội dung:</Text>
              <Text style={[styles.value, styles.wrap]}>{appointment.content}</Text>
            </View>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.label}>Trạng thái:</Text>
            <StatusChip label={statusLabel} status={statusType as any} />
          </View>
        </Card>

        {appointment.status === 'scheduled' && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.leaveButton} onPress={handleOpenReschedule}>
              <Ionicons name="calendar-outline" size={18} color={colors.error} />
              <Text style={styles.leaveButtonText}>Rời lịch hẹn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkinButton} onPress={handleCheckIn}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.cardBackground} />
              <Text style={styles.checkinButtonText}>Check-in</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={rescheduleModal.visible}
        transparent
        animationType="slide"
        onRequestClose={() => setRescheduleModal({ visible: false, date: '' })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rời lịch hẹn</Text>
              <TouchableOpacity onPress={() => setRescheduleModal({ visible: false, date: '' })}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Ngày mới (dd-mm-yyyy)</Text>
              <TextInput
                style={styles.modalInput}
                value={rescheduleModal.date}
                onChangeText={(text) => setRescheduleModal((p) => ({ ...p, date: text }))}
                placeholder="dd-mm-yyyy"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setRescheduleModal({ visible: false, date: '' })}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSave} onPress={applyReschedule}>
                  <Text style={styles.modalSaveText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.title.mobile,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  content: {
    padding: layout.screenPadding.mobile,
    paddingBottom: spacing.xl,
  },
  infoCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.medium,
  },
  value: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semiBold,
  },
  wrap: {
    flexShrink: 1,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  leaveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: `${colors.error}10`,
  },
  leaveButtonText: {
    color: colors.error,
    fontFamily: typography.fontFamily.semiBold,
  },
  checkinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.success,
  },
  checkinButtonText: {
    color: colors.cardBackground,
    fontFamily: typography.fontFamily.semiBold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyText: {
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
  },
  modalBody: {
    gap: spacing.sm,
  },
  modalLabel: {
    color: colors.textSecondary,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  modalCancel: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    color: colors.textPrimary,
  },
  modalSave: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  modalSaveText: {
    color: colors.cardBackground,
    fontFamily: typography.fontFamily.semiBold,
  },
});

