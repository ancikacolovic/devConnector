import axios from 'axios';


// Here we are adding a global header

const setAuthToken = token => {
    if(token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        // if wthat we pass is not a token we delete it
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;