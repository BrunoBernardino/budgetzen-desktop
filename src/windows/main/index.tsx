import React from 'react';
import styled from 'styled-components';

import Navigation from './navigation';
import Expenses from './expenses';
import Budgets from './budgets';
import AddExpense from './add';
import Settings from './settings';

import * as T from '../../lib/types';

interface MainWindowProps extends T.WrappedComponentProps {}

const Wrapper = styled.main`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
`;

const LeftSide = styled.section`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

const Loading = styled.section`
  display: flex;
  flex: 1;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
`;

const MainWindow = (props: MainWindowProps) => (
  <Wrapper className="wrapper">
    {props.isLoading ? (
      <Loading>Loading...</Loading>
    ) : (
      <>
        <LeftSide>
          <Navigation {...props} />
          <Wrapper>
            <Expenses {...props} />
            <Budgets {...props} />
          </Wrapper>
        </LeftSide>
        <AddExpense {...props} />
        <Settings {...props} />
      </>
    )}
  </Wrapper>
);

export default MainWindow;
