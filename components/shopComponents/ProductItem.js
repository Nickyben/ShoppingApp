import React from 'react';
import {
    Platform, View, Text, StyleSheet, Image,
    Button, TouchableOpacity, TouchableNativeFeedback
} from 'react-native';

import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const Touch = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const ProductItem = props => {
    return (

        <Card style={styles.productCard}>
            <View style={styles.touchContainer}>
                <Touch onPress={props.onSelect} useForeground>
                    <View style={styles.touchContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={{uri:props.image}} style={styles.image} />
                        </View>
                        <View style={styles.itemDetail}>
                            <Text style={styles.title}>{props.title}</Text>
                            <Text style={styles.price}>${Number(props.price).toFixed(2)}</Text>
                        </View>
                        <View style={styles.actions}>
                            {props.children}
                            {/* <View style={styles.buttons}>
                                <Button color={Colors.primary} title='Details' onPress={props.onClickDetail} />
                            </View>
                            <View style={styles.buttons}>
                                <Button color={Colors.primary} title='To Cart' onPress={props.onAddToCart} />
                            </View> */}
                        </View>
                    </View>
                </Touch>
            </View>
        </Card>


    );
};

const styles = StyleSheet.create({
    productCard: {
        height: 350,//edit this with respect to device dimensions
        margin: 20,
    },
    touchContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        height: '100%',
    },
    itemDetail: {
        alignItems: 'center',
        height: '20%',
        padding: 10,
        backgroundColor: '#ffdfcf',

    },

    title: {
        fontFamily: 'OpenSansBold',
        fontSize: 18,
        marginVertical: 2,
    },
    price: {
        fontFamily: 'OpenSansRegular',
        fontSize: 16,
        color: '#333',
    },
    actions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '20%',
        backgroundColor: '#fff7f7',
        paddingHorizontal: 20,
    },
    buttons: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },

});
export default ProductItem;