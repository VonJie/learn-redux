import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { addTodo, toggleTodo, VisibilityFilters, setVisibilityFilter } from '../../redux/actions/';

export default class Index extends Component {
	render() {
		return (
			<div>
				<AddTodo />
				<VisibleTodoList />
				<Footer />
			</div>
		)
	}
}

// 新增
let AddTodo = ({ dispatch }) => {
  let input
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(addTodo(input.value))
          input.value = ''
        }}
      >
        <input ref={node => (input = node)} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  )
}
AddTodo = connect()(AddTodo);

// 代办
const Todo = ({ onClick, completed, text }) => (
	<li
		onClick={onClick}
		style={{
			textDecoration: completed ? 'line-through' : 'none',
			cursor: 'pointer'
		}}
	>
		{text}
	</li>
)
Todo.propTypes = {
	onClick: PropTypes.func.isRequired,
	completed: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired
}

// 列表
const TodoList = ({ todos, toggleTodo }) => (
  <ul>
    {todos.map(todo => (
      <Todo key={todo.id} {...todo} onClick={() => toggleTodo(todo.id)} />
    ))}
  </ul>
)
TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  toggleTodo: PropTypes.func.isRequired
}
// 列表-条件筛选
const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case VisibilityFilters.SHOW_ALL:
			return todos
		case VisibilityFilters.SHOW_COMPLETED:
			return todos.filter(t => t.completed)
		case VisibilityFilters.SHOW_ACTIVE:
			return todos.filter(t => !t.completed)
		default:
			throw new Error('Unknown Filter: ' + filter)
	}
}
const mapStateToPropsTodoList = state => ({
	todos: getVisibleTodos(state.todos, state.visibilityFilter)
})
const mapDispatchToPropsTodoList = dispatch => ({
	toggleTodo: id => dispatch(toggleTodo(id))
})
const VisibleTodoList = connect(
	mapStateToPropsTodoList,
	mapDispatchToPropsTodoList
)(TodoList)

// 条件筛选按钮
const Link = ({ active, children, onClick }) => (
	<button
		onClick={onClick}
		disabled={active}
		style={{
			marginLeft: '4px'
		}}
	>
	 {children}
  </button>
)
Link.propTypes = {
	active: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func.isRequired
}
const mapStateToPropsLink = (state, ownProps) => ({
	active: ownProps.filter === state.visibilityFilter
})
const mapDispatchToPropsLink = (dispatch, ownProps) => ({
	onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
})
const FilterLink = connect(
	mapStateToPropsLink,
	mapDispatchToPropsLink
)(Link)

const Footer = () => (
	<div>
		<span>Show: </span>
		<FilterLink filter={VisibilityFilters.SHOW_ALL}>All</FilterLink>
		<FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>Active</FilterLink>
		<FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>Completed</FilterLink>
	</div>
)
















