import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom';

import Counter from './counter';
import Todos from './todos';

export default class App extends Component {
	constructor() {
		super()
	}
	render() {
		return (
			<Router>
				<Header />
				<Route exact path='/' component={Home} />
				<Route path='/counter' component={Counter} />
				<Route path='/todos' component={Todos} />
			</Router>
		)
	}
}

function Home() {
	return <h2>Home</h2>
}

function Header() {
	return (
		<ul>
			<li>
				<Link to='/'>Home</Link>
			</li>
			<li>
				<Link to='/counter'>Counter</Link>
			</li>
			<li>
				<Link to='/todos'>Todos</Link>
			</li>
		</ul>
	)
}