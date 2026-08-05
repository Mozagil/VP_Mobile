import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StepProgressBar from '../../components/StepProgressBar';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

const LEVELS = [
  { value: 'başlangıç', label: 'Başlangıç', desc: 'Yeni başlıyorum' },
  { value: 'orta', label: 'Orta', desc: '1-3 yıl deneyim' },
  { value: 'ileri', label: 'İleri', desc: '3+ yıl deneyim' },
  { value: 'profesyonel', label: 'Profesyonel', desc: 'Lisanslı/federasyon' },
];

const POSITIONS = [
  { value: 'pasor', label: 'Pasör' },
  { value: 'smacor', label: 'Smaçör' },
  { value: 'orta', label: 'Orta Oyuncu' },
  { value: 'libero', label: 'Libero' },
  { value: 'pasor_caprazi', label: 'Pasör Çaprazı' },
  { value: 'kararsiz', label: 'Kararsızım' },
];

const GOALS = [
  'Servis geliştirme', 'Manşet kontrolü', 'Smaç gücü', 'Blok tekniği',
  'Takım oyunu', 'Fiziksel kondisyon', 'Mental güç', 'Savunma',
  'Pasörlük', 'Liderlik', 'Maç zekası', 'Çeviklik',
];

const FREQUENCIES = [
  { value: 2, label: '2 gün/hafta' },
  { value: 3, label: '3 gün/hafta' },
  { value: 4, label: '4 gün/hafta' },
  { value: 5, label: '5+ gün/hafta' },
];

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('');
  const [position, setPosition] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [frequency, setFrequency] = useState(3);

  const toggleGoal = (g: string) =>
    setGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'E-posta ve şifre zorunludur.');
      return;
    }
    setLoading(true);
    try {
      await signUp({ email, password, first_name: firstName, last_name: lastName, level, position, goals, frequency: String(frequency) });
    } catch (e: unknown) {
      const raw = (e as any)?.response?.data?.detail;
      const msg = Array.isArray(raw)
        ? raw.map((d: any) => d.msg ?? d).join('\n')
        : (raw ?? 'Kayıt başarısız.');
      Alert.alert('Hata', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <StepProgressBar total={5} current={step} />

          {step === 0 && (
            <View>
              <Text style={styles.heading}>Hesap Bilgileri</Text>
              <Input label="Ad" placeholder="Adınız" value={firstName} onChangeText={setFirstName} />
              <Input label="Soyad" placeholder="Soyadınız" value={lastName} onChangeText={setLastName} />
              <Input label="E-posta" placeholder="email@örnek.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
              <Input label="Şifre" placeholder="En az 6 karakter" secureTextEntry value={password} onChangeText={setPassword} />
              <Button title="Devam" onPress={next} disabled={!email || !password} />
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.heading}>Seviyeniz</Text>
              {LEVELS.map((l) => (
                <TouchableOpacity
                  key={l.value}
                  style={[styles.option, level === l.value && styles.optionSelected]}
                  onPress={() => setLevel(l.value)}
                >
                  <Text style={[styles.optionTitle, level === l.value && styles.optionTitleSelected]}>{l.label}</Text>
                  <Text style={styles.optionDesc}>{l.desc}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.navRow}>
                <Button title="Geri" onPress={back} variant="outline" style={{ flex: 1, marginRight: 8 }} />
                <Button title="Devam" onPress={next} style={{ flex: 1 }} disabled={!level} />
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.heading}>Mevkiniz</Text>
              <View style={styles.grid}>
                {POSITIONS.map((p) => (
                  <TouchableOpacity
                    key={p.value}
                    style={[styles.chip, position === p.value && styles.chipSelected]}
                    onPress={() => setPosition(p.value)}
                  >
                    <Text style={[styles.chipText, position === p.value && styles.chipTextSelected]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.navRow}>
                <Button title="Geri" onPress={back} variant="outline" style={{ flex: 1, marginRight: 8 }} />
                <Button title="Devam" onPress={next} style={{ flex: 1 }} disabled={!position} />
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.heading}>Hedefleriniz</Text>
              <Text style={styles.sub}>Birden fazla seçebilirsiniz</Text>
              <View style={styles.grid}>
                {GOALS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, goals.includes(g) && styles.chipSelected]}
                    onPress={() => toggleGoal(g)}
                  >
                    <Text style={[styles.chipText, goals.includes(g) && styles.chipTextSelected]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.navRow}>
                <Button title="Geri" onPress={back} variant="outline" style={{ flex: 1, marginRight: 8 }} />
                <Button title="Devam" onPress={next} style={{ flex: 1 }} />
              </View>
            </View>
          )}

          {step === 4 && (
            <View>
              <Text style={styles.heading}>Antrenman Sıklığı</Text>
              {FREQUENCIES.map((f) => (
                <TouchableOpacity
                  key={f.value}
                  style={[styles.option, frequency === f.value && styles.optionSelected]}
                  onPress={() => setFrequency(f.value)}
                >
                  <Text style={[styles.optionTitle, frequency === f.value && styles.optionTitleSelected]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
              <View style={[styles.navRow, { marginTop: 16 }]}>
                <Button title="Geri" onPress={back} variant="outline" style={{ flex: 1, marginRight: 8 }} />
                <Button title="Kayıt Ol" onPress={submit} loading={loading} style={{ flex: 1 }} />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 24, paddingTop: 16 },
  heading: { color: colors.foreground, fontSize: 24, fontWeight: '700', marginBottom: 20 },
  sub: { color: colors.muted, fontSize: 14, marginBottom: 12 },
  option: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: colors.accent + '15' },
  optionTitle: { color: colors.foreground, fontSize: 15, fontWeight: '600' },
  optionTitleSelected: { color: colors.accent },
  optionDesc: { color: colors.muted, fontSize: 13, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: { borderColor: colors.accent, backgroundColor: colors.accent + '20' },
  chipText: { color: colors.muted, fontSize: 13 },
  chipTextSelected: { color: colors.accent, fontWeight: '600' },
  navRow: { flexDirection: 'row' },
  });
}
