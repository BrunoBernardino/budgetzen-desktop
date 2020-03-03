import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '../../components/Button';
import { colors, fontSizes } from '../../lib/constants';
import LogoImage from '../../assets/logo.png';

import * as T from '../../lib/types';

interface AddExpenseProps extends T.WrappedComponentProps {}
interface AddExpenseState {
  isSubmitting: boolean;
  cost: string;
  description: string;
  budget: string;
  date: string;
}

// TODO: Get these colors from the withLayout, according to the light/dark mode
const Container = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${colors().background};
  padding: 0 16px;
  max-width: 280px;
  border-radius: 5px;
  margin-top: -10px;
  margin-right: -2px;
`;

const Logo = styled.img`
  margin-top: 10px;
  margin-bottom: -20px;
  height: 50px;
  resize-mode: contain;
  align-self: center;
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

const AddButton = styled(Button)`
  margin: 20px 0;
`;

class AddExpense extends Component<AddExpenseProps, AddExpenseState> {
  constructor(props: AddExpenseProps) {
    super(props);

    this.state = {
      isSubmitting: false,
      cost: '',
      description: '',
      budget: '',
      date: '',
    };
  }

  addExpense = async () => {
    const { saveExpense, showNotification } = this.props;
    const { isSubmitting, cost, description, budget, date } = this.state;

    if (isSubmitting) {
      // Ignore sequential clicks
      return;
    }

    this.setState({ isSubmitting: true });

    const parsedExpense: T.Expense = {
      id: 'newExpense',
      cost: Number.parseFloat(cost.replace(',', '.')),
      description,
      budget,
      date,
    };

    const success = await saveExpense(parsedExpense);

    this.setState({ isSubmitting: false });

    if (success) {
      this.setState({ cost: '', description: '', budget: '', date: '' });
      showNotification('Expense added successfully.');
    }
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.addExpense();
    }
  };

  render() {
    const { budgets } = this.props;
    const { cost, description, budget, date } = this.state;

    const budgetsToShow = [...budgets];

    if (budgetsToShow.length === 0) {
      // Only the name matters/is used below
      budgetsToShow.push({
        id: 'fake',
        name: 'Misc',
        month: '',
        value: 0,
      });
    }

    return (
      <Container>
        <Logo src={LogoImage} alt="Budgets, Calm." />
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
            this.setState({ budget: budgets[event.target.selectedIndex].name })
          }
          value={budget || 'Misc'}
        >
          {budgetsToShow.map((budgetOption: T.Budget) => (
            <option key={budgetOption.id} value={budgetOption.name}>
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
        <AddButton
          onClick={() => this.addExpense()}
          text="Add Expense"
          type="primary"
        />
      </Container>
    );
  }
}

export default AddExpense;
