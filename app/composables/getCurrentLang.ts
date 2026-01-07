export const useCurrentLang = () => {
  const { locale } = useI18n();
  return computed(() => locale.value || 'en');
};
