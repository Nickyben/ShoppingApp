import React, { useState } from 'react';
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
import Card from '../../components/UI/Card';
import HeaderBtn from '../../components/UI/HeaderBtn';
import * as cartActions from '../../store/actions/cartAction';
import * as ordersActions from '../../store/actions/ordersAction';

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    //const [error, setError] = useState()
    const cartTotalAmt = useSelector(state => state.cartRed.totalAmount);
    const cartItemsArr = useSelector(state => {
        const cartItemsArray = [];
        for (const key in state.cartRed.items) {
            cartItemsArray.push({
                productId: key,
                quantity: state.cartRed.items[key].quantity,
                productPrice: state.cartRed.items[key].productPrice,
                productTitle: state.cartRed.items[key].productTitle,
                productSum: state.cartRed.items[key].productSum,
                productPushToken: state.cartRed.items[key].pushToken, //*productPushToken
            });
        }
        return cartItemsArray.sort((a, b) =>
            a.productId > b.productId ? 1 : -1
        );
    });
    const isDisabled = cartItemsArr.length === 0;
    const dispatch = useDispatch();

    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(ordersActions.addOrder(cartItemsArr, Math.round(cartTotalAmt.toFixed(2) * 100) / 100));
        console.log('dispatched order with cartItems');
        setIsLoading(false);
    }



    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amt}>${Math.round(cartTotalAmt.toFixed(2) * 100) / 100}</Text>
                </Text>



                <View style={styles.actions}>
                    {isLoading ?
                        <ActivityIndicator size='large' color={Colors.primary} />
                        :
                        <View style={styles.buttons}>
                            <Button
                                color={Colors.primary}
                                title='Order Now'
                                disabled={isDisabled}
                                onPress={sendOrderHandler}
                            />
                        </View>
                    }
 
                </View>

            </Card>
            <FlatList
                data={cartItemsArr}
                keyExtractor={item => item.productId}
                renderItem={itemData =>
                    <CartItem
                        quantity={itemData.item.quantity}
                        amount={itemData.item.productSum}
                        title={itemData.item.productTitle}
                        onDelete={() => { dispatch(cartActions.removeFromCart(itemData.item.productId)) }}
                        canDelete={true}
                    />
                }
            />
        </View>

    );
};

export const screenOptions = navProps => {

    return (
        {
            headerTitle: 'Your Cart',
        }
    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        backgroundColor: 'white',
    },
    summaryText: {
        fontFamily: 'OpenSansBold',
        fontSize: 18,

    },
    amt: {
        color: Colors.accent,
        fontSize: 22
    },
    actions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttons: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    spinner: {

    }

});

export default CartScreen;