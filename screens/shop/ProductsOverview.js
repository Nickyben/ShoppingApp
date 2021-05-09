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

import ProductItem from '../../components/shopComponents/ProductItem';
import HeaderBtn from '../../components/UI/HeaderBtn';
import * as cartActions from '../../store/actions/cartAction';
import * as prodActions from '../../store/actions/productsAct';
import Colors from '../../constants/Colors';



const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.productsRed.availableProducts);
    const dispatch = useDispatch();
    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true)
        try {
            await dispatch(prodActions.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setError]);//setIsLoading is handled already by react,

    useEffect(() => {
       const unsubscribe = props.navigation.addListener('focus', loadProducts);

        //clean up function to run when effect is about to rerun or when component is destroyed
        return (() => {
           unsubscribe();
        });
    }, [loadProducts]);


    useEffect(//will run only when the component load and not again
        //don't use async keyword here, instead, use .then() after the dispatch()
        () => {
            setIsLoading(true);
            loadProducts().then(()=>{
                setIsLoading(false);
            });
        }
        , [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate({
            name: 'ProductDetail', 
            params: {
                productId: id,
                productTitle: title,
            },
        });
    };

    if (error) {
        return (
            <View style={styles.spinner}>
                <Text>Oops! an error occurred!</Text>
                <Button color={Colors.primary} title='Try Again' onPress={() => {
                    setIsLoading(true);
                    loadProducts().then(() => {
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

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.spinner}>
                <Text>Oops! No products Found!</Text>
            </View>
        );
    }



    return (
        <FlatList

            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <ProductItem

                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}

                >
                    <View style={styles.buttons}>
                        <Button
                            color={Colors.primary}
                            title='Details'
                            onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)} />
                    </View>
                    <View style={styles.buttons}>
                        <Button
                            color={Colors.primary}
                            title='To Cart'
                            onPress={() => { 
                                dispatch(cartActions.addToCart(itemData.item)) 
                                console.log('dispatched added to cart');
                            }} />
                    </View>
                </ProductItem>}
        />);
};

//ProductsOverviewScreen.navigationOptions
export const screenOptions = (navProps) => {
    const cartIcon = Platform.OS == 'android' ? 'md-cart' : 'ios-cart';
    const menuIcon = Platform.OS == 'android' ? 'md-menu' : 'ios-menu';
    return (
        {
            headerTitle: 'All Products',
            headerRight: (props) => (
                <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                    <Item
                        tile='Cart'
                        iconName={cartIcon}
                        onPress={() => {
                            navProps.navigation.navigate(
                                {
                                    name: 'Cart',
                                    params: {

                                    }
                                }
                            );
                        }}
                    />
                </HeaderButtons>
            ),
            headerLeft: (props) => (
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
    buttons: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProductsOverviewScreen;