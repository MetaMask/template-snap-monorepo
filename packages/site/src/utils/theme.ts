import { getLocalStorage, setLocalStorage } from './localStorage';

/**
 * Get the user's prefered theme in local storage.
 * Will default to the browser's prefered theme if there is no value in local storage.
 *
 * @returns A string "light" or "dark" depending on the prefered theme.
 */
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
