
import {createSlice} from "@reduxjs/toolkit";



export const emptyInitialStateForBlogsSlice = {
    blogsArr: null,
    postsArr: null,
    usersArr: null,

    search: ''
}

const initialState = emptyInitialStateForBlogsSlice

export const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {

        setBlogsArr(state, action) {
            state.blogsArr = action.payload
        },

        setPostsArr(state, action) {
            state.postsArr = action.payload
        },

        setUsersArr(state, action) {
            state.usersArr = action.payload
        },

        setSearch(state, action) {
            state.search = action.payload
        },
    },
})


export const {
    setBlogsArr,
    setPostsArr,
    setUsersArr,

    setSearch
} = blogsSlice.actions

export default blogsSlice.reducer