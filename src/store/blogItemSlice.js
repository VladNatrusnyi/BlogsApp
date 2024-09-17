
import {createSlice} from "@reduxjs/toolkit";



export const emptyInitialStateForBlogItemSlice = {
    openedBlogId: null,
}

const initialState = emptyInitialStateForBlogItemSlice

export const blogItemSlice = createSlice({
    name: 'blogItem',
    initialState,
    reducers: {

        setOpenedBlogId(state, action) {
            state.openedBlogId = action.payload
        },
    },
})


export const {
    setOpenedBlogId,
} = blogItemSlice.actions

export default blogItemSlice.reducer