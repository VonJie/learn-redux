### `Parcel`
Web 应用打包工具，零配置。
```bash
yarn add parcel-bundler --dev

parcel index.html

parcel build index.html
```

### Redux
是 JavaScript 状态容器，提供可预测化的状态管理。在 Redux 应用中，所有的 state 都被保存在一个单一对象中。
#### Action
是把数据从应用传到 `store` 的有效载荷。它是 store 数据的唯一来源。一般来说你会通过 `store.dispatch()` 将 action 传到 store。
```javascript
const addTodo = text => ({
	type: 'ADD_TODO',
	id: nextTodoId++,
	text
})

const toggleTodo = id => ({
	type: 'TOGGLE_TODO',
	id
})

export default {
	addTodo,
	toggleTodo
}
```
#### Reducer
指定了应用状态的变化如何响应 actions 并发送到 store 的，记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。
reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。
之所以将这样的函数称之为reducer，是因为这种函数与被传入 Array.prototype.reduce(reducer, ?initialValue) 里的回调函数属于相同的类型。保持 reducer 纯净非常重要。
只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。
```javascript
const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				{
					id: action.id,
					text: action.text,
					completed: false
				}
			];
		case 'TOGGLE_TODO':
			return state.map(todo => 
				todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
			)
		default:
			return state;
	}
}

export default todos;
```
##### combineReducers
所做的只是生成一个函数，这个函数来调用你的一系列 reducer，每个 reducer 根据它们的 key 来筛选出 state 中的一部分数据并处理，然后这个生成的函数再将所有 reducer 的结果合并成一个大的对象
```javascript
import { combineReducers } from 'redux';

import todos from './todos';
import visibilityFilter from './visibilityFilter';

export default combineReducers({
	todos,
	visibilityFilter
})
```
等价于
```javascript
export default function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```
#### Store
- 维持应用的 state；
提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器;
- 通过 subscribe(listener) 返回的函数注销监听器。
##### createStore
```javascript
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```
```javascript
mport {
  addTodo,
  toggleTodo,
  setVisibilityFilter,
  VisibilityFilters
} from './actions'

// 打印初始状态
console.log(store.getState())

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// 发起一系列 action
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// 停止监听 state 更新
unsubscribe();
````
###  React Redux
Redux 默认并不包含 React 绑定库，需要单独安装。
#### Provider
React-Redux 提供Provider组件，可以让容器组件拿到state。
它的原理是React组件的[context](https://reactjs.org/docs/context.html)属性，请看源码。
```javasctipy
// 父组件
class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}

// 子组件
Provider.childContextTypes = {
  store: React.PropTypes.object
}

class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();
    // ...
  }
}

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
}
```
#### connect
`connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)`
``` javascript
// do not pass `mapDispatchToProps`
connect()(MyComponent)
connect(mapState)(MyComponent)
connect(
  mapState,
  null,
  mergeProps,
  options
)(MyComponent)
```
##### mapStateToProps
`mapStateToProps?: (state, ownProps?) => Object` 来指定如何把当前 `Redux store state` 映射到展示组件的 props 中
```javascript
const mapStateToProps = (state, ownProps) => ({
  todo: state.todos[ownProps.id]
})
```
##### mapDispatchToProps
`mapDispatchToProps?: Object | (dispatch, ownProps?) => Object` 放法接收 `dispatch()` 方法并返回期望注入到展示组件的 props 中的回调方法
```javascript
// default
{ ...ownProps, ...stateProps, ...dispatchProps }
```
##### options
`options?: Object`
```javascript
{
  context?: Object,
  pure?: boolean,
  areStatesEqual?: Function,
  areOwnPropsEqual?: Function,
  areStatePropsEqual?: Function,
  areMergedPropsEqual?: Function,
  forwardRef?: boolean,
}
```
```javascript
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' })
  }
}
```
##### mergeProps
`mergeProps?: (stateProps, dispatchProps, ownProps) => Object`
```javascript
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)

export default FilterLink
```
