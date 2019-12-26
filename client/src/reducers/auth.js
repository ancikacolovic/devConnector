import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    LOGOUT,
    ACOUNT_DELETED
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'), // token that we get back; its going to be stored to localstorage
    isAuthenticated: null,
    loading: true, // we want to make sure that the loading is done; that we alerady made the request to DB and got the response; false means that is loaded
    user: null // user data from the DB
}

export default function(state = initialState, action) {

    const {type, payload } = action;

    switch(type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case LOGOUT: 
        case ACOUNT_DELETED:   
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state;

    }
}