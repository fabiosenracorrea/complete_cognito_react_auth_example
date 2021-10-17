import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 10px 20px;
  margin-bottom: 40px;

  img {
    height: 60px;
  }

  button {
    border-radius: 5px;
    border: none;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    height: 40px;
    width: 120px;
    text-transform: uppercase;
    margin-top: 20px;
    display: grid;
    place-content: center;
  }
`;
