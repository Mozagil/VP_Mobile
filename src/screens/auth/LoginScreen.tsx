import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  ScrollView, TouchableOpacity, Alert, StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n } from '../../i18n';

// Bump this string with every new EAS build so testers (and we) can confirm
// which build is actually running on a device, without ambiguity.
const BUILD_LABEL = 'v16';

// Validation messages are built from the active catalog, so the schema is
// created inside the component rather than at module scope.
function makeSchema(t: (key: 'auth.invalidEmail' | 'auth.passwordRequired') => string) {
  return z.object({
    email: z.string().email(t('auth.invalidEmail')),
    password: z.string().min(1, t('auth.passwordRequired')),
  });
}
type FormData = { email: string; password: string };

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);
  const schema = useMemo(() => makeSchema(t), [t]);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (err: any) {
      const raw = err?.response?.data?.detail;
      const msg = Array.isArray(raw) ? raw.map((d: any) => d.msg ?? d).join('\n') : (raw || t('auth.login.badCredentials'));
      Alert.alert(t('auth.login.failed'), String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Image source={require('../../../assets/logo-mark.png')} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.title}>VoleyPro</Text>
            <Text style={styles.subtitle}>{t('auth.tagline')}</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('auth.login.cardTitle')}</Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={t('auth.email')}
                  placeholder={t('auth.emailPlaceholder')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={t('auth.password')}
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

            <Button title={t('auth.login.submit')} onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: 8 }} />
          </View>

          {/* Register link */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
            <Text style={styles.linkText}>
              {t('auth.login.noAccount')} <Text style={styles.linkBold}>{t('nav.register')}</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.buildLabel}>Build: {BUILD_LABEL}</Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.accent + '25',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2, borderColor: colors.accent + '60',
  },
  logoImage: { width: 48, height: 48 },
  title: { color: colors.foreground, fontSize: 30, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: colors.muted, fontSize: 14, textAlign: 'center' },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16, padding: 24,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 24,
  },
  cardTitle: { color: colors.foreground, fontSize: 18, fontWeight: '600', marginBottom: 20 },

  link: { alignItems: 'center' },
  linkText: { color: colors.muted, fontSize: 14 },
  linkBold: { color: colors.accent, fontWeight: '600' },
  buildLabel: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 24, opacity: 0.5 },
  });
}
