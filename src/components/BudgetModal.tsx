import React, { Component } from 'react';
import styled from 'styled-components';
import Rodal from 'rodal';
import { remote } from 'electron';

import Button from './Button';
import { colors, fontSizes } from '../lib/constants';

import * as T from '../lib/types';

interface BudgetModalProps extends T.WrappedComponentProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  month: string;
  value: number;
}
interface BudgetModalState {
  isSubmitting: boolean;
  name: string;
  month: string;
  value: string;
}

// TODO: Dark mode y'all
const Container = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${colors().background};
  padding: 0 16px;
`;

const Label = styled.label`
  color: ${colors().inputLabel};
  font-size: ${fontSizes.inputLabel}px;
  font-weight: bold;
  text-align: left;
  margin-top: 38px;
`;

const Input = styled.input`
  font-family: inherit;
  color: ${colors().inputField};
  font-size: ${fontSizes.inputField}px;
  font-weight: normal;
  text-align: left;
  margin-top: 8px;
  background-color: ${colors().background};
  padding: 5px 8px;
  border: 1px solid ${colors().secondaryBackground};
  border-radius: 5px;
  outline: none;

  &::-webkit-input-placeholder {
    color: ${colors().inputPlaceholder};
  }

  &:hover,
  &:focus,
  &:active {
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  }
`;

const StyledButton = styled(Button)`
  margin: 20px 0;
`;

class BudgetModal extends Component<BudgetModalProps, BudgetModalState> {
  constructor(props: BudgetModalProps) {
    super(props);

    this.state = {
      isSubmitting: false,
      name: '',
      month: '',
      value: '',
    };
  }

  componentDidMount() {
    const { name, month, value } = this.props;

    this.setState({
      name,
      month: `${month}-01`,
      value: value.toString(),
    });
  }

  addBudget = async () => {
    const { saveBudget, showNotification, id } = this.props;
    const { isSubmitting, name, month, value } = this.state;

    if (isSubmitting) {
      // Ignore sequential clicks
      return;
    }

    this.setState({ isSubmitting: true });

    const parsedBudget: T.Budget = {
      id: id || 'newBudget',
      value: Number.parseFloat(value.replace(',', '.')),
      name,
      month: month ? month.substr(0, 7) : '',
    };

    const success = await saveBudget(parsedBudget);

    this.setState({ isSubmitting: false });

    if (success) {
      showNotification(`Budget ${id ? 'updated' : 'added'} successfully.`);
      this.onClose();
    }
  };

  deleteBudget = async () => {
    const { deleteBudget, showNotification, id } = this.props;
    const { isSubmitting } = this.state;

    if (isSubmitting) {
      // Ignore sequential clicks
      return;
    }

    const cancelButtonIndex = 0;
    const confirmButtonIndex = 1;
    const confirmationResult = await remote.dialog.showMessageBox({
      type: 'warning',
      title: 'Are you sure?',
      message:
        'Are you sure you want to delete this budget?\n\nThis action is irreversible.',
      buttons: ['Nope, cancel.', 'Yes!'],
      defaultId: confirmButtonIndex,
      cancelId: cancelButtonIndex,
    });

    if (
      !confirmationResult ||
      confirmationResult.response !== confirmButtonIndex
    ) {
      return;
    }

    this.setState({ isSubmitting: true });

    const success = await deleteBudget(id);

    this.setState({ isSubmitting: false });

    if (success) {
      showNotification('Budget deleted successfully.');
      this.onClose();
    }
  };

  onClose = () => {
    const { onClose } = this.props;
    this.setState({ name: '', month: '', value: '' });
    onClose();
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.addBudget();
    }
  };

  render() {
    const { id, isOpen } = this.props;
    const { name, value, month } = this.state;
    return (
      <Rodal visible={isOpen} onClose={this.onClose} animation="slideDown">
        <Container>
          <Label>Name</Label>
          <Input
            placeholder="Food"
            onChange={(event) => this.setState({ name: event.target.value })}
            value={name}
            autoComplete="off"
            type="text"
            onKeyDown={this.onKeyDown}
          />

          <Label>Value</Label>
          <Input
            placeholder="100"
            onChange={(event) => this.setState({ value: event.target.value })}
            value={value}
            autoComplete="off"
            type="number"
            inputMode="decimal"
            onKeyDown={this.onKeyDown}
          />

          <Label>Month</Label>
          <Input
            onChange={(event) => this.setState({ month: event.target.value })}
            value={month}
            autoComplete="off"
            type="date"
            onKeyDown={this.onKeyDown}
          />

          <StyledButton
            onClick={() => this.addBudget()}
            text={id ? 'Save Budget' : 'Add Budget'}
            type="primary"
          />

          {Boolean(id) && (
            <StyledButton
              onClick={() => this.deleteBudget()}
              text="Delete Budget"
              type="delete"
            />
          )}
        </Container>
      </Rodal>
    );
  }
}

export default BudgetModal;
