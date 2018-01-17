import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';

//css 
import jquery from 'jquery'

window.jQuery = jquery
window.$ = jquery
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.css'
import './assets/css/sidebar.css'
import './assets/css/tests.css'
import 'react-rangeslider/lib/index.css'

//libraries
import { requireAuth } from './utils/secure';
import * as reducers from './reducers'

// components
import App from './components/App'
import Home from './components/Home'
// import Login from './components/auth/Login'
// import Register from './components/auth/Register'
import Logout from './components/auth/Logout'
import Dashboard from './components/secure/Dashboard'
import Tests from './components/secure/Tests'
import Profile from './components/secure/Profile'
import ViewRecords from './components/secure/ViewRecords'
import CreateForm from './components/secure/CreateForm'

const reducer = combineReducers({
	...reducers,
	routing: routerReducer
});

//noinspection JSUnresolvedVariable
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	reducer,
	composeEnhancers(applyMiddleware(routerMiddleware(browserHistory)))
);

const history = syncHistoryWithStore(browserHistory, store);

const secure = requireAuth(store);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<Route path='/' component={App}>
				<IndexRoute component={Home}/>
				<Route path='login' component={Home}/>
				<Route path='register' component={Home}/>
				<Route path='logout' component={Logout}/>
				<Route path='dashboard' component={Dashboard} onEnter={secure}/>
				<Route path='test/:id' component={Tests} onEnter={secure}/>
				<Route path='profile' component={Profile} onEnter={secure}/>
				<Route path='viewrecords' component={ViewRecords} onEnter={secure}/>
				<Route path='createform' component={CreateForm} onEnter={secure}/>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);