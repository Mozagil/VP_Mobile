import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile, useUpdateProfile } from '../../hooks/useProfile';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { colors } from '../../theme/colors';

const LEVELS = ['başlangıç', 'orta', 'ileri', 'profesyonel'];
const POSITIONS = ['pasor', 'smacor', 'orta', 'libero', 'pasor_caprazi', 'kararsiz'];
const POSITION_LABELS: Record<string, string> = {
  pasor: 'Pasör', smacor: 'Smaçör', orta: 'Orta Oyuncu',
  libero: 'Libero', pasor_caprazi: 'Pasör Çaprazı', kararsiz: 'Kararsız',
};
const GOALS = ['Servis', 'Manşet', 'Smaç', 'Blok', 'Takım oyunu', 'Kondisyon', 'Mental güç', 'Savunma', 'Pasörlük'];

export default function ProfileScreen() {
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [level, setLevel] = useState('');
  const [position, setPosition] = useState('');
  const [goals, setGoals] = useState<string[]>([]);

  const startEdit = () => {
    setLevel(profile?.level ?? '');
    setPosition(profile?.position ?? '');
    setGoals(profile?.goals ?? []);
    setEditing(true);
  };

  const save = async () => {
    try {
      await update.mutateAsync({ level, position, goals });
      setEditing(false);
    } catch {
      Alert.alert('Hata', 'Profil güncellenemedi.');
    }
  };

  const toggleGoal = (g: string) =>
    setGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.name}>{profile?.first_name} {profile?.last_name}</Text>

        {!editing ? (
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>Seviye</Text>
              <Badge label={profile?.level ?? '—'} color={colors.accent} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mevki</Text>
              <Badge label={POSITION_LABELS[profile?.position ?? ''] ?? profile?.position ?? '—'} color={colors.purple} />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Hedefler</Text>
              <View style={styles.goalsRow}>
                {(profile?.goals ?? []).map((g) => (
                  <Badge key={g} label={g} color={colors.success} />
                ))}
              </View>
            </View>
            <Button title="Düzenle" onPress={startEdit} variant="outline" style={{ marginTop: 16 }} />
          </View>
        ) : (
          <View>
            <Text style={styles.editLabel}>Seviye</Text>
            <View style={styles.chipRow}>
              {LEVELS.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.chip, level === l && styles.chipActive]}
                  onPress={() => setLevel(l)}
                >
                  <Text style={[styles.chipText, level === l && styles.chipTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.editLabel}>Mevki</Text>
            <View style={styles.chipRow}>
              {POSITIONS.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, position === p && styles.chipActive]}
                  onPress={() => setPosition(p)}
                >
                  <Text style={[styles.chipText, position === p && styles.chipTextActive]}>{POSITION_LABELS[p]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.editLabel}>Hedefler</Text>
            <View style={styles.chipRow}>
              {GOALS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, goals.includes(g) && styles.chipActive]}
                  onPress={() => toggleGoal(g)}
                >
                  <Text style={[styles.chipText, goals.includes(g) && styles.chipTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <Button title="İptal" onPress={() => setEditing(false)} variant="outline" style={{ flex: 1 }} />
              <Button title="Kaydet" onPress={save} loading={update.isPending} style={{ flex: 1 }} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20 },
  name: { color: colors.foreground, fontSize: 24, fontWeight: '700', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  section: { paddingVertical: 12 },
  label: { color: colors.muted, fontSize: 14 },
  goalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  editLabel: { color: colors.foreground, fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accent + '20' },
  chipText: { color: colors.muted, fontSize: 13 },
  chipTextActive: { color: colors.accent, fontWeight: '600' },
});
