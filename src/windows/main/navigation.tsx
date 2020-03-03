import React from 'react';
import styled from 'styled-components';

import MonthNavigation from '../../components/MonthNavigation';

import * as T from '../../lib/types';

interface NavigationProps extends T.WrappedComponentProps {}

const Container = styled.section`
  display: block;
  overflow: auto;
`;

const Navigation = ({ changeMonthInView, monthInView }: NavigationProps) => {
  return (
    <Container>
      <MonthNavigation
        currentMonth={monthInView}
        handleChangeMonth={changeMonthInView}
      />
    </Container>
  );
};

export default Navigation;
