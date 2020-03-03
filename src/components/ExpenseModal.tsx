import React, { Component } from 'react';
import styled from 'styled-components';
import Rodal from 'rodal';
import { remote } from 'electron';

import Button from './Button';
import { colors, fontSizes } from '../lib/constants';

import * as T from '../lib/types';

interface ExpenseModalProps extends T.WrappedComponentProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  cost: number;
  description: string;
  budget: string;
  date: string;
}
interface ExpenseModalState {
  isSubmitting: boolean;
  cost: string;
  description: string;
  budget: string;
  date: string;
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

const Select = styled.select`
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

class ExpenseModal extends Component<ExpenseModalProps, ExpenseModalState> {
  constructor(props: ExpenseModalProps) {
    super(props);

    this.state = {
      isSubmitting: false,
      description: '',
      cost: '',
      budget: '',
      date: '',
    };
  }

  componentDidMount() {
    const { description, cost, budget, date } = this.props;

    this.setState({
      description,
      cost: cost.toString(),
      budget,
      date,
    });
  }

  addExpense = async () => {
    const { saveExpense, showNotification, id } = this.props;
    const { isSubmitting, description, cost, budget, date } = this.state;

    if (isSubmitting) {
      // Ignore sequential clicks
      return;
    }

    this.setState({ isSubmitting: true });

    const parsedExpense: T.Expense = {
      id: id || 'newExpense',
      description,
      cost: Number.parseFloat(cost.replace(',', '.')),
      budget,
      date,
    };

    const success = await saveExpense(parsedExpense);

    this.setState({ isSubmitting: false });

    if (success) {
      showNotification(`Expense ${id ? 'updated' : 'added'} successfully.`);
      this.onClose();
    }
  };

  deleteExpense = async () => {
    const { deleteExpense, showNotification, id } = this.props;
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
        'Are you sure you want to delete this expense?\n\nThis action is irreversible.',
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

    const success = await deleteExpense(id);

    this.setState({ isSubmitting: false });

    if (success) {
      showNotification('Expense deleted successfully.');
      this.onClose();
    }
  };

  onClose = () => {
    const { onClose } = this.props;
    this.setState({ description: '', cost: '', budget: '', date: '' });
    onClose();
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.addExpense();
    }
  };

  render() {
    const { id, isOpen, budgets } = this.props;
    const { description, cost, budget, date } = this.state;
    return (
      <Rodal visible={isOpen} onClose={this.onClose} animation="slideDown">
        <Container>
          <Label>Cost</Label>
          <Input
            placeholder="10.99"
            onChange={(event) => this.setState({ cost: event.target.value })}
            value={cost}
            autoComplete="off"
            type="number"
            inputMode="decimal"
            onKeyDown={this.onKeyDown}
          />

          <Label>Description</Label>
          <Input
            placeholder="Lunch"
            onChange={(event) =>
              this.setState({ description: event.target.value })
            }
            value={description}
            autoComplete="off"
            type="text"
            onKeyDown={this.onKeyDown}
          />

          <Label>Budget</Label>
          <Select
            placeholder="Misc"
            onChange={(event) =>
              this.setState({
                budget: budgets[event.target.selectedIndex].name,
              })
            }
            value={budget || 'Misc'}
          >
            {budgets.map((budgetOption: T.Budget) => (
              <option key={budgetOption.name} value={budgetOption.name}>
                {budgetOption.name}
              </option>
            ))}
          </Select>

          <Label>Date</Label>
          <Input
            placeholder="Today"
            onChange={(event) => this.setState({ date: event.target.value })}
            value={date}
            autoComplete="off"
            type="date"
            onKeyDown={this.onKeyDown}
          />

          <StyledButton
            onClick={() => this.addExpense()}
            text={id ? 'Save Expense' : 'Add Expense'}
            type="primary"
          />

          {Boolean(id) && (
            <StyledButton
              onClick={() => this.deleteExpense()}
              text="Delete Expense"
              type="delete"
            />
          )}
        </Container>
      </Rodal>
    );
  }
}

export default ExpenseModal;
