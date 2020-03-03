import React from 'react';
import ReactDOM from 'react-dom';
import { RxDatabase } from 'rxdb';

import 'rodal/lib/rodal.css';
import 'react-toggle-switch/dist/css/switch.min.css';
import './styles/__base.scss';

import MainWindow from './windows/main';
import { withLayout } from './hocs';

const db: RxDatabase = null;
const sharedOptions = { db };

const App = withLayout(MainWindow, sharedOptions);

ReactDOM.render(<App />, document.getElementById('root'));
