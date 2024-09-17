
import {createSlice} from "@reduxjs/toolkit";



export const emptyInitialStateForRegisterSlice = {
    registeredUser: null,
}

const initialState = emptyInitialStateForRegisterSlice

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {

        setRegisteredUser(state, action) {
            state.registeredUser = action.payload
        },

        clearAllFields(state, action) {
            state.registeredUser = null
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setRegisteredUser,
} = registerSlice.actions

export default registerSlice.reducer