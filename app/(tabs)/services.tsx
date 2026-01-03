import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { useToast } from '../../contexts/ToastContext';
import {
  InventoryExport,
  InventoryImport,
  InventoryItem,
} from '../../types';
import { formatCurrency, formatDate, getVietnamNow } from '../../utils/formatters';

export default function SuppliesScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Găng tay y tế', unit: 'hộp', stock: 50, createdAt: new Date().toISOString() },
    { id: '2', name: 'Khẩu trang y tế', unit: 'hộp', stock: 80, createdAt: new Date().toISOString() },
    { id: '3', name: 'Thuốc tê Lidocain', unit: 'ống', stock: 30, createdAt: new Date().toISOString() },
  ]);
  const [imports, setImports] = useState<InventoryImport[]>([
    {
      id: 'imp1',
      itemId: '1',
      quantity: 20,
      importPrice: 120000,
      totalPrice: 2400000,
      date: formatDate(getVietnamNow()),
      createdAt: new Date().toISOString(),
      notes: 'Nhập bổ sung',
    },
  ]);
  const [exports, setExports] = useState<InventoryExport[]>([
    {
      id: 'exp1',
      itemId: '2',
      quantity: 5,
      exportDate: formatDate(getVietnamNow()),
      createdAt: new Date().toISOString(),
      notes: 'Xuất cho ca khám sáng',
    },
  ]);

  const [importForm, setImportForm] = useState({
    name: '',
    quantity: '',
    price: '',
  });

  const [exportForm, setExportForm] = useState({
    itemId: '',
    quantity: '',
    date: formatDate(getVietnamNow()),
  });

  const filteredInventory = useMemo(() => {
    if (!searchQuery) return inventory;
    const q = searchQuery.toLowerCase();
    return inventory.filter((item) => item.name.toLowerCase().includes(q));
  }, [inventory, searchQuery]);

  const summary = useMemo(() => {
    const totalStock = inventory.reduce((sum, i) => sum + i.stock, 0);
    const totalImportValue = imports.reduce((sum, i) => sum + i.totalPrice, 0);
    const totalExportQty = exports.reduce((sum, e) => sum + e.quantity, 0);
    return { totalStock, totalImportValue, totalExportQty };
  }, [inventory, imports, exports]);

  const findItemById = (id: string) => inventory.find((i) => i.id === id);

  const handleImport = () => {
    const name = importForm.name.trim();
    const quantity = Number(importForm.quantity);
    const price = Number(importForm.price);

    if (!name || quantity <= 0 || price < 0) {
      showToast('Vui lòng nhập đầy đủ Tên, Số lượng (>0) và Giá nhập', 'error');
      return;
    }

    const totalPrice = quantity * price;
    let targetId = '';
    setInventory((prev) => {
      const existing = prev.find((i) => i.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        targetId = existing.id;
        return prev.map((i) =>
          i.id === existing.id ? { ...i, stock: i.stock + quantity } : i
        );
      }
      targetId = Date.now().toString();
      return [
        ...prev,
        { id: targetId, name, unit: 'cái', stock: quantity, createdAt: new Date().toISOString() },
      ];
    });

    const newImport: InventoryImport = {
      id: `imp-${Date.now()}`,
      itemId: targetId,
      quantity,
      importPrice: price,
      totalPrice,
      date: formatDate(getVietnamNow()),
      createdAt: new Date().toISOString(),
    };
    setImports((prev) => [newImport, ...prev]);
    setImportForm({ name: '', quantity: '', price: '' });
    showToast('Đã lưu phiếu nhập vật tư', 'success');
  };

  const handleExport = () => {
    const itemId = exportForm.itemId;
    const quantity = Number(exportForm.quantity);
    if (!itemId) {
      showToast('Vui lòng chọn vật tư cần xuất', 'error');
      return;
    }
    if (quantity <= 0) {
      showToast('Số lượng xuất phải > 0', 'error');
      return;
    }
    const item = findItemById(itemId);
    if (!item) {
      showToast('Vật tư không tồn tại', 'error');
      return;
    }
    if (quantity > item.stock) {
      showToast('Số lượng xuất vượt tồn kho', 'error');
      return;
    }

    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, stock: i.stock - quantity } : i))
    );
    const newExport: InventoryExport = {
      id: `exp-${Date.now()}`,
      itemId,
      quantity,
      exportDate: exportForm.date || formatDate(getVietnamNow()),
      createdAt: new Date().toISOString(),
    };
    setExports((prev) => [newExport, ...prev]);
    setExportForm({ itemId: '', quantity: '', date: formatDate(getVietnamNow()) });
    showToast('Đã lưu phiếu xuất vật tư', 'success');
  };

  const selectedItem = exportForm.itemId ? findItemById(exportForm.itemId) : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Vật tư</Text>
        <View style={styles.headerRight}>
          <Button
            title="Nhà cung cấp"
            variant="outline"
            size="small"
            onPress={() => router.push('/suppliers' as any)}
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
          placeholder="Tìm vật tư theo tên"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />

        {/* Summary */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng vật tư</Text>
            <Text style={styles.summaryValue}>{inventory.length}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tồn kho</Text>
            <Text style={styles.summaryValue}>{summary.totalStock}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng nhập</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.totalImportValue)}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng xuất (số lượng)</Text>
            <Text style={styles.summaryValue}>{summary.totalExportQty}</Text>
          </Card>
        </View>

        {/* Nhập kho */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Nhập kho</Text>
          <Input
            label="Tên vật tư"
            placeholder="Găng tay, khẩu trang..."
            value={importForm.name}
            onChangeText={(text) => setImportForm((p) => ({ ...p, name: text }))}
          />
          <View style={styles.row}>
            <Input
              label="Số lượng nhập"
              placeholder="VD: 10"
              value={importForm.quantity}
              onChangeText={(text) => setImportForm((p) => ({ ...p, quantity: text }))}
              keyboardType="numeric"
              style={styles.half}
            />
            <Input
              label="Giá nhập"
              placeholder="VD: 120000"
              value={importForm.price}
              onChangeText={(text) => setImportForm((p) => ({ ...p, price: text }))}
              keyboardType="numeric"
              style={styles.half}
            />
          </View>
          <Text style={styles.totalText}>
            Tổng giá nhập:{' '}
            <Text style={styles.totalValue}>
              {importForm.quantity && importForm.price
                ? formatCurrency(Number(importForm.quantity) * Number(importForm.price))
                : '0 ₫'}
            </Text>
          </Text>
          <Button title="Lưu phiếu nhập" onPress={handleImport} fullWidth style={styles.saveButton} />
        </Card>

        {/* Xuất kho */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Xuất kho</Text>
          <Text style={styles.helperText}>Chọn vật tư phía dưới để xuất</Text>
          <View style={styles.selectedRow}>
            <Text style={styles.selectedLabel}>Đang chọn:</Text>
            <Text style={styles.selectedValue}>
              {selectedItem ? `${selectedItem.name} (tồn: ${selectedItem.stock})` : 'Chưa chọn'}
            </Text>
          </View>
          <View style={styles.row}>
            <Input
              label="Số lượng xuất"
              placeholder="VD: 5"
              value={exportForm.quantity}
              onChangeText={(text) => setExportForm((p) => ({ ...p, quantity: text }))}
              keyboardType="numeric"
              style={styles.half}
            />
            <Input
              label="Ngày xuất"
              placeholder="dd-mm-yyyy"
              value={exportForm.date}
              onChangeText={(text) => setExportForm((p) => ({ ...p, date: text }))}
              style={styles.half}
            />
          </View>
          <Button title="Lưu phiếu xuất" onPress={handleExport} fullWidth style={styles.saveButton} />
        </Card>

        {/* Danh sách vật tư */}
        <Text style={styles.sectionTitle}>Danh sách vật tư</Text>
        {filteredInventory.length === 0 ? (
          <EmptyState
            icon="cube-outline"
            title="Chưa có vật tư"
            message="Hãy nhập kho để thêm vật tư mới."
          />
        ) : (
          <View style={styles.listContainer}>
            {filteredInventory.map((item) => (
              <Card
                key={item.id}
                style={styles.inventoryCard}
                onPress={() => setExportForm((p) => ({ ...p, itemId: item.id }))}
              >
                <View style={styles.inventoryHeader}>
                  <View style={styles.inventoryInfo}>
                    <Text style={styles.inventoryName}>{item.name}</Text>
                    <Text style={styles.inventoryMeta}>
                      Tồn kho: {item.stock} {item.unit || 'cái'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setExportForm((p) => ({ ...p, itemId: item.id }))}
                    style={styles.selectBadge}
                  >
                    <Text style={styles.selectBadgeText}>Chọn xuất</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Lịch sử nhập */}
        <Text style={styles.sectionTitle}>Lịch sử nhập</Text>
        {imports.length === 0 ? (
          <EmptyState icon="download-outline" title="Chưa có nhập kho" message="" />
        ) : (
          <View style={styles.listContainer}>
            {imports.map((imp) => {
              const item = findItemById(imp.itemId);
              return (
                <Card key={imp.id} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyTitle}>{item?.name || 'Vật tư'}</Text>
                    <Text style={styles.historyAmount}>+{imp.quantity}</Text>
                  </View>
                  <Text style={styles.historyMeta}>
                    Giá nhập: {formatCurrency(imp.importPrice)} | Tổng: {formatCurrency(imp.totalPrice)}
                  </Text>
                  <Text style={styles.historyMeta}>Ngày: {imp.date}</Text>
                </Card>
              );
            })}
          </View>
        )}

        {/* Lịch sử xuất */}
        <Text style={styles.sectionTitle}>Lịch sử xuất</Text>
        {exports.length === 0 ? (
          <EmptyState icon="exit-outline" title="Chưa có xuất kho" message="" />
        ) : (
          <View style={styles.listContainer}>
            {exports.map((exp) => {
              const item = findItemById(exp.itemId);
              return (
                <Card key={exp.id} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyTitle}>{item?.name || 'Vật tư'}</Text>
                    <Text style={[styles.historyAmount, { color: colors.error }]}>-{exp.quantity}</Text>
                  </View>
                  <Text style={styles.historyMeta}>Ngày: {exp.exportDate}</Text>
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
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
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
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  totalText: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
  totalValue: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  helperText: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  selectedLabel: {
    color: colors.textSecondary,
  },
  selectedValue: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  listContainer: {
    gap: spacing.sm,
  },
  inventoryCard: {
    padding: spacing.md,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inventoryMeta: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  selectBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: `${colors.primary}15`,
  },
  selectBadgeText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  historyCard: {
    padding: spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyTitle: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  historyAmount: {
    fontFamily: typography.fontFamily.bold,
    color: colors.success,
  },
  historyMeta: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
});
