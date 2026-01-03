import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { useToast } from '../../contexts/ToastContext';
import { formatDate, getVietnamNow } from '../../utils/formatters';

export default function CreatePatientScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [qrText, setQrText] = useState('');
  const [WebQrReader, setWebQrReader] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    nationalId: '',
    issueDate: '',
    createdAt: formatDate(getVietnamNow()),
    notes: '',
  });

  // Lazy-load BarCodeScanner only for native to avoid web unsupported warning
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const BarCodeScanner =
    Platform.OS !== 'web' ? require('expo-barcode-scanner').BarCodeScanner : null;

  useEffect(() => {
    if (Platform.OS === 'web') {
      import('react-qr-reader')
        .then((mod) => {
          const Comp = (mod as any).QrReader || (mod as any).default || null;
          setWebQrReader(() => Comp);
        })
        .catch(() => {
          setWebQrReader(null);
        });
    }
  }, []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên bệnh nhân';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    // Check for duplicate phone (mock)
    // In real app, this would be an API call
    showToast('Đã đăng ký bệnh nhân thành công', 'success');
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  useEffect(() => {
    const requestPermission = async () => {
      if (!BarCodeScanner) return;
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    };
    if (Platform.OS !== 'web' && showScanner && hasCameraPermission === null) {
      requestPermission();
    }
  }, [showScanner, hasCameraPermission]);

  const parseDateCompact = (raw?: string) => {
    if (!raw) return '';
    const clean = raw.replace(/\D/g, '');
    if (clean.length === 8) {
      const dd = clean.slice(0, 2);
      const mm = clean.slice(2, 4);
      const yyyy = clean.slice(4);
      return `${dd}-${mm}-${yyyy}`;
    }
    return raw;
  };

  const parseNationalIdQR = (data: string) => {
    // Expected: cccd|name|dob|gender|address|issueDate (fields separated by "|")
    const parts = data.split('|').map((p) => p.trim());
    const [cccd, name, dob, gender, address, issueDate] = parts;
    return {
      nationalId: cccd || '',
      name: name || '',
      dateOfBirth: parseDateCompact(dob),
      gender: gender?.toLowerCase() === 'nam' ? 'male' : gender?.toLowerCase() === 'nữ' ? 'female' : '',
      address: address || '',
      issueDate: parseDateCompact(issueDate),
    };
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    applyParsedQR(data);
  };

  const applyParsedQR = (data: string) => {
    try {
      const parsed = parseNationalIdQR(data);
      setFormData((prev) => ({
        ...prev,
        ...parsed,
      }));
      showToast('Đã quét CCCD thành công', 'success');
    } catch (error) {
      showToast('Không đọc được dữ liệu CCCD', 'error');
    } finally {
      setShowScanner(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Đăng ký bệnh nhân</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionRow}>
          <Button
            title="Quét CCCD (QR)"
            size="small"
            onPress={() => setShowScanner(true)}
          />
          <Text style={styles.createdAtLabel}>Ngày tạo: {formData.createdAt}</Text>
        </View>

        <Input
          label="Họ và tên *"
          value={formData.name}
          onChangeText={(text) => {
            setFormData({ ...formData, name: text });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          placeholder="Nhập họ và tên"
          error={errors.name}
        />

        <Input
          label="Số điện thoại *"
          value={formData.phone}
          onChangeText={(text) => {
            setFormData({ ...formData, phone: text });
            if (errors.phone) setErrors({ ...errors, phone: '' });
          }}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => {
            setFormData({ ...formData, email: text });
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          placeholder="Nhập email (tùy chọn)"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
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
          placeholder="dd-mm-yyyy"
        />

        <Input
          label="Số CCCD"
          value={formData.nationalId}
          onChangeText={(text) => setFormData({ ...formData, nationalId: text })}
          placeholder="Nhập số CCCD hoặc quét QR"
        />

        <Input
          label="Ngày cấp"
          value={formData.issueDate}
          onChangeText={(text) => setFormData({ ...formData, issueDate: text })}
          placeholder="dd-mm-yyyy"
        />

        <Input
          label="Giới tính"
          value={formData.gender}
          onChangeText={(text) => setFormData({ ...formData, gender: text as any })}
          placeholder="male / female / other"
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
          title="Lưu bệnh nhân"
          onPress={handleSave}
          fullWidth
          style={styles.saveButton}
        />
      </ScrollView>

      <Modal visible={showScanner} animationType="slide">
        <SafeAreaView style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Quét mã QR CCCD</Text>
            <TouchableOpacity onPress={() => setShowScanner(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          {Platform.OS === 'web' ? (
          <View style={styles.permissionBox}>
            {WebQrReader ? (
              <View style={styles.webScannerBox}>
                <Text style={styles.permissionText}>Quét QR bằng camera (web)</Text>
                <WebQrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={(result: any, error: any) => {
                    if (!!result) {
                      const text = result?.text || '';
                      if (text) applyParsedQR(text);
                    }
                  }}
                  videoStyle={{ width: '100%' }}
                />
              </View>
            ) : (
              <>
                <Text style={styles.permissionText}>Camera QR không hỗ trợ, dán dữ liệu:</Text>
                <Input
                  label="Dán dữ liệu QR (các trường cách nhau dấu |)"
                  value={qrText}
                  onChangeText={setQrText}
                  placeholder="CCCD|Họ tên|01022000|Nam|Địa chỉ|05052020"
                  multiline
                  numberOfLines={3}
                  style={styles.qrInput}
                />
                <Button
                  title="Parse dữ liệu"
                  onPress={() => {
                    if (!qrText.trim()) {
                      showToast('Dán dữ liệu QR trước', 'error');
                      return;
                    }
                    applyParsedQR(qrText.trim());
                  }}
                  fullWidth
                  style={styles.saveButton}
                />
              </>
            )}
          </View>
          ) : (
            <>
              {!BarCodeScanner && (
                <View style={styles.permissionBox}>
                  <Text style={styles.permissionText}>Thiết bị không hỗ trợ scanner.</Text>
                  <Button title="Đóng" onPress={() => setShowScanner(false)} />
                </View>
              )}
              {BarCodeScanner && hasCameraPermission === false && (
                <View style={styles.permissionBox}>
                  <Text style={styles.permissionText}>Không có quyền truy cập camera.</Text>
                  <Button title="Đóng" onPress={() => setShowScanner(false)} />
                </View>
              )}
              {BarCodeScanner && hasCameraPermission === true && (
                <View style={styles.scannerBox}>
                  <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                  />
                </View>
              )}
              {BarCodeScanner && hasCameraPermission === null && (
                <View style={styles.permissionBox}>
                  <Text style={styles.permissionText}>Đang yêu cầu quyền camera...</Text>
                </View>
              )}
            </>
          )}
        </SafeAreaView>
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  createdAtLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding.mobile,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  scannerTitle: {
    fontSize: typography.title.mobile,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  scannerBox: {
    flex: 1,
    margin: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  permissionText: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  qrInput: {
    width: '100%',
  },
});

