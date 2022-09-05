import styled, { useTheme } from 'styled-components';
import { ReactComponent as MetaMaskFox } from '../assets/metamask_fox.svg';
import { MetaMask } from './MetaMask';
import { PoweredBy } from './PoweredBy';

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-top: 1px solid ${(props) => props.theme.colors.border.default};
`;

const PoweredByButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.button};
  box-shadow: ${({ theme }) => theme.shadows.button};
  background-color: ${({ theme }) => theme.colors.background.alternative};
`;

const PoweredByContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.625rem;
`;

export const Footer = () => {
  const theme = useTheme();

  return (
    <FooterWrapper>
      <PoweredByButton href="https://docs.metamask.io/" target="_blank">
        <MetaMaskFox />
        <PoweredByContainer>
          <PoweredBy color={theme.colors.text.muted} />
          <MetaMask color={theme.colors.text.default} />
        </PoweredByContainer>
      </PoweredByButton>
    </FooterWrapper>
  );
};
