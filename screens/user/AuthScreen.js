import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    View, Text, ScrollView, StyleSheet,
    KeyboardAvoidingView, ActivityIndicator,
    Button,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/authAction';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

//you can choose to out source this to a separate file since its used in more than one screen
const formReducer = (state, action) => {//the state is initially the initial state passed to 2nd arg of useReducer
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedInputValues = {
            ...state.inputValues,
            [action.input]: action.value,//replacing the key(the input's name)  and value in inputValues Obj with the new text from action.value
        };
        const updatedInputValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid,//replacing the key(the input's name)  and value in inputValidities Obj with the new text from action.value
        };
        let updatedFormValidity = true;
        for (const key in updatedInputValidities) {
            //GOOD PRACTICE! : once the updatedFormValidity is false for any,
            // it remains false even if any other inputValidity is true, because the false will override in the AND logic
            updatedFormValidity = updatedFormValidity && updatedInputValidities[key];
        }
        //console.log(updatedInputValues);
        //console.log(updatedInputValidities);
        //console.log(updatedFormValidity);

        return {

            //...state, //unnecessary
            inputValues: updatedInputValues,
            inputValidities: updatedInputValidities,
            formValidity: updatedFormValidity,
        }
    }
    return state;
};
const AuthScreen = (props) => {
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    const [formState, dispatchFormState] = useReducer(formReducer, {//recommended instead of mgt of all text states and validity individually with useState() hook
        //initial State
        inputValues: {
            authEmail: '',
            authPassword: '',
        },
        //initial validity
        inputValidities: {
            authEmail: false,
            authPassword: false,
        },
        //initial general form validity
        formValidity: false,
    });
    useEffect(
        () => {
            if (error) {
                Alert.alert('Error Occurred', error, [{ text: 'Okay' }])
            }
        }
    ,[]);//check : i added an empty array dep

    const authHandler = async () => {
        //console.log(formState.inputValues.authEmail);
        //console.log(formState.inputValues.authPassword);
        let action;
        if (isSignup) {
            // console.log(isSignup);
            action = authActions.signup(
                formState.inputValues.authEmail,
                formState.inputValues.authPassword
            );

        } else {
            // console.log(isSignup);
            action = authActions.login(
                formState.inputValues.authEmail,
                formState.inputValues.authPassword
            );
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            //this is no longer possible because there's no navigator holding this screen and shop screen
            // props.navigation.navigate({
            //     name: 'Shop',
            //     params: {

            //     }
            // })
        }
        catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

    };

    const inputChangeHandler = useCallback(
        (inputName, inputValue, inputValidity) => {
            // console.log(inputName);
            // console.log(inputValue);
            // console.log(inputValidity);

            dispatchFormState(//almost just like dispatching in redux
                //action
                {
                    type: FORM_INPUT_UPDATE,
                    value: inputValue,
                    isValid: inputValidity,
                    input: inputName,
                }
            )
        }, [dispatchFormState]
    );


    return (
        <KeyboardAvoidingView style={styles.screen} keyboardVerticalOffset={50}
        // behavior="padding" 
        >
            <LinearGradient colors={['#ccc', '#ddd']} style={styles.gradientBack}>
                <Card style={styles.authCard}>
                    <ScrollView>
                        <Input
                            id='authEmail'
                            label='E-Mail'
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize='none'
                            errorMsg='Please enter a valid email address.'
                            onInputChange={inputChangeHandler}
                            initialValue=''

                        />
                        <Input id='authPassword' label='Password' keyboardType='default'
                            required secureTextEntry minLength={7} autoCapitalize='none'
                            errorMsg='Password must be at least 7 characters.'
                            onInputChange={inputChangeHandler}
                            initialValue=''

                        />

                        <View style={styles.actions}>
                            <View style={styles.btn}>
                                {isLoading ?
                                    <ActivityIndicator
                                        color={Colors.primary}
                                        size={22}
                                    /> :
                                    (<Button
                                        title={isSignup ? 'Signup' : 'Login'}
                                        color={Colors.primary}
                                        onPress={authHandler}
                                    />)}
                            </View>
                            <View style={styles.btn}>
                                <Button
                                    title={`Switch to ${isSignup ? 'Login' : 'Signup'}`}
                                    color={'#ee2277'}
                                    onPress={() => {
                                        setIsSignup((prevState) => {
                                            return !prevState;
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>

                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

//AuthScreen.navigationOptions =
export const screenOptions = navProps => {
    return (
        {
            headerTitle: 'Authenticate',
        }
    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,

    },
    gradientBack: {
        // width:'100%',
        // height:'100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authCard: {
        // borderTopColor: Colors.primary,
        //borderTopWidth: 20,
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20,
    },
    actions: {
        marginTop: 20,
    },
    btn: {
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
    }
});

export default AuthScreen;

