import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_REPOS } from "../actions/types";

const initialState = {
    profile: null, // profile will hold the profile data that we get from the request; also if we visit another users profile page it will be placed here
    profiles: [], // this is for the profile listing page
    repos: [], // git hub repos
    loading: true, // the same as for user
    error: {} // error object
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading:false,
                profile: null
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            };
        case GET_REPOS: 
            return {
                ...state,
                repos: payload,
                loading: false
            }
        default:
            return state;
    }
}