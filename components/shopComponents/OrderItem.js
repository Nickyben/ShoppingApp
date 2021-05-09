import React, { useState } from 'react';
import {
    Platform, View, Text, StyleSheet,
    Button, TouchableOpacity, TouchableNativeFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import CartItem from './CartItem';
import Card from '../UI/Card';

const OrderItem = props => {
    const [detailsIsShown, setDetailsIsShown] = useState(false);

    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmt}>${props.amount.toFixed(2)}</Text>
                <Text style={styles.date}>{props.date}</Text>

            </View>
            <View style={styles.btn}>
                <Button
                    color={Colors.primary} title={detailsIsShown==true?'Hide Details':'Show Details' }
                    onPress={() => { setDetailsIsShown(prevState => !prevState) }}
                />
            </View>
            {detailsIsShown && (
                <View style={styles.details}>
                    {props.items.map(cartItem => (
                        <CartItem
                            key={cartItem.productId}
                            quantity={cartItem.quantity}
                            amount={cartItem.productSum}
                            title={cartItem.productTitle}
                            canDelete={false}
                            style={styles.cartItem}
                        />))}
                </View>
            )}


        </Card>


    );
};

const styles = StyleSheet.create({
    orderItem: {
        borderRadius: 20,
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    cartItem:{
        borderRadius: 0,
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    totalAmt: {
        fontFamily: 'OpenSansBold',
        fontSize: 16,
    },

    date: {
        fontFamily: 'OpenSansRegular',
        fontSize: 16,
        color: '#555',
    },

    btn: {
        overflow: 'hidden',
        borderRadius: 8,
        marginVertical: 15,
    },
    details: {
        width: '100%',
    },
});
export default OrderItem;