import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { borderRadius, colors, layout, shadows, spacing, typography } from '../../constants/theme';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, getTodayDate } from '../../utils/formatters';

interface TreatmentService {
  id: string;
  serviceName: string;
  price: number;
}

export default function CreateExaminationScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    patientId: '',
    date: getTodayDate(),
    relative: '', // Người thân
    symptoms: '', // Triệu chứng và chẩn đoán
    treatmentServices: [] as TreatmentService[],
    selectedDentistIds: [] as string[], // Có thể chọn nhiều bác sĩ
    paidAmount: 0,
    followUpDates: [] as string[], // Lịch tái khám
    followUpContent: '', // Nội dung tái khám (nội bộ)
    customerSignature: '', // Chữ ký khách hàng
    dentistSignature: '', // Chữ ký bác sĩ
  });
  
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [showAddDentistModal, setShowAddDentistModal] = useState(false);
  const [showEditDentistModal, setShowEditDentistModal] = useState(false);
  const [editingDentistId, setEditingDentistId] = useState<string | null>(null);
  const [newDentistForm, setNewDentistForm] = useState({ name: '' });
  const [showDentistActions, setShowDentistActions] = useState(false);

  // Mock data
  const allPatients = [
    { id: '1', name: 'Nguyễn Văn A', phone: '0901234567' },
    { id: '2', name: 'Trần Thị B', phone: '0907654321' },
    { id: '3', name: 'Lê Văn C', phone: '0912345678' },
  ];

  const [dentists, setDentists] = useState([
    { id: '1', name: 'BS. Tuyết' },
    { id: '2', name: 'BS. Phương' },
    { id: '3', name: 'BS. Bình' },
  ]);

  // Filter patients by search query
  const filteredPatients = allPatients.filter((patient) => {
    if (!patientSearchQuery.trim()) return false;
    const query = patientSearchQuery.trim().toLowerCase();
    const nameMatch = patient.name.toLowerCase().includes(query);
    const phoneMatch = patient.phone.includes(query);
    const isNumericQuery = /^\d+$/.test(query);
    let phoneLast3Match = false;
    if (isNumericQuery && query.length <= 3) {
      const phoneLast3 = patient.phone.slice(-3);
      phoneLast3Match = phoneLast3 === query || phoneLast3.includes(query);
    }
    return nameMatch || phoneMatch || phoneLast3Match;
  });

  const selectedPatient = allPatients.find((p) => p.id === formData.patientId);

  // Calculate total cost
  const totalCost = formData.treatmentServices.reduce((sum, service) => sum + (service.price || 0), 0);
  const debt = Math.max(0, totalCost - formData.paidAmount);

  // Handle add new service row
  const handleAddServiceRow = () => {
    const newService: TreatmentService = {
      id: `service-${Date.now()}`,
      serviceName: '',
      price: 0,
    };
    setFormData((prev) => ({
      ...prev,
      treatmentServices: [...prev.treatmentServices, newService],
    }));
  };

  // Handle update service
  const handleUpdateService = (serviceId: string, field: 'serviceName' | 'price', value: string) => {
    setFormData((prev) => ({
      ...prev,
      treatmentServices: prev.treatmentServices.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              [field]: field === 'price' ? parseFloat(value) || 0 : value,
            }
          : s
      ),
    }));
  };

  // Handle delete service
  const handleDeleteService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      treatmentServices: prev.treatmentServices.filter((s) => s.id !== serviceId),
    }));
  };

  // Handle toggle dentist selection
  const handleToggleDentist = (dentistId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedDentistIds.includes(dentistId);
      return {
        ...prev,
        selectedDentistIds: isSelected
          ? prev.selectedDentistIds.filter((id) => id !== dentistId)
          : [...prev.selectedDentistIds, dentistId],
      };
    });
  };

  const handleAddFollowUpDate = () => {
    // Add empty date string, user will input manually
    setFormData((prev) => ({
      ...prev,
      followUpDates: [...prev.followUpDates, ''],
    }));
  };

  const handleUpdateFollowUpDate = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      followUpDates: prev.followUpDates.map((date, i) => (i === index ? value : date)),
    }));
  };

  const handleAddDentist = () => {
    if (!newDentistForm.name.trim()) {
      showToast('Vui lòng nhập tên bác sĩ', 'error');
      return;
    }

    const newDentist = {
      id: `dentist-${Date.now()}`,
      name: newDentistForm.name.trim(),
    };
    setDentists((prev) => [...prev, newDentist]);
    setNewDentistForm({ name: '' });
    setShowAddDentistModal(false);
    showToast('Đã thêm bác sĩ mới', 'success');
  };

  const handleEditDentist = (dentistId: string) => {
    const dentist = dentists.find((d) => d.id === dentistId);
    if (dentist) {
      setEditingDentistId(dentistId);
      setNewDentistForm({ name: dentist.name });
      setShowEditDentistModal(true);
    }
  };

  const handleUpdateDentist = () => {
    if (!newDentistForm.name.trim()) {
      showToast('Vui lòng nhập tên bác sĩ', 'error');
      return;
    }

    if (editingDentistId) {
      setDentists((prev) =>
        prev.map((d) => (d.id === editingDentistId ? { ...d, name: newDentistForm.name.trim() } : d))
      );
      setNewDentistForm({ name: '' });
      setEditingDentistId(null);
      setShowEditDentistModal(false);
      showToast('Đã cập nhật bác sĩ', 'success');
    }
  };

  const handleDeleteDentist = (dentistId: string) => {
    // Kiểm tra xem bác sĩ có đang được chọn không
    if (formData.selectedDentistIds.includes(dentistId)) {
      // Bỏ chọn bác sĩ trước khi xóa
      setFormData((prev) => ({
        ...prev,
        selectedDentistIds: prev.selectedDentistIds.filter((id) => id !== dentistId),
      }));
    }
    setDentists((prev) => prev.filter((d) => d.id !== dentistId));
    showToast('Đã xóa bác sĩ', 'success');
  };

  const handleRemoveFollowUpDate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      followUpDates: prev.followUpDates.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!formData.patientId) {
      showToast('Vui lòng chọn bệnh nhân', 'error');
      return;
    }

    if (formData.treatmentServices.length === 0) {
      showToast('Vui lòng thêm ít nhất một dịch vụ điều trị', 'error');
      return;
    }

    // Save logic here
    showToast('Đã tạo khám bệnh thành công', 'success');
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Tạo hồ sơ khám chữa bệnh</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Selection */}
        <Card>
          <Text style={styles.sectionTitle}>I. Thông tin bệnh nhân *</Text>
          <Input
            value={patientSearchQuery}
            onChangeText={setPatientSearchQuery}
            placeholder="Tìm kiếm theo tên hoặc 3 số cuối SĐT"
            leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
          />
          
          {patientSearchQuery.trim() && filteredPatients.length > 0 && (
            <View style={styles.patientList}>
              {filteredPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={[
                    styles.patientItem,
                    formData.patientId === patient.id && styles.patientItemSelected,
                  ]}
                  onPress={() => {
                    setFormData((prev) => ({ ...prev, patientId: patient.id }));
                    setPatientSearchQuery('');
                  }}
                >
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientPhone}>{patient.phone}</Text>
                  </View>
                  {formData.patientId === patient.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedPatient && (
            <View style={styles.selectedPatient}>
              <Text style={styles.selectedPatientText}>
                Đã chọn: {selectedPatient.name} - {selectedPatient.phone}
              </Text>
            </View>
          )}

          <Input
            label="Người thân"
            value={formData.relative}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, relative: text }))}
            placeholder="Con-0341231231"
            style={styles.relativeInput}
          />
        </Card>

        {/* Symptoms and Diagnosis */}
        <Card>
          <Text style={styles.sectionTitle}>II. Triệu chứng và chẩn đoán</Text>
          <TextInput
            style={styles.textArea}
            value={formData.symptoms}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, symptoms: text }))}
            placeholder="Bác sĩ tự ghi triệu chứng và chẩn đoán..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </Card>

        {/* Treatment Plan */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>III. Kế hoạch điều trị (kèm giá tiền)</Text>
            <TouchableOpacity onPress={handleAddServiceRow} style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Thêm dòng</Text>
            </TouchableOpacity>
          </View>

          {formData.treatmentServices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyText}>Chưa có dịch vụ nào</Text>
            </View>
          ) : (
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableHeaderText, { width: '10%' }]}>
                  STT
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { width: '50%' }]}>
                  Dịch vụ
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { width: '30%' }]}>
                  Giá tiền
                </Text>
                <View style={{ width: '10%' }} />
              </View>

              {/* Table Rows with Inputs */}
              {formData.treatmentServices.map((service, index) => (
                <View key={service.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellSTT, { width: '10%' }]}>
                    {index + 1}
                  </Text>
                  <View style={[styles.tableCellInput, { width: '50%' }]}>
                    <TextInput
                      style={styles.serviceInput}
                      value={service.serviceName}
                      onChangeText={(text) =>
                        handleUpdateService(service.id, 'serviceName', text)
                      }
                      placeholder="Nhập tên dịch vụ"
                      multiline
                    />
                  </View>
                  <View style={[styles.tableCellInput, { width: '30%' }]}>
                    <TextInput
                      style={styles.priceInput}
                      value={service.price > 0 ? service.price.toString() : ''}
                      onChangeText={(text) => handleUpdateService(service.id, 'price', text)}
                      placeholder="Giá tiền"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.tableCellActions, { width: '10%' }]}>
                    <TouchableOpacity
                      onPress={() => handleDeleteService(service.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash" size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Dentist Selection - Below the table */}
          {formData.treatmentServices.length > 0 && (
            <View style={styles.dentistSelectionContainer}>
              <View style={styles.dentistSelectionHeader}>
                <TouchableOpacity
                  style={styles.dentistLabelContainer}
                  onPress={() => setShowDentistActions(!showDentistActions)}
                >
                  <Text style={styles.dentistSelectionLabel}>Chọn bác sĩ (có thể chọn nhiều):</Text>
                  <Ionicons
                    name={showDentistActions ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                {showDentistActions && (
                  <TouchableOpacity
                    style={styles.addDentistHeaderButton}
                    onPress={() => {
                      setEditingDentistId(null);
                      setNewDentistForm({ name: '' });
                      setShowAddDentistModal(true);
                    }}
                  >
                    <Ionicons name="add-circle" size={20} color={colors.primary} />
                    <Text style={styles.addDentistHeaderText}>Thêm</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.dentistSelectionList}>
                {dentists.map((dentist) => {
                  const isSelected = formData.selectedDentistIds.includes(dentist.id);
                  return (
                    <View key={dentist.id} style={styles.dentistChipContainer}>
                      <TouchableOpacity
                        style={[
                          styles.dentistChip,
                          isSelected && styles.dentistChipSelected,
                        ]}
                        onPress={() => handleToggleDentist(dentist.id)}
                      >
                        <Text
                          style={[
                            styles.dentistChipText,
                            isSelected && styles.dentistChipTextSelected,
                          ]}
                        >
                          {dentist.name}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark" size={16} color={colors.cardBackground} />
                        )}
                      </TouchableOpacity>
                      {showDentistActions && (
                        <View style={styles.dentistActions}>
                          <TouchableOpacity
                            onPress={() => handleEditDentist(dentist.id)}
                            style={styles.dentistActionButton}
                          >
                            <Ionicons name="pencil" size={16} color={colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteDentist(dentist.id)}
                            style={styles.dentistActionButton}
                          >
                            <Ionicons name="trash" size={16} color={colors.error} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </Card>

        {/* Payment Summary */}
        <Card>
          <Text style={styles.paymentTitle}>Thanh toán</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Thành tiền:</Text>
            <Text style={styles.paymentValue}>{formatCurrency(totalCost)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Thanh toán:</Text>
            <View style={styles.paymentInputContainer}>
              <TextInput
                value={formData.paidAmount > 0 ? formData.paidAmount.toString() : ''}
                onChangeText={(text) => {
                  const amount = parseFloat(text) || 0;
                  setFormData((prev) => ({ ...prev, paidAmount: amount }));
                }}
                placeholder="0"
                keyboardType="numeric"
                style={styles.paymentInput}
              />
            </View>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Còn nợ:</Text>
            <Text
              style={[
                styles.paymentValue,
                { color: debt > 0 ? colors.error : colors.success },
              ]}
            >
              {formatCurrency(debt)}
            </Text>
          </View>
          {totalCost > 0 && formData.paidAmount >= totalCost && (
            <View style={styles.paymentNote}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.paymentNoteText}>Đã thanh toán đủ</Text>
            </View>
          )}
        </Card>

        {/* Optional: Image Selection */}
        <Card>
          <Text style={styles.sectionTitle}>(Optional) Chọn ảnh</Text>
          <Text style={styles.optionalNote}>
            Chọn tất cả ảnh, không cần trước sau
          </Text>
          <TouchableOpacity style={styles.imageButton}>
            <Ionicons name="image-outline" size={24} color={colors.primary} />
            <Text style={styles.imageButtonText}>Chọn ảnh</Text>
          </TouchableOpacity>
        </Card>

        {/* Follow-up Schedule */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lịch tái khám</Text>
            <TouchableOpacity onPress={handleAddFollowUpDate} style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Thêm ngày</Text>
            </TouchableOpacity>
          </View>
          {formData.followUpDates.length > 0 && (
            <View style={styles.followUpDatesList}>
              {formData.followUpDates.map((date, index) => (
                <View key={index} style={styles.followUpDateItem}>
                  <TextInput
                    style={styles.followUpDateInput}
                    value={date}
                    onChangeText={(text) => handleUpdateFollowUpDate(index, text)}
                    placeholder="dd-mm-yyyy"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveFollowUpDate(index)}
                    style={styles.followUpDateActionButton}
                  >
                    <Ionicons name="trash" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Follow-up Content (Internal) */}
        <Card>
          <Text style={styles.sectionTitle}>Nội dung tái khám</Text>
          <Text style={styles.internalNote}>(Nội bộ xem, không in cho khách)</Text>
          <TextInput
            style={styles.textArea}
            value={formData.followUpContent}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, followUpContent: text }))}
            placeholder="Ví dụ: Làm tiếp răng số 6, làm tiếp răng số 7..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        {/* Signatures */}
        <Card>
          <Text style={styles.sectionTitle}>Chữ ký</Text>
          <View style={styles.signatureContainer}>
            <View style={styles.signatureItem}>
              <Text style={styles.signatureLabel}>Khách hàng (kí tên)</Text>
              <TextInput
                style={styles.signatureInput}
                value={formData.customerSignature}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, customerSignature: text }))
                }
                placeholder="Chữ ký khách hàng"
              />
            </View>
            <View style={styles.signatureItem}>
              <Text style={styles.signatureLabel}>Bác sĩ (kí tên)</Text>
              <TextInput
                style={styles.signatureInput}
                value={formData.dentistSignature}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, dentistSignature: text }))
                }
                placeholder="Chữ ký bác sĩ"
              />
            </View>
          </View>
        </Card>

        {/* Save Button */}
        <Button
          title="Lưu hồ sơ khám chữa bệnh"
          onPress={handleSave}
          fullWidth
          style={styles.saveButton}
        />
      </ScrollView>

      {/* Add Dentist Modal */}
      <Modal
        visible={showAddDentistModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowAddDentistModal(false);
          setNewDentistForm({ name: '' });
          setEditingDentistId(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm bác sĩ mới</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddDentistModal(false);
                  setNewDentistForm({ name: '' });
                  setEditingDentistId(null);
                }}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Input
                label="Tên bác sĩ *"
                value={newDentistForm.name}
                onChangeText={(text) => setNewDentistForm({ name: text })}
                placeholder="Ví dụ: BS. Nguyễn Văn A"
              />

              <Button
                title="Thêm bác sĩ"
                onPress={handleAddDentist}
                fullWidth
                style={styles.modalButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Dentist Modal */}
      <Modal
        visible={showEditDentistModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowEditDentistModal(false);
          setNewDentistForm({ name: '' });
          setEditingDentistId(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa bác sĩ</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEditDentistModal(false);
                  setNewDentistForm({ name: '' });
                  setEditingDentistId(null);
                }}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Input
                label="Tên bác sĩ *"
                value={newDentistForm.name}
                onChangeText={(text) => setNewDentistForm({ name: text })}
                placeholder="Ví dụ: BS. Nguyễn Văn A"
              />

              <Button
                title="Cập nhật"
                onPress={handleUpdateDentist}
                fullWidth
                style={styles.modalButton}
              />
            </ScrollView>
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
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  patientList: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  patientItemSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
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
  patientPhone: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  relativeInput: {
    marginTop: spacing.md,
  },
  selectedPatient: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: `${colors.primary}10`,
    borderRadius: borderRadius.md,
  },
  selectedPatientText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  textArea: {
    minHeight: 120,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.tableHeader,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tableHeaderText: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xs,
  },
  tableCellSTT: {
    textAlign: 'center',
  },
  tableCellInput: {
    paddingHorizontal: spacing.xs,
  },
  serviceInput: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    minHeight: 36,
  },
  priceInput: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    textAlign: 'right',
    minHeight: 36,
  },
  tableCellActions: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dentistSelectionContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  dentistSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dentistLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  dentistSelectionLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  addDentistHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.primary}10`,
  },
  addDentistHeaderText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  addDentistButton: {
    padding: spacing.xs,
  },
  dentistChipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dentistActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dentistActionButton: {
    padding: spacing.xs,
  },
  addDentistChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: `${colors.primary}10`,
    minWidth: 50,
  },
  dentistSelectionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dentistChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  dentistChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dentistChipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  dentistChipTextSelected: {
    color: colors.cardBackground,
  },
  actionButton: {
    padding: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
  paymentTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  paymentLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  paymentValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
  },
  paymentInputContainer: {
    width: 150,
  },
  paymentInput: {
    textAlign: 'right',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    minHeight: 40,
  },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  paymentNoteText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.success,
  },
  optionalNote: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.cardBackground,
  },
  imageButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  followUpDatesList: {
    gap: spacing.sm,
  },
  followUpDateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  followUpDateItemEditing: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}05`,
  },
  followUpDateText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    flex: 1,
  },
  followUpDateInput: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    marginRight: spacing.sm,
    minHeight: 40,
  },
  followUpDateActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  followUpDateActionButton: {
    padding: spacing.xs,
  },
  internalNote: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  signatureContainer: {
    gap: spacing.md,
  },
  signatureItem: {
    gap: spacing.xs,
  },
  signatureLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  signatureInput: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  modalBody: {
    maxHeight: 400,
    padding: spacing.lg,
  },
  modalButton: {
    marginTop: spacing.md,
  },
});
