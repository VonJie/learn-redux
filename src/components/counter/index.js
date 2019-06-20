import React, { Component } from 'react';
import { connect} from 'react-redux'
import { createStore } from 'redux';
import PropTypes from 'prop-types';

import { incrementCount, decrementCount } from '../../redux/actions';

class Index extends Component {
	render() {
		let { count, dispatch } = this.props;
		return (
			<div>
	      Clicked: <span id="value">{count}</span> times
	      <button onClick={() => dispatch(incrementCount())}>+</button>
	      <button onClick={() => dispatch(decrementCount())}>-</button>
	    </div>
		)
	}
}
Index.propTypes = {
	count: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
		count: state.counter
})

export default connect(
	mapStateToProps
)(Index);