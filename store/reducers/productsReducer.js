import PRODUCTS from '../../data/productData';
import { DELETE_PRODUCT, CREATE_PRODUCT, EDIT_PRODUCT, SET_PRODUCTS } from '../actions/productsAct';
import Product from '../../models/product';

const initialState = {
    availableProducts: [], //PRODUCTS :(,
    userProducts: [], //PRODUCTS.filter(prod => prod.ownerId === 'u1'),
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS: 
            return {
                ...state,
                //    availableProducts: PRODUCTS,
                //    userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1'),
                availableProducts: action.products,
                userProducts: action.userProducts,
            };
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id,// new Date().toString(),//just a dummy id
                action.productData.ownerId, //for now
                action.productData.pushToken,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price
            );
            return ({
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            });
        case EDIT_PRODUCT:
            const availProductIndex = state.availableProducts.findIndex(prod => prod.id === action.productId);
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.productId);
            const editedProduct = new Product(
                action.productId,
                state.userProducts[productIndex].ownerId,
                state.userProducts[productIndex].pushToken,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                state.userProducts[productIndex].price,
            );
            const updatedAvailProducts = [...state.availableProducts];
            const updatedUserProducts = [...state.userProducts];
            updatedAvailProducts[availProductIndex] = editedProduct;
            updatedUserProducts[productIndex] = editedProduct;

            return ({
                ...state,
                availableProducts: updatedAvailProducts,
                userProducts: updatedUserProducts,
            });

        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(userProd =>
                    userProd.id !== action.productId
                ),

                availableProducts: state.availableProducts.filter(userProd =>
                    userProd.id !== action.productId
                ),
            };

    }
    return state;
};