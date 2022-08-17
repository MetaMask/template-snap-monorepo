import { useContext } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, isSnapInstalled, sendHello } from '../utils';
import { ConnectButton, InstallFlaskButton, SendHelloButton } from './Buttons';
import { Card } from './Card';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 76px;
  margin-bottom: 76px;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 24px;
    padding-right: 24px;
    margin-top: 20px;
    margin-bottom: 20px;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 24px;
  text-align: center;
`;

const SSpan = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.default};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 648px;
  width: 100%;
  height: 100%;
  margin-top: 24px;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 24px;
  margin-top: 24px;
  max-width: 600px;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 12px;
    padding: 16px;
  }
`;

const SError = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 24px;
  margin-bottom: 24px;
  margin-top: 24px;
  max-width: 600px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 16px;
    margin-bottom: 12px;
    margin-top: 12px;
    max-width: 100%;
  }
`;

export const Home = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const snapInstalled = await isSnapInstalled();

      dispatch({
        type: MetamaskActions.SET_INSTALLED,
        payload: snapInstalled,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SET_ERROR, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SET_ERROR, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <SSpan>template-snap</SSpan>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.js</code>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <SError>
            <b>An error appened :</b> {state.error.message}
          </SError>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Short and sweet description of what’s happening when installing. Ipsum dolor sit amet nonconformism idealism, abstraction.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.isSnapInstalled && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Short and sweet description of what’s happening when connect to a snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        <Card
          content={{
            title: 'Send Hello message',
            description:
              'Modernipsum dolor sit amet nonconformism idealism, abstraction.',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.isSnapInstalled}
              />
            ),
          }}
          disabled={!state.isSnapInstalled}
          fullWidth={state.isFlask && state.isSnapInstalled}
        />
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};
