import React from 'react';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from './store';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import constants from './constants/constants'

import MainWrapper from './pages/MainWrapper';

import './App.css';

const history = createBrowserHistory();
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: constants.radar_backend,
})

export const App = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <ApolloProvider client={client}>
          <MainWrapper />
        </ApolloProvider>
      </Router>
    </Provider>
  );
};

export default App;


// import React from 'react';
// import { createBrowserHistory } from 'history';
// import { Provider } from 'react-redux';
// import { Router } from 'react-router';
// import { store } from './store';


// import MainWrapper from './pages/MainWrapper';

// import './App.css';

// const history = createBrowserHistory();

// export const App = () => {
// 	return (
// 		<Provider store={store}>
// 			<Router history={history}>
// 				<MainWrapper />
// 			</Router>
// 		</Provider>
// 	);
// };

// export default App;
