import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';

import IconButton from './IconButton';
import { colors } from '../lib/constants';

interface MonthNavigationProps {
  currentMonth: string;
  handleChangeMonth: (newMonth: string) => void;
}
interface MonthNavigationState {}

// TODO: Dark mode y'all
const Container = styled.section`
  display: flex;
  margin-top: 20;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;
const Text = styled.span`
  color: ${colors().inputLabel};
  width: 70%;
  padding: 0 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

class MonthNavigation extends Component<
  MonthNavigationProps,
  MonthNavigationState
> {
  goBack = () => {
    const { currentMonth } = this.props;
    const previousMonth = moment(currentMonth, 'YYYY-MM')
      .subtract(1, 'month')
      .format('YYYY-MM');
    this.props.handleChangeMonth(previousMonth);
  };

  goForward = () => {
    const { currentMonth } = this.props;
    const nextMonth = moment(currentMonth, 'YYYY-MM')
      .add(1, 'month')
      .format('YYYY-MM');
    this.props.handleChangeMonth(nextMonth);
  };

  render() {
    const { currentMonth } = this.props;
    return (
      <Container>
        <IconButton
          onClick={this.goBack}
          icon="arrow-back"
          size={32}
          color={colors().inputLabel}
        />
        <Text>{moment(currentMonth, 'YYYY-MM').format('MMMM YYYY')}</Text>
        <IconButton
          onClick={this.goForward}
          icon="arrow-forward"
          size={32}
          color={colors().inputLabel}
        />
      </Container>
    );
  }
}

export default MonthNavigation;
