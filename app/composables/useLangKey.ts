export function useLangKey() {
  const lang = useCurrentLang()

  return computed(() =>
    lang.value === 'en' ? 'nameEn' : 'nameKh',
  );
}
