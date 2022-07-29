import styled, { useTheme } from 'styled-components';
import { SnapLogo } from './SnapLogo';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.default};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 12px;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ConnectButton = styled.button`
  background-color: ${(props) => props.theme.colors.background.inverse};
  color: ${(props) => props.theme.colors.text.inverse};
`;

export const Header = () => {
  const theme = useTheme();
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color={theme.colors.icon.default} size={36} />
        <Title>template-snap</Title>
      </LogoWrapper>
      <div>
        <ConnectButton>Connect</ConnectButton>
      </div>
    </HeaderWrapper>
  );
};
