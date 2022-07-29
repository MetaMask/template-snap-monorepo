import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Footer, Header } from './components';
import { MetaMaskProvider } from './hooks';

import { light, dark, GlobalStyle } from './theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const SHeading = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: 20px;
  font-weight: 500;
`;

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  return (
    <ThemeProvider theme={darkTheme ? dark : light}>
      <MetaMaskProvider>
        <GlobalStyle />
        <Wrapper>
          <Header />
          <Container>
            <h1>
              Welcome to <SHeading>template-snaps</SHeading>
            </h1>
            <Subtitle>
              Get started by editing <code>src/index.js</code>
            </Subtitle>
            <input type="checkbox" onChange={() => setDarkTheme(!darkTheme)} />
          </Container>
          <Footer />
        </Wrapper>
      </MetaMaskProvider>
    </ThemeProvider>
  );
}

export default App;
