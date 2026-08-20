import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  ScrollView, TouchableOpacity, Alert, Modal, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StepProgressBar from '../../components/StepProgressBar';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { getWebmailUrl } from '../../utils/mailProvider';
import { useI18n } from '../../i18n';

// `value` is what gets stored on the profile and must stay stable across
// languages; only the catalog key next to it decides what the user reads.
const LEVELS = [
  { value: 'başlangıç', labelKey: 'level.beginner', descKey: 'level.beginner.desc' },
  { value: 'orta', labelKey: 'level.intermediate', descKey: 'level.intermediate.desc' },
  { value: 'ileri', labelKey: 'level.advanced', descKey: 'level.advanced.desc' },
  { value: 'profesyonel', labelKey: 'level.pro', descKey: 'level.pro.desc' },
] as const;

const POSITIONS = [
  { value: 'pasor', labelKey: 'position.setter' },
  { value: 'smacor', labelKey: 'position.outsideHitter' },
  { value: 'orta', labelKey: 'position.middleBlocker' },
  { value: 'libero', labelKey: 'position.libero' },
  { value: 'pasor_caprazi', labelKey: 'position.opposite' },
  { value: 'kararsiz', labelKey: 'position.undecided' },
] as const;

const GOALS = [
  { value: 'Servis geliştirme', labelKey: 'goal.serve' },
  { value: 'Manşet kontrolü', labelKey: 'goal.forearmPass' },
  { value: 'Smaç gücü', labelKey: 'goal.spikePower' },
  { value: 'Blok tekniği', labelKey: 'goal.blockTechnique' },
  { value: 'Takım oyunu', labelKey: 'goal.teamPlay' },
  { value: 'Fiziksel kondisyon', labelKey: 'goal.conditioning' },
  { value: 'Mental güç', labelKey: 'goal.mental' },
  { value: 'Savunma', labelKey: 'goal.defense' },
  { value: 'Pasörlük', labelKey: 'goal.setting' },
  { value: 'Liderlik', labelKey: 'goal.leadership' },
  { value: 'Maç zekası', labelKey: 'goal.gameIq' },
  { value: 'Çeviklik', labelKey: 'goal.agility' },
] as const;

const FREQUENCIES = [2, 3, 4, 5] as const;

export default function RegisterScreen() {
  const { signUp, finalizeSignUp } = useAuth();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [pendingSession, setPendingSession] = useState<{ access_token: string; refresh_token: string } | null>(null);

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
      Alert.alert(t('common.error'), t('auth.register.credentialsRequired'));
      return;
    }
    setLoading(true);
    try {
      const session = await signUp({ email, password, first_name: firstName, last_name: lastName, level, position, goals, frequency: String(frequency) });
      setPendingSession(session);
      setShowEmailSentModal(true);
    } catch (e: unknown) {
      const raw = (e as any)?.response?.data?.detail;
      const noResponse = !(e as any)?.response;
      const msg = Array.isArray(raw)
        ? raw.map((d: any) => d.msg ?? d).join('\n')
        : (raw ?? (noResponse ? t('auth.register.noResponse') : t('auth.register.failed')));
      Alert.alert(t('common.error'), String(msg));
    } finally {
      setLoading(false);
    }
  };

  const confirmEmailSentModal = async () => {
    if (!pendingSession) return;
    setShowEmailSentModal(false);
    await finalizeSignUp(pendingSession.access_token, pendingSession.refresh_token);
  };

  const openWebmail = async () => {
    const url = getWebmailUrl(email);
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch {
      // ignore — user stays on the modal and can dismiss manually
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <StepProgressBar total={5} current={step} />

          {step === 0 && (
            <View>
              <Text style={styles.heading}>{t('auth.register.accountInfo')}</Text>
              <Input label={t('auth.register.firstName')} placeholder={t('auth.register.firstNamePlaceholder')} value={firstName} onChangeText={setFirstName} />
              <Input label={t('auth.register.lastName')} placeholder={t('auth.register.lastNamePlaceholder')} value={lastName} onChangeText={setLastName} />
              <Input label={t('auth.email')} placeholder={t('auth.emailPlaceholder')} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
              <Input label={t('auth.password')} placeholder={t('auth.register.passwordPlaceholder')} secureTextEntry value={password} onChangeText={setPassword} />
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.heading}>{t('auth.register.yourLevel')}</Text>
              {LEVELS.map((l) => (
                <TouchableOpacity
                  key={l.value}
                  style={[styles.option, level === l.value && styles.optionSelected]}
                  onPress={() => setLevel(l.value)}
                >
                  <Text style={[styles.optionTitle, level === l.value && styles.optionTitleSelected]}>{t(l.labelKey)}</Text>
                  <Text style={styles.optionDesc}>{t(l.descKey)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.heading}>{t('auth.register.yourPosition')}</Text>
              <View style={styles.grid}>
                {POSITIONS.map((p) => (
                  <TouchableOpacity
                    key={p.value}
                    style={[styles.chip, position === p.value && styles.chipSelected]}
                    onPress={() => setPosition(p.value)}
                  >
                    <Text style={[styles.chipText, position === p.value && styles.chipTextSelected]}>{t(p.labelKey)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.heading}>{t('auth.register.yourGoals')}</Text>
              <Text style={styles.sub}>{t('auth.register.multiSelectHint')}</Text>
              <View style={styles.grid}>
                {GOALS.map((g) => (
                  <TouchableOpacity
                    key={g.value}
                    style={[styles.chip, goals.includes(g.value) && styles.chipSelected]}
                    onPress={() => toggleGoal(g.value)}
                  >
                    <Text style={[styles.chipText, goals.includes(g.value) && styles.chipTextSelected]}>{t(g.labelKey)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 4 && (
            <View>
              <Text style={styles.heading}>{t('auth.register.frequency')}</Text>
              {FREQUENCIES.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.option, frequency === f && styles.optionSelected]}
                  onPress={() => setFrequency(f)}
                >
                  <Text style={[styles.optionTitle, frequency === f && styles.optionTitleSelected]}>
                    {f >= 5 ? t('frequency.perWeekPlus', { n: f }) : t('frequency.perWeek', { n: f })}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && <Button title={t('auth.register.back')} onPress={back} variant="outline" style={{ flex: 1, marginRight: 8 }} />}
          {step < 4 ? (
            <Button
              title={t('auth.register.next')}
              onPress={next}
              style={{ flex: 1 }}
              disabled={step === 0 ? (!email || !password) : step === 1 ? !level : step === 2 ? !position : false}
            />
          ) : (
            <Button title={t('auth.register.title')} onPress={submit} loading={loading} style={{ flex: 1 }} />
          )}
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showEmailSentModal} transparent animationType="fade" onRequestClose={confirmEmailSentModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIconText}>✉️</Text>
            </View>
            <Text style={styles.modalTitle}>{t('auth.register.verifyTitle')}</Text>
            <Text style={styles.modalDesc}>
              {t('auth.register.verifyBody', { email })}
            </Text>
            <Button title={t('auth.register.openMail')} onPress={openWebmail} style={{ width: '100%', marginTop: 8 }} />
            <Button title={t('common.ok')} onPress={confirmEmailSentModal} variant="outline" style={{ width: '100%', marginTop: 8 }} />
          </View>
        </View>
      </Modal>
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
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalIconText: { fontSize: 30 },
  modalTitle: { color: colors.foreground, fontSize: 19, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  modalDesc: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  });
}
