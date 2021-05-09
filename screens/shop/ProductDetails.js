import React, { } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import {
    ScrollView, View, Text,
    Image, Button, StyleSheet, 
} from 'react-native';

import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cartAction';

const ProductDetail = props => {
    const prodId = props.route.params.productId;
    const dispatch = useDispatch(); 

    const selectedProduct = useSelector(
        state => state.productsRed.availableProducts.find(prod => prod.id === prodId)
    );
    return (
        <ScrollView>
            <Image style={styles.image} source={{uri:selectedProduct.imageUrl}} />
            <View style={styles.actions}>
                <View style={styles.button}>
                    <Button color={Colors.primary} title='Add To Cart'
                        onPress={() => { dispatch(cartActions.addToCart(selectedProduct)) }} />
                </View>
            </View>
            <Text style={styles.price}>${selectedProduct.price}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    );
};

//ProductDetail.navigationOptions 
export const screenOptions= navProps => {
    const screenTitle = navProps.route.params.productTitle;

    return (
        {
            headerTitle: screenTitle,
        }
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300,
    },
    price: {
        fontFamily: 'OpenSansRegular',
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center',
    },
    button: {
        borderRadius: 8,
        overflow: 'hidden',
    },

});

export default ProductDetail;