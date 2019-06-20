const incrementCount = () => ({
	type: 'INCREMENT'
})

const decrementCount = () => ({
	type: 'DECREMENT'
})

module.exports = {
	incrementCount,
	decrementCount
}