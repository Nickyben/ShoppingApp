import React from 'react';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { useDispatch } from 'react-redux';

//react navigation version 5
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'

import { Ionicons } from '@expo/vector-icons';

import CartScreen, {
    screenOptions as cartScreenOptions
} from '../screens/shop/CartScreen';
import ProductOverviewScreen, {
    screenOptions as prodsScreenOptions
} from '../screens/shop/ProductsOverview';
import ProductDetailScreen, {
    screenOptions as prodDetailScreenOptions
} from '../screens/shop/ProductDetails';
import OrdersScreen, {
    screenOptions as ordersScreenOptions
} from '../screens/shop/OrdersScreen';
import UserProductsScreen, {
    screenOptions as userProdsScreenOptions
} from '../screens/user/UserProductsScreen';
import EditProductScreen, {
    screenOptions as editProdScreenOptions
} from '../screens/user/EditProductScreen';
import Colors from '../constants/Colors';
import AuthScreen, {
    screenOptions as authScreenOptions
} from '../screens/user/AuthScreen';
import StartupScreen, {
    screenOptions as startUpScreenOptions
} from '../screens/StartupScreen';

import * as authActions from '../store/actions/authAction';


const defaultNavOptions = {
    headerTitle: 'Shopping App',
    headerTitleStyle: {
        fontFamily: 'OpenSansBold',
    },

    headerBackTitleStyle: {//for the back button text...seen in ios
        fontFamily: 'OpenSansRegular',
    },
    headerStyle: {
        backgroundColor: Colors.switchPrimary,
    },
    headerTintColor: Colors.switchWhite,
    headerTitleAlign: 'center',

};

const ProductsStackNav = createStackNavigator();

const ProductsStackNavigator = () => {
    return (
        <ProductsStackNav.Navigator screenOptions={defaultNavOptions}>
            <ProductsStackNav.Screen
                name='ProductOverview'
                component={ProductOverviewScreen}
                options={prodsScreenOptions}
            />
            <ProductsStackNav.Screen
                name='ProductDetail'
                component={ProductDetailScreen}
                options={prodDetailScreenOptions}
            />
            <ProductsStackNav.Screen
                name='Cart'
                component={CartScreen}
                options={cartScreenOptions}
            />
        </ProductsStackNav.Navigator>
    );
};



// const ProductsStackNavigator = createStackNavigator(
//     {
//         ProductOverview: {
//             screen: ProductOverviewScreen,
//             navigationOptions: {
//                 

//             },
//         },

//         ProductDetail: {
//             screen: ProductDetailScreen,
//             navigationOptions: {

//             },
//         },

//         Cart: {
//             screen: CartScreen,
//             navigationOptions: {
//             },
//         },
//     },
//     {
//         defaultNavigationOptions: defaultNavOptions
//     }
// );

const OrdersStackNav = createStackNavigator();

const OrdersStackNavigator = () => {
    return (
        <OrdersStackNav.Navigator screenOptions={defaultNavOptions}>
            <OrdersStackNav.Screen
                name='Orders'
                component={OrdersScreen}
                options={ordersScreenOptions}
            />

        </OrdersStackNav.Navigator>
    );
};
// const OrdersStackNavigator = createStackNavigator(
//     {
//         Orders: {
//             screen: OrdersScreen,
//             navigationOptions: {
//             }
//         }
//     },
//     {
//         defaultNavigationOptions: defaultNavOptions
//     }
// );

const AdminStackNav = createStackNavigator();

const AdminStackNavigator = () => {
    return (
        <AdminStackNav.Navigator screenOptions={defaultNavOptions}>
            <AdminStackNav.Screen
                name='UserProducts'
                component={UserProductsScreen}
                options={userProdsScreenOptions}
            />
            <AdminStackNav.Screen
                name='EditProduct'
                component={EditProductScreen}
                options={editProdScreenOptions}
            />

        </AdminStackNav.Navigator>
    );
};

// const AdminStackNavigator = createStackNavigator(
//     {
//         UserProducts: {
//             screen: UserProductsScreen,
//             navigationOptions: {
//             }
//         },
//         EditProduct: {
//             screen: EditProductScreen,
//             navigationOptions: {
//             }
//         }
//     },
//     {
//         defaultNavigationOptions: defaultNavOptions
//     }
// );

const AuthStackNav = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStackNav.Navigator screenOptions={defaultNavOptions}>
            <AuthStackNav.Screen
                name='Authentication'
                component={AuthScreen}
                options={authScreenOptions}
            />
        </AuthStackNav.Navigator>
    );
};

// const AuthNavigator = createStackNavigator({
//     Authentication: {
//         screen: AuthScreen,
//         navigationOptions: {
//         }
//     }
// },
//     {
//         defaultNavigationOptions: defaultNavOptions,
//     }
// );


const ShopDrawerNav = createDrawerNavigator();

export const ShopDrawerNavigator = () => {
    const dispatch = useDispatch();

    return (
        <ShopDrawerNav.Navigator
            drawerLabel='Menu'
            drawerPosition="left"
            drawerType="front"
            //you can add drawerStyle here
            drawerContent={
                (props) => {
                    return (
                        <View style={{
                            flex: 1, paddingTop: 20,
                        }}>
                            <SafeAreaView
                                forceInset={{ top: 'always', horizontal: 'never' }}
                            >
                                <DrawerItemList {...props} />
                                <Button
                                    title='Logout'
                                    color={Colors.primary}
                                    onPress={() => {
                                        dispatch(authActions.logout());
                                        //props.navigation.navigate('Auth')//already handled by the renderer(AppNavigator) of the ShopNavigator @ app.js
                                    }}
                                />

                            </SafeAreaView>
                        </View>
                    );
                }
            }
            drawerContentOptions={
                {   
                    activeTintColor: Colors.primary,
                    activeBackgroundColor: '#f2f2f2',
                    inactiveBackgroundColor: '#fafafa',
                    inactiveTintColor: '#444',
                    labelStyle: {
                        fontSize: 18,
                    },
                }
            }
        >
            <ShopDrawerNav.Screen
                name='ProductsStack'
                component={ProductsStackNavigator}
                options={
                    {//can also be set in the 2nd arg of this stack' s create func
                        drawerLabel: 'Products',
                        drawerIcon: props => (
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                                size={23}
                                color={props.color}
                            />
                        )

                    }
                }
            />
            <ShopDrawerNav.Screen
                name='OrdersStack'
                component={OrdersStackNavigator}
                options={
                    {//can also be set in the 2nd arg of this stack' s create func
                        drawerLabel: 'Orders',
                        drawerIcon: props => (
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                                size={23}
                                color={props.color}
                            />
                        )
                    }
                }
            />
            <ShopDrawerNav.Screen
                name='UserStack'
                component={AdminStackNavigator}
                options={
                    {//can also be set in the 2nd arg of this stack' s create func
                        drawerLabel: 'Admin',
                        drawerIcon: props => (
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                                size={23}
                                color={props.color}
                            />
                        )
                    }
                }
            />
        </ShopDrawerNav.Navigator>
    );
};



// const ShopDrawerNavigator = createDrawerNavigator(
//     {
//         ProductsStack: {
//             screen: ProductsStackNavigator,
            // navigationOptions: {//can also be set in the 2nd arg of this stack' s create func
            //     drawerLabel: 'Products',
            //     drawerIcon: drawerConfig => (<Ionicons
            //         name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            //         size={23}
            //         color={drawerConfig.tintColor}
            //     />)

            // },
//         },

//         OrdersStack: {//this stack is at tab level !!!!
//             screen: OrdersStackNavigator,
            // navigationOptions: {//can also be set in the 2nd arg of this stack' s create func
            //     drawerLabel: 'Orders',
            //     drawerIcon: drawerConfig => (<Ionicons
            //         name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
            //         size={23}
            //         color={drawerConfig.tintColor}
            //     />)
            // },
//         },

//         UserStack: {//this stack is at tab level !!!!
//             screen: AdminStackNavigator,
            // navigationOptions: {//can also be set in the 2nd arg of this stack' s create func
            //     drawerLabel: 'Admin',
            //     drawerIcon: drawerConfig => (<Ionicons
            //         name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            //         size={23}
            //         color={drawerConfig.tintColor}
            //     />)
            // },
//         }


//     },
//     {
//         drawerBackgroundColor: '#fff',
//         drawerPosition: 'left',
//         drawerType: 'front',
//         drawerLabel: 'Menu',
        // contentOptions: {

        //     activeTintColor: Colors.primary,
        //     activeBackgroundColor: '#f2f2f2',
        //     inactiveBackgroundColor: '#fafafa',
        //     inactiveTintColor: '#444',
        //     labelStyle: {
        //         //fontFamily: 'OpenSansBold',
        //         fontSize: 18,
        //         alignItems: 'center',
        //     },

        // },
        // contentComponent: (props) => {
        //     const dispatch = useDispatch();
        //     return (
        //         <View style={{
        //             flex: 1, paddingTop: 20,
        //         }}>
        //             <SafeAreaView
        //                 forceInset={{ top: 'always', horizontal: 'never' }}
        //             ><DrawerItems {...props} />
        //                 <Button
        //                     title='Logout'
        //                     color={Colors.primary}
        //                     onPress={() => {
        //                         dispatch(authActions.logout());
        //                         //props.navigation.navigate('Auth')//already handled by the renderer(NavContainer) of the ShopNavigator @ app.js
        //                     }}
        //                 />

        //             </SafeAreaView>
        //         </View>
        //     );
        // },
//     }
// );



// const MainNavigator = createSwitchNavigator({
//     Startup: {
//         screen: StartupScreen,
//     },
//     Auth: {
//         screen: AuthNavigator,
//     },
//     Shop: {
//         screen: ShopDrawerNavigator
//     }
// });

// export default createAppContainer(MainNavigator);