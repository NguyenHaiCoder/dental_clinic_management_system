import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import { formatCurrency, formatDate, getTodayDate } from '../../utils/formatters';

interface CustomService {
  id: string;
  name: string;
  price: number;
  isCustom: true;
}

interface CustomDisease {
  id: string;
  name: string;
  price: number;
  isCustom: true;
}

export default function CreateExaminationScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    date: getTodayDate(),
    services: [] as string[],
    diseases: [] as string[],
    medicalNotes: '',
    dentistName: '',
  });
  const [totalCost, setTotalCost] = useState(0);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [showCustomServiceModal, setShowCustomServiceModal] = useState(false);
  const [showCustomDiseaseModal, setShowCustomDiseaseModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingDiseaseId, setEditingDiseaseId] = useState<string | null>(null);
  const [customServiceForm, setCustomServiceForm] = useState({ name: '', price: '' });
  const [customDiseaseForm, setCustomDiseaseForm] = useState({ name: '', price: '' });
  
  // Refs for auto focus
  const serviceNameInputRef = useRef<TextInput>(null);
  const diseaseNameInputRef = useRef<TextInput>(null);
  
  // Auto focus when modal opens
  useEffect(() => {
    if (showCustomServiceModal && serviceNameInputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        serviceNameInputRef.current?.focus();
      }, 100);
    }
  }, [showCustomServiceModal]);
  
  useEffect(() => {
    if (showCustomDiseaseModal && diseaseNameInputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        diseaseNameInputRef.current?.focus();
      }, 100);
    }
  }, [showCustomDiseaseModal]);

  // Mock data - replace with actual data fetching
  const allPatients = [
    { id: '1', name: 'Nguyễn Văn A', phone: '0901234567' },
    { id: '2', name: 'Trần Thị B', phone: '0907654321' },
    { id: '3', name: 'Lê Văn C', phone: '0912345678' },
  ];

  const baseServices = [
    { id: '1', name: 'Khám răng tổng quát', price: 200000, isCustom: false },
    { id: '2', name: 'Lấy cao răng', price: 300000, isCustom: false },
    { id: '3', name: 'Trám răng', price: 500000, isCustom: false },
    { id: '4', name: 'Nhổ răng', price: 400000, isCustom: false },
    { id: '5', name: 'Tẩy trắng răng', price: 2000000, isCustom: false },
  ];

  const baseDiseaseCategories = [
    { id: '1', name: 'Sâu răng', price: 300000, isCustom: false },
    { id: '2', name: 'Viêm nướu', price: 250000, isCustom: false },
    { id: '3', name: 'Răng khôn', price: 1500000, isCustom: false },
    { id: '4', name: 'Viêm tủy răng', price: 800000, isCustom: false },
    { id: '5', name: 'Nứt răng', price: 600000, isCustom: false },
  ];

  const [customServices, setCustomServices] = useState<CustomService[]>([]);
  const [customDiseases, setCustomDiseases] = useState<CustomDisease[]>([]);

  const allServices = [...baseServices, ...customServices];
  const allDiseases = [...baseDiseaseCategories, ...customDiseases];

  // Filter patients by name or last 3 digits of phone
  const filteredPatients = allPatients.filter((patient) => {
    if (!patientSearchQuery) return true;
    const query = patientSearchQuery.trim();
    const isNumericQuery = /^\d+$/.test(query);
    const nameMatch = patient.name.toLowerCase().includes(query.toLowerCase());
    
    let phoneMatch = false;
    if (isNumericQuery && query.length <= 3) {
      // If query is numeric and length <= 3, ONLY check last 3 digits (exact match or substring)
      const phoneLast3 = patient.phone.slice(-3);
      phoneMatch = phoneLast3 === query || phoneLast3.includes(query);
    } else if (isNumericQuery && query.length > 3) {
      // If query is numeric and length > 3, check full phone number
      phoneMatch = patient.phone.includes(query);
    } else {
      // If query is not numeric, check name only (don't search in phone)
      phoneMatch = false;
    }
    
    return nameMatch || phoneMatch;
  });

  const selectedPatient = allPatients.find((p) => p.id === formData.patientId);

  const calculateTotal = (
    selectedServices: string[],
    selectedDiseases: string[],
    additionalService?: CustomService,
    additionalDisease?: CustomDisease
  ) => {
    // Include additional service/disease if provided (for newly created items)
    const servicesToCheck = additionalService
      ? [...allServices, additionalService]
      : allServices;
    const diseasesToCheck = additionalDisease
      ? [...allDiseases, additionalDisease]
      : allDiseases;

    const servicesTotal = selectedServices.reduce((sum, id) => {
      const s = servicesToCheck.find((sv) => sv.id === id);
      return sum + (s?.price || 0);
    }, 0);
    const diseasesTotal = selectedDiseases.reduce((sum, id) => {
      const d = diseasesToCheck.find((dc) => dc.id === id);
      return sum + (d?.price || 0);
    }, 0);
    return servicesTotal + diseasesTotal;
  };

  const handleServiceToggle = (serviceId: string, additionalService?: CustomService) => {
    setFormData((prev) => {
      const newServices = prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];

      const total = calculateTotal(newServices, prev.diseases, additionalService);
      setTotalCost(total);

      return { ...prev, services: newServices };
    });
  };

  const handleDiseaseToggle = (diseaseId: string, additionalDisease?: CustomDisease) => {
    setFormData((prev) => {
      const newDiseases = prev.diseases.includes(diseaseId)
        ? prev.diseases.filter((id) => id !== diseaseId)
        : [...prev.diseases, diseaseId];

      const total = calculateTotal(prev.services, newDiseases, undefined, additionalDisease);
      setTotalCost(total);

      return { ...prev, diseases: newDiseases };
    });
  };

  const handleAddCustomService = () => {
    if (!customServiceForm.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên dịch vụ');
      return;
    }
    if (!customServiceForm.price.trim() || parseFloat(customServiceForm.price) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá hợp lệ');
      return;
    }

    if (editingServiceId) {
      // Update existing custom service
      const updatedService = {
        id: editingServiceId,
        name: customServiceForm.name,
        price: parseFloat(customServiceForm.price),
        isCustom: true as const,
      };
      setCustomServices(
        customServices.map((s) =>
          s.id === editingServiceId ? updatedService : s
        )
      );
      // Recalculate total if this service is currently selected
      if (formData.services.includes(editingServiceId)) {
        setFormData((prev) => {
          const total = calculateTotal(prev.services, prev.diseases);
          setTotalCost(total);
          return prev;
        });
      }
      setEditingServiceId(null);
    } else {
      // Create new custom service
      const newService: CustomService = {
        id: `custom-${Date.now()}`,
        name: customServiceForm.name,
        price: parseFloat(customServiceForm.price),
        isCustom: true,
      };
      setCustomServices([...customServices, newService]);
      // Auto-select the new service and calculate total with the new service
      handleServiceToggle(newService.id, newService);
    }

    setCustomServiceForm({ name: '', price: '' });
    setShowCustomServiceModal(false);
    // Note: totalCost is automatically updated by handleServiceToggle
  };

  const handleAddCustomDisease = () => {
    if (!customDiseaseForm.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên mặt bệnh');
      return;
    }
    if (!customDiseaseForm.price.trim() || parseFloat(customDiseaseForm.price) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá hợp lệ');
      return;
    }

    if (editingDiseaseId) {
      // Update existing custom disease
      const updatedDisease = {
        id: editingDiseaseId,
        name: customDiseaseForm.name,
        price: parseFloat(customDiseaseForm.price),
        isCustom: true as const,
      };
      setCustomDiseases(
        customDiseases.map((d) =>
          d.id === editingDiseaseId ? updatedDisease : d
        )
      );
      // Recalculate total if this disease is currently selected
      if (formData.diseases.includes(editingDiseaseId)) {
        setFormData((prev) => {
          const total = calculateTotal(prev.services, prev.diseases);
          setTotalCost(total);
          return prev;
        });
      }
      setEditingDiseaseId(null);
    } else {
      // Create new custom disease
      const newDisease: CustomDisease = {
        id: `custom-${Date.now()}`,
        name: customDiseaseForm.name,
        price: parseFloat(customDiseaseForm.price),
        isCustom: true,
      };
      setCustomDiseases([...customDiseases, newDisease]);
      // Auto-select the new disease and calculate total with the new disease
      handleDiseaseToggle(newDisease.id, newDisease);
    }

    setCustomDiseaseForm({ name: '', price: '' });
    setShowCustomDiseaseModal(false);
    // Note: totalCost is automatically updated by handleDiseaseToggle above
  };

  const handleEditCustomService = (serviceId: string) => {
    const service = customServices.find((s) => s.id === serviceId);
    if (service) {
      setCustomServiceForm({ name: service.name, price: service.price.toString() });
      setEditingServiceId(serviceId);
      setShowCustomServiceModal(true);
    }
  };

  const handleEditCustomDisease = (diseaseId: string) => {
    const disease = customDiseases.find((d) => d.id === diseaseId);
    if (disease) {
      setCustomDiseaseForm({ name: disease.name, price: disease.price.toString() });
      setEditingDiseaseId(diseaseId);
      setShowCustomDiseaseModal(true);
    }
  };

  const handleSetToday = () => {
    setFormData({ ...formData, date: getTodayDate() });
  };

  const handleSave = () => {
    if (!formData.patientId) {
      Alert.alert('Lỗi', 'Vui lòng chọn bệnh nhân');
      return;
    }

    if (formData.services.length === 0 && formData.diseases.length === 0) {
      Alert.alert(
        'Lỗi',
        'Thiếu thông tin khám bệnh. Vui lòng chọn ít nhất một dịch vụ hoặc mặt bệnh.'
      );
      return;
    }

    // Save logic here
    Alert.alert('Thành công', 'Đã tạo khám bệnh thành công', [
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
        <Text style={styles.title}>Tạo phiếu khám bệnh</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Selection with Search */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin bệnh nhân *</Text>
            {selectedPatient && (
              <TouchableOpacity
                onPress={() => router.push(`/patients/${selectedPatient.id}`)}
                style={styles.viewPatientButton}
              >
                <Ionicons name="eye-outline" size={16} color={colors.primary} />
                <Text style={styles.viewPatientText}>Xem chi tiết</Text>
              </TouchableOpacity>
            )}
          </View>

          <Input
            placeholder="Tìm theo tên hoặc 3 số cuối số điện thoại"
            value={patientSearchQuery}
            onChangeText={setPatientSearchQuery}
            leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
            style={styles.searchInput}
          />

          {selectedPatient && (
            <View style={styles.selectedPatientCard}>
              <View style={styles.selectedPatientInfo}>
                <Ionicons name="person-circle" size={32} color={colors.primary} />
                <View style={styles.selectedPatientDetails}>
                  <Text style={styles.selectedPatientName}>{selectedPatient.name}</Text>
                  <Text style={styles.selectedPatientPhone}>{selectedPatient.phone}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setFormData({ ...formData, patientId: '' });
                  setPatientSearchQuery('');
                }}
              >
                <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {!selectedPatient && (
            <View style={styles.patientList}>
              {filteredPatients.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="person-outline" size={32} color={colors.textTertiary} />
                  <Text style={styles.emptyStateText}>
                    {patientSearchQuery
                      ? 'Không tìm thấy bệnh nhân'
                      : 'Nhập tên hoặc 3 số cuối số điện thoại để tìm kiếm'}
                  </Text>
                  <Button
                    title="Đăng ký bệnh nhân mới"
                    onPress={() => router.push('/patients/create')}
                    variant="outline"
                    size="small"
                    style={styles.newPatientButton}
                  />
                </View>
              ) : (
                filteredPatients.map((patient) => (
                  <TouchableOpacity
                    key={patient.id}
                    style={styles.patientOption}
                    onPress={() => {
                      setFormData({ ...formData, patientId: patient.id });
                      setPatientSearchQuery(patient.name);
                    }}
                  >
                    <View style={styles.patientOptionContent}>
                      <Text style={styles.patientOptionName}>{patient.name}</Text>
                      <View style={styles.patientOptionMeta}>
                        <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.patientOptionPhone}>{patient.phone}</Text>
                        <Text style={styles.patientOptionLast3}>
                          (Cuối: {patient.phone.slice(-3)})
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </Card>

        {/* Date Selection */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ngày khám</Text>
            <TouchableOpacity onPress={handleSetToday} style={styles.todayButton}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
              <Text style={styles.todayButtonText}>Hôm nay</Text>
            </TouchableOpacity>
          </View>
          <Input
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
            placeholder="YYYY-MM-DD"
            leftIcon={<Ionicons name="calendar" size={20} color={colors.textSecondary} />}
          />
          <Text style={styles.dateHint}>
            {formData.date && `Ngày đã chọn: ${formatDate(formData.date)}`}
          </Text>
        </Card>

        {/* Services Selection */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dịch vụ khám</Text>
            <TouchableOpacity
              onPress={() => setShowCustomServiceModal(true)}
              style={styles.addButton}
            >
              <Ionicons name="add-circle" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Thêm dịch vụ</Text>
            </TouchableOpacity>
          </View>

          {formData.services.length > 0 && (
            <View style={styles.selectedItemsContainer}>
              <Text style={styles.selectedItemsLabel}>Đã chọn:</Text>
              {formData.services.map((serviceId) => {
                const service = allServices.find((s) => s.id === serviceId);
                if (!service) return null;
                return (
                  <View key={serviceId} style={styles.selectedItem}>
                    <Text style={styles.selectedItemName}>{service.name}</Text>
                    <View style={styles.selectedItemRight}>
                      <Text style={styles.selectedItemPrice}>
                        {formatCurrency(service.price)}
                      </Text>
                      <TouchableOpacity onPress={() => handleServiceToggle(serviceId)}>
                        <Ionicons name="close-circle" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.servicesList}>
            {allServices.map((service) => {
              const isSelected = formData.services.includes(service.id);
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceOption,
                    isSelected && styles.serviceOptionSelected,
                    service.isCustom && styles.customItem,
                  ]}
                  onPress={() => handleServiceToggle(service.id)}
                >
                  <View style={styles.serviceOptionContent}>
                    <View style={styles.serviceHeader}>
                      <Text style={styles.serviceOptionName}>{service.name}</Text>
                      {service.isCustom && (
                        <View style={styles.customBadgeContainer}>
                          <View style={styles.customBadge}>
                            <Text style={styles.customBadgeText}>Tùy chỉnh</Text>
                          </View>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleEditCustomService(service.id);
                            }}
                            style={styles.editIconButton}
                          >
                            <Ionicons name="pencil" size={16} color={colors.primary} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <Text style={styles.serviceOptionPrice}>
                      {formatCurrency(service.price)}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Disease Categories Selection */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chẩn đoán / Mặt bệnh</Text>
            <TouchableOpacity
              onPress={() => setShowCustomDiseaseModal(true)}
              style={styles.addButton}
            >
              <Ionicons name="add-circle" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Thêm mặt bệnh</Text>
            </TouchableOpacity>
          </View>

          {formData.diseases.length > 0 && (
            <View style={styles.selectedItemsContainer}>
              <Text style={styles.selectedItemsLabel}>Đã chọn:</Text>
              {formData.diseases.map((diseaseId) => {
                const disease = allDiseases.find((d) => d.id === diseaseId);
                if (!disease) return null;
                return (
                  <View key={diseaseId} style={styles.selectedItem}>
                    <Text style={styles.selectedItemName}>{disease.name}</Text>
                    <View style={styles.selectedItemRight}>
                      <Text style={styles.selectedItemPrice}>
                        {formatCurrency(disease.price)}
                      </Text>
                      <TouchableOpacity onPress={() => handleDiseaseToggle(diseaseId)}>
                        <Ionicons name="close-circle" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.servicesList}>
            {allDiseases.map((disease) => {
              const isSelected = formData.diseases.includes(disease.id);
              return (
                <TouchableOpacity
                  key={disease.id}
                  style={[
                    styles.serviceOption,
                    isSelected && styles.serviceOptionSelected,
                    disease.isCustom && styles.customItem,
                  ]}
                  onPress={() => handleDiseaseToggle(disease.id)}
                >
                  <View style={styles.serviceOptionContent}>
                    <View style={styles.serviceHeader}>
                      <Text style={styles.serviceOptionName}>{disease.name}</Text>
                      {disease.isCustom && (
                        <View style={styles.customBadgeContainer}>
                          <View style={styles.customBadge}>
                            <Text style={styles.customBadgeText}>Tùy chỉnh</Text>
                          </View>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleEditCustomDisease(disease.id);
                            }}
                            style={styles.editIconButton}
                          >
                            <Ionicons name="pencil" size={16} color={colors.primary} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <Text style={styles.serviceOptionPrice}>
                      {formatCurrency(disease.price)}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Medical Notes */}
        <Card>
          <Text style={styles.sectionTitle}>Ghi chú y tế</Text>
          <Input
            value={formData.medicalNotes}
            onChangeText={(text) => setFormData({ ...formData, medicalNotes: text })}
            placeholder="Nhập ghi chú về tình trạng, điều trị, hướng dẫn cho bệnh nhân..."
            multiline
            numberOfLines={5}
            style={styles.notesInput}
          />
        </Card>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="receipt-outline" size={24} color={colors.primary} />
            <Text style={styles.summaryTitle}>Tổng kết</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số dịch vụ:</Text>
            <Text style={styles.summaryValue}>{formData.services.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số mặt bệnh:</Text>
            <Text style={styles.summaryValue}>{formData.diseases.length}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalCost)}</Text>
          </View>
        </Card>

        {/* Save Button */}
        <Button
          title="Lưu phiếu khám bệnh"
          onPress={handleSave}
          fullWidth
          style={styles.saveButton}
        />
      </ScrollView>

      {/* Custom Service Modal */}
      <Modal
        visible={showCustomServiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          // Disable back button on Android to prevent accidental data loss
          // Only allow closing via close button
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingServiceId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowCustomServiceModal(false);
                    setEditingServiceId(null);
                    setCustomServiceForm({ name: '', price: '' });
                  }}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                  style={styles.modalBody}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Input
                    ref={serviceNameInputRef}
                    label="Tên dịch vụ *"
                    value={customServiceForm.name}
                    onChangeText={(text) =>
                      setCustomServiceForm({ ...customServiceForm, name: text })
                    }
                    placeholder="Ví dụ: Tẩy trắng răng, Niềng răng..."
                    returnKeyType="next"
                  />

                  <Input
                    label="Giá (₫) *"
                    value={customServiceForm.price}
                    onChangeText={(text) =>
                      setCustomServiceForm({ ...customServiceForm, price: text })
                    }
                    placeholder="Nhập giá tiền"
                    keyboardType="numeric"
                  />

                  <Button
                    title={editingServiceId ? 'Lưu thay đổi' : 'Thêm dịch vụ'}
                    onPress={handleAddCustomService}
                    fullWidth
                    style={styles.modalButton}
                  />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Custom Disease Modal */}
      <Modal
        visible={showCustomDiseaseModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          // Disable back button on Android to prevent accidental data loss
          // Only allow closing via close button
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingDiseaseId ? 'Chỉnh sửa mặt bệnh' : 'Thêm mặt bệnh mới'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowCustomDiseaseModal(false);
                    setEditingDiseaseId(null);
                    setCustomDiseaseForm({ name: '', price: '' });
                  }}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                  style={styles.modalBody}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Input
                    ref={diseaseNameInputRef}
                    label="Tên mặt bệnh *"
                    value={customDiseaseForm.name}
                    onChangeText={(text) =>
                      setCustomDiseaseForm({ ...customDiseaseForm, name: text })
                    }
                    placeholder="Ví dụ: Sâu răng, Viêm nướu..."
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      // Focus on price input if needed
                    }}
                  />

                  <Input
                    label="Giá (₫) *"
                    value={customDiseaseForm.price}
                    onChangeText={(text) =>
                      setCustomDiseaseForm({ ...customDiseaseForm, price: text })
                    }
                    placeholder="Nhập giá tiền"
                    keyboardType="numeric"
                  />

                  <Button
                    title={editingDiseaseId ? 'Lưu thay đổi' : 'Thêm mặt bệnh'}
                    onPress={handleAddCustomDisease}
                    fullWidth
                    style={styles.modalButton}
                  />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  searchInput: {
    marginBottom: spacing.sm,
  },
  patientList: {
    gap: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  newPatientButton: {
    marginTop: spacing.sm,
  },
  patientOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  patientOptionContent: {
    flex: 1,
  },
  patientOptionName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  patientOptionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  patientOptionPhone: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  patientOptionLast3: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  selectedPatientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.sm,
  },
  selectedPatientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  selectedPatientDetails: {
    flex: 1,
  },
  selectedPatientName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  selectedPatientPhone: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  viewPatientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  viewPatientText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.primary}10`,
  },
  todayButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  dateHint: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  addButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  selectedItemsContainer: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  selectedItemsLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  selectedItemName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  selectedItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectedItemPrice: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
  },
  servicesList: {
    gap: spacing.sm,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  serviceOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  customItem: {
    borderColor: colors.warning,
    backgroundColor: `${colors.warning}10`,
  },
  serviceOptionContent: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  serviceOptionName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  customBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  customBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.warning,
  },
  customBadgeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  editIconButton: {
    padding: spacing.xs / 2,
  },
  serviceOptionPrice: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  notesInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
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
  modalBackdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth:'100%',
    maxHeight: '100%',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  modalBody: {
    maxHeight: '100%',
  },
  modalButton: {
    marginTop: spacing.md,
  },
});
