import React from 'react';
import styled from 'styled-components';

interface NotificationProps {
  isShowing?: boolean;
  message: string;
  onClick: () => void;
}

type ContainerProps = {
  isShowing: boolean;
};

// TODO: Get these colors from the withLayout, according to the light/dark mode
const Container = styled.div<ContainerProps>`
  position: absolute;
  top: 0;
  right: 10px;
  padding: 10px 20px;
  display: ${({ isShowing }) => (isShowing ? 'block' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0 0 5px 5px;
  cursor: pointer;
`;

const Text = styled.p`
  font-size: 18px;
  color: #fff;
  text-align: center;
  padding: 6px 12px;
`;

const Notification = (props: NotificationProps) => {
  return (
    <Container isShowing={props.isShowing} onClick={() => props.onClick()}>
      <Text>{props.message}</Text>
    </Container>
  );
};

Notification.defaultProps = {
  isShowing: false,
};

export default Notification;
