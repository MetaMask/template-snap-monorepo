import { getLocalStorage, setLocalStorage } from './localStorage';

export const getThemePreference = () => {
  const darkModeSystem = window?.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  const preference = getLocalStorage('theme');

  if (!preference) {
    setLocalStorage('theme', darkModeSystem ? 'dark' : 'light');
  }

  return preference === 'dark';
};
