import {combineReducers, configureStore} from '@reduxjs/toolkit'
import registerReducer from './registerSlice'
import themeReducer from './themeSlice'
import blogsReducer from './blogsSlice'
import blogItemReducer from './blogItemSlice'

import {setupListeners} from "@reduxjs/toolkit/query";



export const USER_LOGOUT_FROM_APP = '@@logout/USER_LOGOUT_FROM_APP'

const combinedReducer = combineReducers({
    register: registerReducer,
    theme: themeReducer,
    blogs: blogsReducer,
    blogItem: blogItemReducer,
});

const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT_FROM_APP) {
        state = undefined;
    }
    return combinedReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        })
})

setupListeners(store.dispatch)