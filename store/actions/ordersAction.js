import Order from '../../models/order';
export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return (
        async (dispatch, getState) => {
            //async code
            const userId = getState().authRed.userId;
            try {
                //the u1 will be replaced with a specific authenticated user
                const response = await fetch(`https://rn-firebase-expo-project.firebaseio.com/orders/${userId}.json`,
                    {
                        method: 'GET',//already the default, hence is unnecessary
                    }
                );

                //optional
                if (!response.ok) {
                    throw new Error('Something went wrong!')
                }

                const responseData = await response.json();//waits form the response before continuing with other exe below
                // and then returns an obj in this case

                const loadedOrders = [];
                for (const key in responseData) {
                    //const tempImageUrl = '../../assets/splash.png'; //imageUrl;//get from web 
                    loadedOrders.push(new Order(
                        key,//id of the product (from the auto firebase key)
                        responseData[key].cartItems,
                        responseData[key].totalAmount,
                        new Date(responseData[key].date),//responseData[key].date, is a string , but we need and obj
                    ));
                }
                //console.log(responseData);
                dispatch({
                    type: SET_ORDERS,
                    orders: loadedOrders

                });
            } catch (err) {
                //send to custom analytics server
                throw err;//handle this on the screen file
            }
        }
    );
};

export const addOrder = (cartItems, totalAmt) => {
    return (
        async (dispatch, getState) => {
            //getState returns entire state of redux store . ie all the state slices from 
            //all reducers; just like when using useSelector(state=> state.myRed....)
            const idToken = getState().authRed.idToken;
            const userId = getState().authRed.userId;
            const date = new Date();
            const response = await fetch(`https://rn-firebase-expo-project.firebaseio.com/orders/${userId}.json?auth=${idToken}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cartItems,
                        totalAmount: totalAmt,
                        date: date.toISOString()
                    }),
                }
            );
            if (!response.ok) {
                throw new Error('Something went wrong')
            }
            const responseData = await response.json();//waits form the response before continuing the exe

            dispatch({
                type: ADD_ORDER,
                orderData: {
                    id: responseData.name,
                    items: cartItems,
                    amount: totalAmt,
                    date,
                }
            });

            try {
                for (const cartItem of cartItems) {
                    const pushToken = cartItem.productPushToken;

                    const response = await fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Accept-Encoding': 'gzip, deflate',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            to: pushToken,
                            title: 'Order Was Placed!',
                            body: cartItem.productTitle + ' was ordered.',

                        }),
                    });
                    const okay = response.ok ? 'okay' : 'not okay';
                    console.log(`sending the push notification async with: ${pushToken} was ${response.ok} `);
                }
            } catch (err) {
                throw err;
            }
        });

};