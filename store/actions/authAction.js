import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AUTO_LOGIN = "SET_DID_TRY_AUTO_LOGIN";

let timer;

export const setDidTryAutoLogin =()=>{
    return{type: SET_DID_TRY_AUTO_LOGIN};
}; 

export const authenticate = (idToken, userId, expiryTime) => {
    return (
        dispatch=>{
            dispatch(setLogoutTimer(expiryTime));
            dispatch({
                type: AUTHENTICATE,
                idToken: idToken,
                userId: userId,
            });
        }

    )
     
};


export const signup = (userEmail, userPassword) => {
    //console.log(userEmail, userPassword);
    return (
        async dispatch => {
            //this fetch request creates an new user and returns info about the new account
            if (userEmail && userPassword) {
                const response = await fetch(
                  //link removed//check txt file in pc docs///
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: userEmail,
                            password: userPassword,
                            returnSecureToken: true
                        })
                    }
                );


                if (!response.ok) {
                    const responseErrorData = await response.json();
                    const respErrMsg = responseErrorData.error.message;
                    let errMsg;
                    if (respErrMsg === 'EMAIL_EXISTS') {
                        errMsg = 'Email already exits!'
                    } else if (respErrMsg === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                        errMsg = 'Too many attempts, please try again later!'
                    }
                    console.log(errMsg)
                    throw new Error(errMsg);

                }
                //make sure to handle all errors, example: network error
                const responseData = await response.json();
                //console.log(responseData)
                dispatch(authenticate(
                    responseData.idToken, 
                    responseData.localId, 
                    parseInt(responseData.expiresIn)*1000
                ));
                //dispatch({ type: SIGNUP, token: responseData.idToken, userId: responseData.localId });
                const expiryDate = new Date(
                    new Date().getTime() + parseInt(responseData.expiresIn) * 1000
                );
                saveDataToStorage(responseData.idToken, responseData.localId, expiryDate);//just like you stored it in redux store(mem), but here, in the device storage

            } else {
                //console.log('EMPTY FIELDS');
                throw new Error('EMPTY FIELDS');
            }

        });
};

//YOU CAN ALSO CHOOSE TO COMBINE THE TWO ACTION CREATORS INTO JUST ONE ACTION CREATOR(FUNC)
export const login = (userEmail, userPassword) => {
    //console.log(userEmail, userPassword);
    return (
        async dispatch => {
            //this fetch request creates an new user and returns info about the new account
            if (userEmail && userPassword) {
                const response = await fetch(
//link removed//check txt file in pc docs///
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: userEmail,
                            password: userPassword,
                            returnSecureToken: true
                        })
                    }
                );

                if (!response.ok) {
                    const responseErrorData = await response.json();
                    const respErrMsg = responseErrorData.error.message;
                    let errMsg;
                    if (respErrMsg === 'EMAIL_NOT_FOUND') {
                        errMsg = 'Email couldn\'t be found!'
                    } else if (respErrMsg === 'INVALID_PASSWORD') {
                        errMsg = 'Password is incorrect!'
                    }
                    console.log(errMsg)
                    throw new Error(errMsg);

                }
                //make sure to handle all errors, example: network error
                const responseData = await response.json();
                //console.log(responseData)

                dispatch(authenticate(//CHECK IF YOU CAN STORE THE USERS PUSH TOKEN EACH TIME THEY LOGIN(even for auto login) (SINCE THEIR PUSH TOKEN SHOULD CHANGE ON EVERY NEW DEVICE)
                    responseData.idToken,
                    responseData.localId,
                    parseInt(responseData.expiresIn) * 1000
                ));
                //dispatch({ type: LOGIN, token: responseData.idToken, userId: responseData.localId });

                //getting the future date/time when the token expires
                const expiryDate = new Date(
                    new Date().getTime() + parseInt(responseData.expiresIn) * 1000
                );
                saveDataToStorage(responseData.idToken, responseData.localId, expiryDate);//just like you stored it in redux store(mem), but here, in the device storage

            } else {
                console.log('EMPTY FIELDS')
                throw new Error('Please fill in all fields.');
            }

        });
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');//you can still choose to wait for this 
    return {
        type: LOGOUT
    };
};

const clearLogoutTimer = () => {
    if(timer){
        clearTimeout(timer);
    }
    
};

const setLogoutTimer = tokenExpiryTime => {
    return (
        dispatch => {
            timer = setTimeout(() => {// REM: I ignored the yellow box msg about long timers
                dispatch(logout())
            }, tokenExpiryTime)

        }
    );
};

const saveDataToStorage = (idToken, userId, tokenExpiry) => {
    AsyncStorage.setItem('userData',
        JSON.stringify({
            idToken: idToken,
            userId: userId,
            expiryDate: tokenExpiry.toISOString()
        })
    );
}