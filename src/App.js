import React from 'react';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from './store';


import MainWrapper from './pages/MainWrapper';

import './App.css';

const history = createBrowserHistory();

export const App = () => {
	return (
		<Provider store={store}>
			<Router history={history}>
				<MainWrapper />
			</Router>
		</Provider>
	);
};

export default App;
