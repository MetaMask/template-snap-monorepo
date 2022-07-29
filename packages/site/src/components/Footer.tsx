import styled from 'styled-components';

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  padding-bottom: 50px;
  border-top: 1px solid ${(props) => props.theme.colors.border.default};
`;

export const Footer = () => (
  <FooterWrapper>
    <p>Text</p>
  </FooterWrapper>
);
