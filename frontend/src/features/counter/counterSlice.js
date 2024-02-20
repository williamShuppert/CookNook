import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0
    },
    // Redux actions and state should only contain plain JS values like objects, arrays, and primitives. Don't put class instances, functions, or other non-serializable values into Redux
    reducers: { // Also, reducers can NOT use async logic or random values, this will cause "side effects"
        increment: state => {state.value += 1},
        decrement: state => {state.value -= 1},
        incrementByAmount: (state, amount) => {state.value += amount},
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

/* the increment action creator above is equivalent to the following:
const increment = (payload) => ({
    type: 'counter/increment',
    payload
})
*/

export default counterSlice.reducer