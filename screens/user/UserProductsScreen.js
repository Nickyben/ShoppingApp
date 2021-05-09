import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
    Platform, Alert
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';// another approach is importing and using the connect function
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shopComponents/ProductItem';
import HeaderBtn from '../../components/UI/HeaderBtn';
import * as productsActions from '../../store/actions/productsAct';
import Colors from '../../constants/Colors';



const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.productsRed.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        props.navigation.navigate(
            {
                name: 'EditProduct',
                params: {
                    productId: id,
                }
            }
        );
    };

    const deleteHandler = (id) => {
        Alert.alert(
            'Delete Item',
            'Do you really want to delete this item?',
            [
                { text: 'No', style: 'default' },
                {
                    text: 'Yes', style: 'destructive', onPress: () => {
                        dispatch(productsActions.deleteProduct(id))
                    }
                }
            ]
        );
    };

    if(userProducts.length === 0) {
        return (
        <View
        style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center'
        }} >
            <Text>No products fround. You can post some for sale</Text> 
        </View>)
    }


    return (
        <FlatList
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        editProductHandler(itemData.item.id)
                    }}

                >
                    <View style={styles.buttons}>
                        <Button
                            color={Colors.primary}
                            title='   Edit   '
                            onPress={() => {
                                editProductHandler(itemData.item.id)
                            }}
                        />
                    </View>
                    <View style={styles.buttons}>
                        <Button
                            color={Colors.primary}
                            title='Delete'
                            onPress={()=>{deleteHandler(itemData.item.id)}}

                        />
                    </View>
                </ProductItem>}
        />);
};

//UserProductsScreen.navigationOptions = 
export const screenOptions=(navProps) => {
    const addIcon = Platform.OS == 'android' ? 'md-add' : 'ios-add';//or md-create
    const menuIcon = Platform.OS == 'android' ? 'md-menu' : 'ios-menu';
    return (
        {
            headerTitle: 'Your Products',
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                    <Item
                        tile='Add'
                        iconName={addIcon}
                        onPress={() => {
                            navProps.navigation.navigate(
                                {
                                    name: 'EditProduct',
                                    params: {

                                    }
                                }
                            );
                        }}
                    />
                </HeaderButtons>
            ),
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
    buttons: {
        borderRadius: 8,
        overflow: 'hidden',
    },
});


export default UserProductsScreen;