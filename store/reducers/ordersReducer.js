import Order from '../../models/order';
import { ADD_ORDER, SET_ORDERS } from '../actions/ordersAction';

const initialState = {
    orders: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ORDERS:
            return (
                { orders: action.orders }
            );
        case ADD_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date // a date obj
            );
            return {
                ...state,//unnecessary 
                orders: state.orders.concat(newOrder),
            };
    }
    return state;
};