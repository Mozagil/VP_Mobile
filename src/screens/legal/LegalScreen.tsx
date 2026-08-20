import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n } from '../../i18n';
import { legalDoc, LegalDocKey } from '../../data/legalTexts';
import Icon from '../../components/ui/Icon';

type LegalStackParamList = { Legal: { doc: LegalDocKey } };
type Props = NativeStackScreenProps<LegalStackParamList, 'Legal'>;

export default function LegalScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const doc = legalDoc(route.params.doc, lang);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{doc.title}</Text>
        <View style={s.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.updated}>{doc.updated}</Text>
        {doc.sections.map((section) => (
          <View key={section.heading} style={s.section}>
            <Text style={s.sectionTitle}>{section.heading}</Text>
            <Text style={s.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },

    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 8,
    },
    iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' },

    scroll: { padding: 16, paddingBottom: 32 },
    updated: { color: colors.muted, fontSize: 12, marginBottom: 14 },

    section: {
      backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
      padding: 14, marginBottom: 10,
    },
    sectionTitle: { color: colors.accent, fontSize: 14, fontWeight: '800', marginBottom: 8 },
    sectionBody: { color: colors.foreground, fontSize: 14, lineHeight: 21 },
  });
}
