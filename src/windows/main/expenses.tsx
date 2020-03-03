import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Expense from '../../components/Expense';
import ExpenseModal from '../../components/ExpenseModal';
import FilterBudgetModal from '../../components/FilterBudgetModal';
import IconButton from '../../components/IconButton';
import { colors, fontSizes } from '../../lib/constants';

import * as T from '../../lib/types';

interface ExpensesProps extends T.WrappedComponentProps {
  currency: string;
}
interface ExpensesState {
  filterExpenseDescription: string;
  filterBudgets: Set<string>;
  isExpenseModalOpen: boolean;
  isFilterBudgetsModalOpen: boolean;
  chosenExpense: {
    id: string;
    cost: number;
    description: string;
    budget: string;
    date: string;
  };
}

const Container = styled.section`
  display: flex;
  overflow: auto;
  max-height: 80vh;
  flex-direction: column;
  flex: 1;
`;

const FiltersContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto 40px;
`;

const SearchInput = styled.input`
  color: ${colors().inputField};
  font-size: ${fontSizes.text}px;
  font-weight: normal;
  text-align: left;
  border: 1px solid ${colors().secondaryBackground};
  border-radius: 50px;
  padding: 10px 10px 10px 15px;
  flex: 1;
  min-width: 75%;
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

const NoExpensesFoundText = styled.p`
  color: ${colors().secondaryText};
  text-align: center;
  align-items: center;
  flex: 1;
  display: flex;
  font-size: ${fontSizes.text}px;
`;

type NoExpensesFoundProps = {
  hasFiltersOrSearch: boolean;
};

const NoExpensesFound = (props: NoExpensesFoundProps) => {
  return (
    <>
      {props.hasFiltersOrSearch ? (
        <NoExpensesFoundText>
          No expenses found matching those filters.{'\n'}Try changing them!
        </NoExpensesFoundText>
      ) : (
        <NoExpensesFoundText>
          No expenses found for this month.{'\n'}Go add one!
        </NoExpensesFoundText>
      )}
    </>
  );
};

const defaultExpense = {
  id: '',
  cost: 0,
  description: '',
  budget: '',
  date: moment().format('YYYY-MM-DD'),
};

class Expenses extends Component<ExpensesProps, ExpensesState> {
  constructor(props: ExpensesProps) {
    super(props);

    this.state = {
      filterExpenseDescription: '',
      filterBudgets: new Set(),
      isExpenseModalOpen: false,
      isFilterBudgetsModalOpen: false,
      chosenExpense: {
        ...defaultExpense,
      },
    };
  }

  openExpenseModal = (expense: T.Expense) => {
    this.setState({
      isExpenseModalOpen: true,
      chosenExpense: { ...expense },
    });
  };

  closeExpenseModal = () => {
    this.setState({
      isExpenseModalOpen: false,
      chosenExpense: { ...defaultExpense },
    });
  };

  render() {
    const { expenses, budgets, currency } = this.props;
    const {
      filterExpenseDescription,
      filterBudgets,
      isExpenseModalOpen,
      isFilterBudgetsModalOpen,
      chosenExpense,
    } = this.state;

    let expensesToShow = expenses;

    if (filterExpenseDescription) {
      expensesToShow = expensesToShow.filter((expense) =>
        expense.description
          .toLowerCase()
          .includes(filterExpenseDescription.toLowerCase()),
      );
    }

    if (filterBudgets.size > 0) {
      expensesToShow = expensesToShow.filter((expense) =>
        filterBudgets.has(expense.budget),
      );
    }

    return (
      <Container>
        <FiltersContainer>
          <SearchInput
            type="search"
            placeholder="Search for an expense"
            onChange={(event) =>
              this.setState({ filterExpenseDescription: event.target.value })
            }
            value={filterExpenseDescription}
            autoComplete="off"
          />
          <IconButton
            icon="options"
            size={32}
            color={
              filterBudgets.size > 0
                ? colors().primaryButtonBackground
                : colors().secondaryButtonBackground
            }
            onClick={() => this.setState({ isFilterBudgetsModalOpen: true })}
          />
        </FiltersContainer>
        {expensesToShow.map((expense) => (
          <Expense
            key={expense.id}
            {...expense}
            currency={currency}
            onClick={() => this.openExpenseModal(expense)}
          />
        ))}
        {expensesToShow.length === 0 && (
          <NoExpensesFound
            hasFiltersOrSearch={
              filterExpenseDescription.length > 0 || filterBudgets.size > 0
            }
          />
        )}
        <ExpenseModal
          {...this.props}
          key={chosenExpense.id}
          isOpen={isExpenseModalOpen}
          onClose={() => this.closeExpenseModal()}
          {...chosenExpense}
        />
        <FilterBudgetModal
          isOpen={isFilterBudgetsModalOpen}
          onClose={() => this.setState({ isFilterBudgetsModalOpen: false })}
          onFilterBudgetToggle={(budgetName, newValue) => {
            const newFilterBudgets = new Set(filterBudgets);
            if (newValue) {
              newFilterBudgets.add(budgetName);
            } else {
              newFilterBudgets.delete(budgetName);
            }

            this.setState({ filterBudgets: newFilterBudgets });
          }}
          budgets={budgets}
          filterBudgets={filterBudgets}
        />
      </Container>
    );
  }
}

export default Expenses;
