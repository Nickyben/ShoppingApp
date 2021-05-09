import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

//React navigation version 5
import { NavigationContainer } from '@react-navigation/native';

import { ShopDrawerNavigator, AuthNavigator} from './ShopNavigator';
import StartupScreen from '../screens/StartupScreen';

const AppNavigator = props => {
    const isAuth = useSelector(state => !!state.authRed.idToken);
    const didTryAutoLogin = useSelector(state => !!state.authRed.didTryAutoLogin);

    return (
        <NavigationContainer>
            {isAuth && <ShopDrawerNavigator/>}
            {!isAuth && didTryAutoLogin && <AuthNavigator />}
            {!isAuth && !didTryAutoLogin && <StartupScreen />}
        </NavigationContainer>


//see docs example:
// isSignedIn ? (
//         <>
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="Profile" component={ProfileScreen} />
//             <Stack.Screen name="Settings" component={SettingsScreen} />
//         </>
//     ) : (
//             <>
//                 <Stack.Screen name="SignIn" component={SignInScreen} />
//                 <Stack.Screen name="SignUp" component={SignUpScreen} />
//             </>
//         )


    );
};

export default AppNavigator;