import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    AsyncStorage, StyleSheet
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/authAction';

import Colors from '../constants/Colors';

const StartupScreen = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
               // props.navigation.navigate('Auth');
               dispatch(authActions.setDidTryAutoLogin());
                return;
            }
            const userDataObj = JSON.parse(userData);
            const { idToken, userId, expiryDate} = userDataObj;
            const expiryDateObj =  new Date(expiryDate);//converting the ISOString back to an obj
            if (expiryDateObj <= new Date() || !idToken || !userId){//checking if the expiry date is past or now or token or userId cant be found
               // props.navigation.navigate('Auth');
                dispatch(authActions.setDidTryAutoLogin());
                return;
            }
            const expiryTime = expiryDateObj.getTime() - new Date().getTime();

           // props.navigation.navigate('Shop');
            dispatch(authActions.authenticate(idToken, userId, expiryTime));
            
        };

        tryLogin();
    }, [dispatch])

    return (
        <View style={styles.screen}>
            <ActivityIndicator
                size='large'
                color={Colors.primary}
            />
        </View>
    )
};

export const screenOptions = navData =>{

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default StartupScreen;