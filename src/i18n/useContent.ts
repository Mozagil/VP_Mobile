import { useMemo } from 'react';
import { useI18n } from './LanguageContext';
import { DRILL_EN } from '../data/drillsEn';
import { MODULE_EN } from '../data/modulesEn';
import type { Drill } from '../data/types';
import type { Module } from '../data/modules';
import type { ReadyProgram } from '../data/readyPrograms';

/**
 * Reader-facing text for the content records (drills, modules, ready programs).
 *
 * The Turkish records stay canonical everywhere — ids, phase, skill and level
 * never change with the language, so filters, favorites and anything already
 * saved on the server keep working. Only what the user reads is swapped.
 *
 * `localizeDrill` returns a copy with the text fields replaced, which is handy
 * when a drill is handed to a component (or a navigation param) that reads
 * `.name`/`.desc` directly.
 */
export function useContent() {
  const { lang } = useI18n();

  return useMemo(() => {
    const isEn = lang === 'en';

    const drillName = (d: Drill) => (isEn && DRILL_EN[d.id]?.name) || d.name;
    const drillDesc = (d: Drill) => (isEn && DRILL_EN[d.id]?.desc) || d.desc;
    const drillTags = (d: Drill) => (isEn && DRILL_EN[d.id]?.tags) || d.tags;

    /** Look up a drill name by id — for plan rows that only store `drill_id`. */
    const drillNameById = (id: number, fallback: string) =>
      (isEn && DRILL_EN[id]?.name) || fallback;

    const localizeDrill = (d: Drill): Drill =>
      isEn && DRILL_EN[d.id]
        ? { ...d, name: DRILL_EN[d.id].name, desc: DRILL_EN[d.id].desc, tags: DRILL_EN[d.id].tags }
        : d;

    const moduleTitle = (m: Module) => (isEn && MODULE_EN[m.id]?.title) || m.title;
    const moduleDesc = (m: Module) => (isEn && MODULE_EN[m.id]?.desc) || m.desc;
    const moduleDuration = (m: Module) => (isEn && MODULE_EN[m.id]?.duration) || m.duration;
    const moduleExercises = (m: Module) => (isEn && MODULE_EN[m.id]?.exercises) || m.exercises;
    const moduleTips = (m: Module) => (isEn && MODULE_EN[m.id]?.tips) || m.tips;

    const programTitle = (p: ReadyProgram) => (isEn && p.titleEn) || p.title;
    const programDesc = (p: ReadyProgram) => (isEn && p.descEn) || p.desc;

    return {
      drillName, drillDesc, drillTags, drillNameById, localizeDrill,
      moduleTitle, moduleDesc, moduleDuration, moduleExercises, moduleTips,
      programTitle, programDesc,
    };
  }, [lang]);
}
