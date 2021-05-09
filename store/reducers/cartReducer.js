import CartItem from '../../models/cartItem';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cartAction';
import { ADD_ORDER } from '../actions/ordersAction';
import { DELETE_PRODUCT } from '../actions/productsAct';


const initialState = {
    items: {},
    totalAmount: 0,

};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProd = action.product;
            const prodPrice = addedProd.price;
            const prodTitle = addedProd.title;
            const pushToken = addedProd.pushToken;

            let newOrUpdatedCartItem;

            if (state.items[addedProd.id]) {//when the item is already in the cart
                newOrUpdatedCartItem = new CartItem(
                    state.items[addedProd.id].quantity + 1,
                    prodPrice, 
                    prodTitle,
                    pushToken,
                    state.items[addedProd.id].productSum + prodPrice
                );

            } else {
                newOrUpdatedCartItem = new CartItem(1, prodPrice, prodTitle, pushToken, prodPrice);//ie when the item is added for the first time
            }
            return {
                ...state,//used only if there are other properties in the initial state
                items: {
                    ...state.items,
                    [addedProd.id]: newOrUpdatedCartItem,//Vanilla js syntax of accessing a dynamic property
                },
                totalAmount: state.totalAmount + prodPrice,
            };
        case REMOVE_FROM_CART:
            const itemToDelete = state.items[action.productId];
            const currentQty = itemToDelete.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                const updatedCartItem = new CartItem(
                    currentQty - 1,
                    itemToDelete.productPrice,
                    itemToDelete.productTitle,
                    itemToDelete.pushToken,
                    itemToDelete.productSum - itemToDelete.productPrice,

                );
                updatedCartItems = {
                    ...state.items,
                    [action.productId]: updatedCartItem
                }
              
            } else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.productId];
            }
            return{
                ...state,
                items: updatedCartItems,
                totalAmount:state.totalAmount - itemToDelete.productPrice,
            };
        case ADD_ORDER:
            return initialState; //this is the very first state and is only the current if no actions have been dispatched
        case DELETE_PRODUCT:
            if(!state.items[action.productId]){
                return state;
            }
            const updatedItems = {...state.items}
            const itemTotalSum =  state.items[action.productId].productSum
            delete updatedItems[action.productId]
            return{
                ...state,
                items: updatedItems ,
                totalAmount: state.totalAmount- itemTotalSum
            };
    }
    return (state);//this is the state currently(now) in the app process
}