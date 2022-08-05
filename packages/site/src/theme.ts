import { createGlobalStyle, DefaultTheme } from 'styled-components';

const breakpoints = ['40em', '52em', '64em'];

const theme = {
  fonts: {
    default:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    code: 'ui-monospace,Menlo,Monaco,"Cascadia Mono","Segoe UI Mono","Roboto Mono","Oxygen Mono","Ubuntu Monospace","Source Code Pro","Fira Mono","Droid Sans Mono","Courier New", monospace',
  },
  fontSizes: {
    heading: '52px',
    title: '24px',
    large: '20px',
    default: '16px',
    small: '14px',
  },
  radii: {
    default: '24px',
    button: '8px',
  },
  breakpoints,
  mediaQueries: {
    small: `@media screen and (min-width: ${breakpoints[0]})`,
    medium: `@media screen and (min-width: ${breakpoints[1]})`,
    large: `@media screen and (min-width: ${breakpoints[2]})`,
  },
  shadows: {
    default: '0px 7px 42px rgba(0, 0, 0, 0.1)',
    button: '0px 0px 16.1786px rgba(0, 0, 0, 0.15);',
  },
};

export const light: DefaultTheme = {
  colors: {
    background: {
      default: '#FFFFFF',
      alternative: '#F2F4F6',
      inverse: '#141618',
    },
    icon: {
      default: '#141618',
      alternative: '#BBC0C5',
    },
    text: {
      default: '#24272A',
      muted: '#6A737D',
      alternative: '#535A61',
      inverse: '#FFFFFF',
    },
    border: {
      default: '#BBC0C5',
    },
    primary: {
      default: '#6F4CFF',
      inverse: '#FFFFFF',
    },
    card: {
      default: '#FFFFFF',
    },
    error: {
      default: '#d73a49',
      alternative: '#b92534',
      muted: '#d73a4919',
    },
  },
  ...theme,
};

export const dark: DefaultTheme = {
  colors: {
    background: {
      default: '#24272A',
      alternative: '#141618',
      inverse: '#FFFFFF',
    },
    icon: {
      default: '#FFFFFF',
      alternative: '#BBC0C5',
    },
    text: {
      default: '#FFFFFF',
      muted: '#FFFFFF',
      alternative: '#D6D9DC',
      inverse: '#24272A',
    },
    border: {
      default: '#848C96',
    },
    primary: {
      default: '#6F4CFF',
      inverse: '#FFFFFF',
    },
    card: {
      default: '#141618',
    },
    error: {
      default: '#d73a49',
      alternative: '#b92534',
      muted: '#d73a4919',
    },
  },
  ...theme,
};

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.background.default};
    color: ${(props) => props.theme.colors.text.default};
    font-family: ${(props) => props.theme.fonts.default};
    font-size: ${(props) => props.theme.fontSizes.default};
    margin: 0;
  }

  * {
    transition: background-color .1s linear;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: ${(props) => props.theme.fontSizes.heading};
  }

  code {
    background-color: ${(props) => props.theme.colors.background.alternative};
    font-family: ${(props) => props.theme.fonts.code};
    padding: 12px;
    font-weight: normal;
    font-size: ${(props) => props.theme.fontSizes.default};
  }

  button {
    font-size: ${(props) => props.theme.fontSizes.small};
    border-radius: ${(props) => props.theme.radii.button};
    background-color: ${(props) => props.theme.colors.background.inverse};
    color: ${(props) => props.theme.colors.text.inverse};
    border: 1px solid ${(props) => props.theme.colors.background.inverse};
    font-weight: bold;
    padding: 10px;
    min-height: 42px;
    cursor: pointer;
    transition: all .2s ease-in-out;

    &:hover {
      background-color: transparent;
      border: 1px solid ${(props) => props.theme.colors.background.inverse};
      color: ${(props) => props.theme.colors.text.default};
    }

    &:disabled,
    &[disabled] {
      border: 1px solid ${(props) => props.theme.colors.background.inverse};
      cursor: not-allowed;
    }

    &:disabled:hover,
    &[disabled]:hover {
      background-color: ${(props) => props.theme.colors.background.inverse};
      color: ${(props) => props.theme.colors.text.inverse};
      border: 1px solid ${(props) => props.theme.colors.background.inverse};
    }
  }
`;
