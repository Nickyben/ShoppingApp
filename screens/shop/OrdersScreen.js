import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
    Platform, ActivityIndicator
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';// another approach is importing and using the connect function
import { HeaderTitle } from 'react-navigation-stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shopComponents/CartItem';
import HeaderBtn from '../../components/UI/HeaderBtn';
import OrderItem from '../../components/shopComponents/OrderItem';
import * as cartActions from '../../store/actions/cartAction';
import * as ordersActions from '../../store/actions/ordersAction';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const ordersArr = useSelector(state => state.ordersRed.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback(async () => {
        setError(null);
        try {
            await dispatch(ordersActions.fetchOrders());
        } catch (err) {
            setError(err.message);
        }

    }, [dispatch, setError]);


    useEffect(() => {
        setIsLoading(true);
        loadOrders().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadOrders]);

    if (error) {
        return (
            <View style={styles.spinner}>
                <Text>Oops! an error occurred!</Text>
                <Button color={Colors.primary} title='Try Again' onPress={() => {
                    setIsLoading(true);
                    loadOrders().then(() => {
                        setIsLoading(false);
                    });
                }}

                />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.spinner}>
                <ActivityIndicator
                    size='large'
                    color={Colors.primary}

                />
            </View>
        );
    }

    if (ordersArr.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} >
                <Text>You have not ordered any items or products</Text>
            </View>)
    }

    return (
        <FlatList
            onRefresh={loadOrders}
            refreshing={isRefreshing}
            data={ordersArr}
            keyExtractor={Item => Item.id}
            renderItem={(itemData) => (
                <OrderItem
                    items={itemData.item.items}
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                />

            )}
        />
    );
};

//OrdersScreen.navigationOptions
export const screenOptions = navProps => {
    const menuIcon = Platform.OS == 'android' ? 'md-menu' : 'ios-menu';

    return (
        {

            headerTitle: 'Your Orders',
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                    <Item
                        tile='Menu'
                        iconName={menuIcon}
                        onPress={() => {
                            navProps.navigation.toggleDrawer();
                        }}
                    />
                </HeaderButtons>
            ),
        }
    );
};

const styles = StyleSheet.create({
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default OrdersScreen;