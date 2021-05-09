import React from 'react';
import {
    Platform, View, Text, StyleSheet, Image,
    Button, TouchableOpacity, TouchableNativeFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const Touch = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
const trashIcon = Platform.OS === 'android' ? 'md-trash' : 'ios-trash';

const CartItem = props => {
    return (
    <Card style={{...styles.cartCard, ...props.style}}>
            <View style={styles.cartDetail}>
                <Text style={styles.quantity}>{props.quantity}  </Text>
                <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.cartDetail}>
                <Text style={styles.mainText}>${props.amount.toFixed(2)}  </Text>
                {props.canDelete &&
                    <Touch onPress={props.onDelete} style={styles.deleteBtn}>
                        <Ionicons
                            name={trashIcon}
                            size={23}
                            color={Colors.accent}
                        />
                    </Touch>
                }
            </View>
        </Card>


    );
};

const styles = StyleSheet.create({
    cartCard: {
       
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomColor: '#eee',
        borderTopColor: '#ddd',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,


    },

    cartDetail: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    quantity: {
        fontFamily: 'OpenSansRegular',
        color: '#555',
        fontSize: 16,

    },

    mainText: {
        fontFamily: 'OpenSansBold',
        fontSize: 18,
        marginVertical: 2,
    },
    deleteBtn: {
        marginLeft: 20,

    },

});
export default CartItem;