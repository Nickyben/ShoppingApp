import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Button

} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';// another approach is importing and using the connect function
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shopComponents/CartItem';
import HeaderBtn from '../../components/UI/HeaderBtn';
import * as prodActions from '../../store/actions/productsAct';
import Input from '../../components/UI/Input';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

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

        return {
            //...state, //unnecessary
            inputValues: updatedInputValues,
            inputValidities: updatedInputValidities,
            formValidity: updatedFormValidity,
        }
    }
    return state;
};


const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState()
    const dispatch = useDispatch();
    const productId = props.route.params ? props.route.params.productId : null; //you can still check if it's null
    const editProduct = useSelector(state => state.productsRed.userProducts.find(
        prod => prod.id === productId
    ));

    const [formState, dispatchFormState] = useReducer(formReducer, {//recommended instead of mgt of all text states and validity individually with useState() hook
        //initial State
        inputValues: {
            title: editProduct ? editProduct.title : '',
            description: editProduct ? editProduct.description : '',
            imageUrl: editProduct ? editProduct.imageUrl : '',
            price: '',
        },
        //initial validity
        inputValidities: {
            title: editProduct ? true : false,
            description: editProduct ? true : false,
            imageUrl: editProduct ? true : false,
            price: editProduct ? true : false,
        },
        //initial general form validity
        formValidity: editProduct ? true : false,
    });



    useEffect(() => {
        if (error) {
            Alert.alert('Error', error, [{ text: 'Okay' }])
        }
    }, [error]);
    const formSubmitHandler = useCallback(async () => {

        // console.log(formState.formValidity);
        if (!formState.formValidity) {
            Alert.alert('Invalid Form or Input', 'Please Check Your Errors', [{ text: 'Okay ' }])
            return;
        }
        setError(null);
        setIsLoading(true);


        try {
            if (editProduct) {
                await dispatch(prodActions.editProduct(
                    productId,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    //require(tempImageUrl)//replace this with a string eg web image url for source ={{uri: ...}}
                ));
            } else {
                await dispatch(prodActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    // require(tempImageUrl),//replace this with a string eg web image url for source ={{uri: ...}}
                    Number(formState.inputValues.price)
                ));
            }

            props.navigation.goBack();
        } catch (err) {
            setError(err.message)
        }

        setIsLoading(false);
        //props.navigation.goBack();
    }, [dispatch, productId, formState,]);//include editProduct?

    useEffect(() => {
        const saveIcon = Platform.OS == 'android' ? 'md-checkmark' : 'ios-checkmark';//or md-create

        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                    <Item
                        tile='Save'
                        iconName={saveIcon}
                        onPress={formSubmitHandler}
                    />
                </HeaderButtons>
            ),

            // formSubmit: formSubmitHandler
        });
    }, [formSubmitHandler]);

    const formInputHandler = useCallback((inputName, text, validity) => {

        dispatchFormState(//almost just like dispatching in redux
            //action
            {
                type: FORM_INPUT_UPDATE,
                value: text,
                isValid: validity,
                input: inputName,
            }
        )
    }, [dispatchFormState]);//inputName,text, validity
    if (isLoading) {
        return (
            <View style={styles.spinner}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
        // style={{ flex: 1 }}
        // behavior='padding' check why this is not working well
        // keyboardVerticalOffset={100}
        >
            <ScrollView>
                <View style={styles.form}>
                    {/* check better way of handling these inputs' states here in this file 
                with the  form's reducer instead on in the input component file
                NOTE: the updated state(inputValues and inputValidities were no longer used/managed here ) */}
                    <Input
                        id='title'
                        label='Title'
                        errorMsg='Please enter a valid title!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect={true}
                        returnKeyType='next'
                        onInputChange={formInputHandler}//using()=>formInputHandler(, ,) causes the a problem because it rebuilds as its dependencies change since its a useCallback 
                        initialValue={editProduct ? editProduct.title : ''}
                        initialValidity={!!editProduct} //editProduct ? true : false
                        required
                    />
                    <Input
                        id='imageUrl'
                        label='Image Url'
                        errorMsg='Please enter a valid image Url!'
                        keyboardType='default'
                        returnKeyType='next'
                        initialValue={editProduct ? editProduct.imageUrl : ''}
                        initialValidity={!!editProduct} //editProduct ? true : false
                        onInputChange={formInputHandler}
                        required
                    />
                    {!editProduct &&
                        <Input
                            id='price'
                            label='Price'
                            errorMsg='Please enter a valid price!'
                            keyboardType='decimal-pad'
                            returnKeyType='next'
                            onInputChange={formInputHandler}
                            required
                            min={0.1}
                        />}
                    <Input
                        id='description'
                        label='Description'
                        errorMsg='Please enter a valid description!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect={true}
                        multiline
                        returnKeyType='next'
                        numberOfLines={3}
                        onInputChange={formInputHandler}
                        initialValue={editProduct ? editProduct.description : ''}
                        initialValidity={!!editProduct} //editProduct ? true : false
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

//EditProductScreen.navigationOptions = 
export const screenOptions = navProps => {
    const hasProductId = navProps.route.params ? navProps.route.params.productId : null;
    // const formSubmitFunc = navProps.route.params? navProps.route.params.formSubmit: null;

    return ({
        headerTitle: hasProductId ? 'Edit Product' : 'Add Product',
    });
};

const styles = StyleSheet.create({
    form: {
        margin: 20,
    },

    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }


});

export default EditProductScreen;