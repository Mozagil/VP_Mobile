import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { SozlukStackParamList } from '../../navigation/SozlukStack';
import { apiClient } from '../../api/client';
import Icon from '../../components/ui/Icon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

type Props = NativeStackScreenProps<SozlukStackParamList, 'ReportMissingTerm'>;

export default function ReportMissingTermScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [term, setTerm] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!term.trim() || !description.trim()) {
      Alert.alert('Hata', 'Lütfen terim ve açıklama alanlarını doldurun.');
      return;
    }
    setSending(true);
    try {
      await apiClient.post('/dictionary/report-missing-term', { term: term.trim(), description: description.trim() });
      Alert.alert('Teşekkürler', 'Eksik terim bildiriminiz alındı.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Hata', 'Bildirim gönderilirken bir sorun oluştu, lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Eksik Terim Bildir</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        <Text style={s.sub}>
          Sözlükte bulamadığın bir voleybol terimi mi var? Bize bildir, ekleyelim.
        </Text>

        <Input label="Eksik terim" placeholder="Örn: Pancake" value={term} onChangeText={setTerm} />
        <Input
          label="Açıklaması"
          placeholder="Terimin ne anlama geldiğini kısaca açıklar mısın?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          style={s.textArea}
        />
      </ScrollView>

      <View style={s.footer}>
        <Button title="Gönder" onPress={submit} loading={sending} />
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
    iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1, textAlign: 'center' },
    body: { padding: 16 },
    sub: { color: colors.muted, fontSize: 13, lineHeight: 19, marginBottom: 20 },
    textArea: { minHeight: 110, textAlignVertical: 'top', paddingTop: 12 },
    footer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, borderTopWidth: 1, borderTopColor: colors.border },
  });
}
