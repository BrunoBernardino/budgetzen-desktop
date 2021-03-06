import React, { Component } from 'react';
import { IonIcon, addIcons } from 'react-svg-ionicons';
import styled from 'styled-components';
import settings from 'react-svg-ionicons/icons/settings';
import options from 'react-svg-ionicons/icons/options';
import arrowBack from 'react-svg-ionicons/icons/arrow-back';
import arrowForward from 'react-svg-ionicons/icons/arrow-forward';

interface IconButtonProps {
  icon: 'settings' | 'options' | 'arrow-back' | 'arrow-forward';
  size: number;
  color: string;
  onClick: () => void;
  className?: string;
}
interface IconButtonState {}

const bundle = {
  settings,
  options,
  'arrow-back': arrowBack,
  'arrow-forward': arrowForward,
};
addIcons(bundle);

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  outline: none;

  &:hover,
  &:focus,
  &:active {
    opacity: 0.6;
  }
`;

class IconButton extends Component<IconButtonProps, IconButtonState> {
  onClick = () => {
    this.props.onClick();
  };

  render() {
    const { icon, size, color, className } = this.props;
    return (
      <Container className={className}>
        <Button onClick={this.onClick}>
          <IonIcon name={icon} size={size} color={color} mode="ios" />
        </Button>
      </Container>
    );
  }
}

export default IconButton;
