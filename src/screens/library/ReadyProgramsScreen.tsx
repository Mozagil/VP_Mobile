import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n, useContent } from '../../i18n';
import { READY_PROGRAMS } from '../../data/readyPrograms';
import Icon from '../../components/ui/Icon';

type Props = { navigation: NativeStackNavigationProp<any> };

export default function ReadyProgramsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { programTitle, programDesc } = useContent();
  const s = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('library.readyProgramsTitle')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <Text style={s.sub}>{t('library.readyProgramsSub')}</Text>

        {READY_PROGRAMS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={s.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ReadyProgramDetail', { programKey: p.key })}
          >
            <View style={s.cardIcon}>
              <Icon name="antrenmanlar" size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{programTitle(p)}</Text>
              <Text style={s.cardDesc}>{programDesc(p)}</Text>
              <Text style={s.cardMeta}>{t('library.programDuration')}</Text>
            </View>
            <Text style={s.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    sub: { color: colors.muted, fontSize: 13, lineHeight: 19, marginBottom: 16 },
    card: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 12,
      borderWidth: 1, borderColor: colors.border,
    },
    cardIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accent + '20', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 3 },
    cardDesc: { color: colors.muted, fontSize: 12, lineHeight: 17, marginBottom: 4 },
    cardMeta: { color: colors.accent, fontSize: 11, fontWeight: '700' },
    arrow: { color: colors.muted, fontSize: 22 },
  });
}
