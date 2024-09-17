
import {createSlice} from "@reduxjs/toolkit";



export const emptyInitialStateForThemeSlice = {
    theme: 'dark',
}

const initialState = emptyInitialStateForThemeSlice

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {

        setTheme(state, action) {
            state.theme = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setTheme,
} = themeSlice.actions

export default themeSlice.reducer