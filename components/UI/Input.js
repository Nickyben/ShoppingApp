import React, { useEffect, useReducer } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';
const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return (
                {
                    ...state,
                    value: action.value,
                    validity: action.validity,
                    isTouched: action.isTouched,//isTouched: action.isTouched

                }
            );
        case INPUT_BLUR:
            return ({
                ...state,
                isTouched: true,
            });
        default:
            return state;
    }

};


const Input = props => {
    const [inputState, dispatchAction] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        validity: props.initialValidity,
        isTouched: false
    });

    const {onInputChange, id}= props;

    useEffect(() => {
        if(inputState.isTouched){
        onInputChange(id, inputState.value, inputState.validity)}
    },[inputState, onInputChange, id]);


    const textChangeHandler = text => {
        //console.log(text);
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }



        dispatchAction({ type: INPUT_CHANGE, value: text, validity: isValid, isTouched: true})
    };

    const lostFocusHandler = () => {
        dispatchAction({ type: INPUT_BLUR})
    };

    return (//REMINDER: Edit inputs are not working properly when you submit with first input Empty
        <View style={{ ...styles.formControl, ...props.style }}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                {...props}
                style={styles.input}
                value={inputState.value}
                onChangeText={textChangeHandler}
                onBlur ={lostFocusHandler}
            />
            {!inputState.validity && inputState.isTouched && 
                <View style={styles.errorMsgWrap}><Text style={styles.errorMsg}>{props.errorMsg}</Text></View>
            }
        </View>

    );
};

const styles = StyleSheet.create({
    formControl: {
        width: '100%'
    },
    label: {
        marginTop: 15,
        marginBottom: 7,
        fontSize: 16,
        fontFamily: 'OpenSansBold',

    },
    input: {
       // alignSelf: 'center',
        //width: '100%',
        paddingHorizontal: 4,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
    },
    errorMsgWrap:{
        marginVertical: 5
    },
    errorMsg: {
        //alignSelf: 'center',
        color: '#ff5544',
        padding: 5,
        fontFamily: 'OpenSansRegular',
    },

});

export default Input;