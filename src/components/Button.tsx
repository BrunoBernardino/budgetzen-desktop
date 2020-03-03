import React, { Component } from 'react';
import styled from 'styled-components';

import { colors, fontSizes } from '../lib/constants';

type ButtonType = 'primary' | 'secondary' | 'delete';

interface ButtonProps {
  text: string;
  onClick: () => void;
  type: ButtonType;
  className?: string;
}
interface ButtonState {}

const Container = styled.section`
  flex: 1;
`;

type StyledButtonProps = {
  buttonType: ButtonType;
};

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  background-color: ${({ buttonType }) => {
    if (buttonType === 'primary') {
      return colors().primaryButtonBackground;
    }

    if (buttonType === 'delete') {
      return '#930';
    }

    return colors().secondaryButtonBackground;
  }};
  padding: 10px;
  border-radius: 5px;
  min-width: 50%;
  color: ${({ buttonType }) => {
    if (buttonType === 'primary') {
      return colors().primaryButtonText;
    }

    if (buttonType === 'delete') {
      return '#fff';
    }

    return colors().secondaryButtonText;
  }};
  font-size: ${fontSizes.button}px;
  cursor: pointer;
  outline: none;

  &:hover,
  &:focus,
  &:active {
    opacity: 0.6;
  }
`;

class Button extends Component<ButtonProps, ButtonState> {
  onClick = () => {
    this.props.onClick();
  };

  render() {
    const { text, type, className } = this.props;
    return (
      <Container className={className}>
        <StyledButton buttonType={type} onClick={this.onClick}>
          {text}
        </StyledButton>
      </Container>
    );
  }
}

export default Button;
