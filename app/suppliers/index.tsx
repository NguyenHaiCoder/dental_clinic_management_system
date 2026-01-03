import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { useToast } from '../../contexts/ToastContext';
import { Supplier, SupplierOrder } from '../../types';
import { formatDate, getVietnamNow } from '../../utils/formatters';

export default function SuppliersScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Xưởng Răng ABC',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Xưởng Răng XYZ',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [orderForm, setOrderForm] = useState({
    supplierId: '1',
    patientName: '',
    patientPhone: '',
    sentDate: formatDate(getVietnamNow()),
    sentDateMode: 'auto' as 'auto' | 'custom',
    requirements: '',
    toothCount: '',
    totalAmount: '',
  });

  const [orders, setOrders] = useState<SupplierOrder[]>([
    {
      id: 'ord-1',
      supplierId: '1',
      patientId: 'p1',
      patientName: 'Nguyễn Văn A',
      patientPhone: '0901234567',
      sentDate: formatDate(getVietnamNow()),
      requirements: 'Inlay răng số 6, chất liệu ABC',
      toothCount: 12,
      totalAmount: 12000000,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const filtered = suppliers.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.phone.includes(searchQuery);
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      showToast('Tên xưởng và SĐT là bắt buộc', 'error');
      return;
    }
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    setForm({ name: '', phone: '', address: '' });
    showToast('Đã thêm nhà cung cấp', 'success');
  };

  const resetOrderForm = () => {
    setOrderForm({
      supplierId: suppliers[0]?.id || '',
      patientName: '',
      patientPhone: '',
      sentDate: formatDate(getVietnamNow()),
      sentDateMode: 'auto',
      requirements: '',
      toothCount: '',
      totalAmount: '',
    });
    setEditingOrderId(null);
  };

  const handleSaveOrder = () => {
    if (!orderForm.supplierId) {
      showToast('Chọn xưởng trước khi lưu', 'error');
      return;
    }
    if (!orderForm.patientName.trim() || !orderForm.patientPhone.trim()) {
      showToast('Nhập tên và SĐT bệnh nhân', 'error');
      return;
    }
    const toothCount = Number(orderForm.toothCount) || 0;
    const totalAmount = Number(orderForm.totalAmount) || 0;
    const payload: SupplierOrder = {
      id: editingOrderId || `ord-${Date.now()}`,
      supplierId: orderForm.supplierId,
      patientId: '',
      patientName: orderForm.patientName.trim(),
      patientPhone: orderForm.patientPhone.trim(),
      sentDate: orderForm.sentDate,
      requirements: orderForm.requirements.trim(),
      toothCount,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => {
      if (editingOrderId) {
        return prev.map((o) => (o.id === editingOrderId ? payload : o));
      }
      return [payload, ...prev];
    });
    showToast(editingOrderId ? 'Đã cập nhật đơn xưởng' : 'Đã tạo đơn xưởng', 'success');
    resetOrderForm();
  };

  const handleEditOrder = (order: SupplierOrder) => {
    setEditingOrderId(order.id);
    setOrderForm({
      supplierId: order.supplierId,
      patientName: order.patientName,
      patientPhone: order.patientPhone,
      sentDate: order.sentDate,
      sentDateMode: 'custom',
      requirements: order.requirements || '',
      toothCount: String(order.toothCount || ''),
      totalAmount: String(order.totalAmount || ''),
    });
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (editingOrderId === id) resetOrderForm();
    showToast('Đã xóa đơn xưởng', 'success');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Nhà cung cấp</Text>
        <Button title="Quay lại" size="small" variant="outline" onPress={() => router.back()} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Input
          placeholder="Tìm nhà cung cấp theo tên hoặc SĐT"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Thêm nhà cung cấp</Text>
          <Input
            label="Tên xưởng"
            value={form.name}
            onChangeText={(text) => setForm((p) => ({ ...p, name: text }))}
            placeholder="Tên xưởng sản xuất"
          />
          <Input
            label="Số điện thoại"
            value={form.phone}
            onChangeText={(text) => setForm((p) => ({ ...p, phone: text }))}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
          <Input
            label="Địa chỉ"
            value={form.address}
            onChangeText={(text) => setForm((p) => ({ ...p, address: text }))}
            placeholder="Nhập địa chỉ"
          />
          <Button title="Lưu nhà cung cấp" onPress={handleAdd} fullWidth style={styles.saveButton} />
        </Card>

        <Text style={styles.sectionTitle}>Danh sách nhà cung cấp</Text>
        {filtered.length === 0 ? (
          <EmptyState icon="business-outline" title="Chưa có nhà cung cấp" message="" />
        ) : (
          <View style={styles.listContainer}>
            {filtered.map((s) => (
              <Card key={s.id} style={styles.supplierCard}>
                <View style={styles.supplierHeader}>
                  <View style={styles.supplierInfo}>
                    <Text style={styles.supplierName}>{s.name}</Text>
                    <Text style={styles.supplierMeta}>SĐT: {s.phone}</Text>
                    {s.address ? <Text style={styles.supplierMeta}>{s.address}</Text> : null}
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: s.isActive ? colors.success : colors.error }]} />
                </View>
              </Card>
            ))}
          </View>
        )}

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Đặt xưởng (quản lý đơn)</Text>

          <Text style={styles.helperText}>Chọn xưởng</Text>
          <View style={styles.chipRow}>
            {suppliers.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.chip,
                  orderForm.supplierId === s.id && { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
                ]}
                onPress={() => setOrderForm((p) => ({ ...p, supplierId: s.id }))}
              >
                <Text style={[styles.chipText, orderForm.supplierId === s.id && { color: colors.primary }]}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Tên bệnh nhân"
            value={orderForm.patientName}
            onChangeText={(text) => setOrderForm((p) => ({ ...p, patientName: text }))}
            placeholder="Nhập tên bệnh nhân"
          />
          <Input
            label="SĐT bệnh nhân"
            value={orderForm.patientPhone}
            onChangeText={(text) => setOrderForm((p) => ({ ...p, patientPhone: text }))}
            placeholder="Nhập SĐT bệnh nhân"
            keyboardType="phone-pad"
          />
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                orderForm.sentDateMode === 'auto' && { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
              ]}
              onPress={() =>
                setOrderForm((p) => ({
                  ...p,
                  sentDateMode: 'auto',
                  sentDate: formatDate(getVietnamNow()),
                }))
              }
            >
              <Text style={[styles.toggleText, orderForm.sentDateMode === 'auto' && { color: colors.primary }]}>
                Ngày gửi: Auto (hôm nay)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                orderForm.sentDateMode === 'custom' && { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
              ]}
              onPress={() => setOrderForm((p) => ({ ...p, sentDateMode: 'custom' }))}
            >
              <Text style={[styles.toggleText, orderForm.sentDateMode === 'custom' && { color: colors.primary }]}>
                Ngày gửi: Tùy chỉnh
              </Text>
            </TouchableOpacity>
          </View>
          <Input
            label="Ngày gửi"
            value={orderForm.sentDate}
            onChangeText={(text) => setOrderForm((p) => ({ ...p, sentDate: text }))}
            placeholder="dd-mm-yyyy"
          />

          <Input
            label="Yêu cầu"
            value={orderForm.requirements}
            onChangeText={(text) => setOrderForm((p) => ({ ...p, requirements: text }))}
            placeholder="Chất liệu, ghi chú..."
            multiline
          />

          <View style={styles.row}>
            <Input
              label="Số lượng răng"
              value={orderForm.toothCount}
              onChangeText={(text) => setOrderForm((p) => ({ ...p, toothCount: text }))}
              placeholder="VD: 12"
              keyboardType="numeric"
              style={styles.half}
            />
            <Input
              label="Tổng tiền"
              value={orderForm.totalAmount}
              onChangeText={(text) => setOrderForm((p) => ({ ...p, totalAmount: text }))}
              placeholder="VD: 12000000"
              keyboardType="numeric"
              style={styles.half}
            />
          </View>

          <View style={styles.row}>
            <Button
              title={editingOrderId ? 'Cập nhật đơn xưởng' : 'Lưu đơn xưởng'}
              onPress={handleSaveOrder}
              fullWidth
              style={styles.half}
            />
            {editingOrderId && (
              <Button
                title="Hủy"
                variant="outline"
                onPress={resetOrderForm}
                fullWidth
                style={styles.half}
              />
            )}
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Danh sách đơn xưởng</Text>
        {orders.length === 0 ? (
          <EmptyState icon="cube-outline" title="Chưa có đơn xưởng" message="" />
        ) : (
          <View style={styles.listContainer}>
            {orders.map((o) => {
              const sup = suppliers.find((s) => s.id === o.supplierId);
              return (
                <Card key={o.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderTitle}>{sup?.name || 'Xưởng'}</Text>
                      <Text style={styles.orderMeta}>Ngày gửi: {o.sentDate}</Text>
                      <Text style={styles.orderMeta}>
                        BN: {o.patientName} - {o.patientPhone}
                      </Text>
                      {o.requirements ? <Text style={styles.orderMeta}>YC: {o.requirements}</Text> : null}
                      <Text style={styles.orderMeta}>Số lượng răng: {o.toothCount || 0}</Text>
                      <Text style={styles.orderMeta}>Tổng tiền: {formatCurrency(o.totalAmount || 0)}</Text>
                    </View>
                    <View style={styles.orderActions}>
                      <TouchableOpacity onPress={() => handleEditOrder(o)}>
                        <Ionicons name="create-outline" size={22} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteOrder(o.id)}>
                        <Ionicons name="trash-outline" size={22} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              );
            })}
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
  formCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  listContainer: {
    gap: spacing.sm,
  },
  supplierCard: {
    padding: spacing.md,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  supplierMeta: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  helperText: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semiBold,
  },
  toggleBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleText: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
  orderCard: {
    padding: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  orderInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  orderTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  orderMeta: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  orderActions: {
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
});

