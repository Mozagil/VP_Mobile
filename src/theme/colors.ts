// Legacy static import — kept only as a fallback for anything not yet migrated
// to useTheme(). New code should use `const { colors } = useTheme();` so it
// reacts live to the Aydınlık/Karanlık mod switch in Ayarlar.
export { darkColors as colors } from './palettes';
export * from './palettes';
