import Product from '../../models/product';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';


export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return (

        async (dispatch, getState) => {
            //async code
            const idToken = getState().authRed.idToken;
            const userId = getState().authRed.userId;
            try {
                //CHECK IF YOU CAN ALSO GET THE PUSH TOKEN FOR THAT DEVICE
                const response = await fetch('https://rn-firebase-expo-project.firebaseio.com/myProducts.json',
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

                const loadedProducts = [];
                for (const key in responseData) {
                    //const tempImageUrl = '../../assets/splash.png'; //imageUrl;//get from web 

                    loadedProducts.push(new Product(
                        key,//id of the product (from the auto firebase key)
                        responseData[key].ownerId,//user for now =u1***
                        responseData[key].devicePushToken,//user for now =u1***
                        responseData[key].title,
                        responseData[key].imageUrl,
                        responseData[key].description,
                        responseData[key].price,
                    ));
                }
                //console.log(responseData);
                dispatch({
                    type: SET_PRODUCTS,
                    products: loadedProducts,
                    userProducts: loadedProducts.filter(prod => prod.ownerId === userId),
                });
            } catch (err) {
                //send to custom analytics server
                throw err;
            }
        }
    );
};


export const deleteProduct = prodId => {
    return (async (dispatch, getState) => {

        //getState returns entire state of redux store . ie all the state slices from 
        //all reducers; just like when using useSelector(state=> state.myRed....)
        const idToken = getState().authRed.idToken;


        const response = await fetch(`https://rn-firebase-expo-project.firebaseio.com/myProducts/${prodId}.json?auth=${idToken}`,
            {
                method: 'DELETE',
            }
        );
        if (!response.ok) {
            throw new Error('Oops! something went wrong!');
        }

        dispatch({
            type: DELETE_PRODUCT,
            productId: prodId,
        });
    });


};

export const createProduct = (title, descrip, imageUrl, price) => {
    return (
        async (dispatch, getState) => {
            //async code
            let pushToken;
            let notificationsPermStatusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            if (notificationsPermStatusObj.status !== 'granted') {
                notificationsPermStatusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            }
            if (notificationsPermStatusObj.status !== 'granted') {
                pushToken = null;
                //alert
            } else {
                pushToken = (await Notifications.getExpoPushTokenAsync()).data;
            }

            //getState returns entire state of redux store . ie all the state slices from 
            //all reducers; just like when using useSelector(state=> state.myRed....)
            const idToken = getState().authRed.idToken;
            const userId = getState().authRed.userId;


            //waits form the response before continuing with other exe below
            const response = await fetch(`https://rn-firebase-expo-project.firebaseio.com/myProducts.json?auth=${idToken}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description: descrip,
                        imageUrl,
                        price,
                        ownerId: userId,

                        //or ownerPushToken
                        devicePushToken: pushToken, //what if the person logs in with another device????? 
                        //this probably should be from db stored/updated (which should change each time the user logs in with a new device(and new app)) in order to capture the right device/app installation
                    }),
                }
            );

            const responseData = await response.json();//waits form the response before continuing the exe

            //console.log(responseData);//to see the response of the POST

            //dispatch
            dispatch(
                {
                    type: CREATE_PRODUCT,
                    productData: {
                        id: responseData.name,
                        title: title,
                        pushToken: pushToken,
                        description: descrip,
                        imageUrl,
                        price,
                        ownerId: userId
                    },
                }
            );
            console.log('dispatched creation with pushToken: '+ pushToken);
        }
    );
};

//UPDATE (EDIT) PRODUCTS ACTION CREATOR
export const editProduct = (id, title, descrip, imageUrl) => {
    return (
        async (dispatch, getState) => {
            //getState returns entire state of redux store . ie all the state slices from 
            //all reducers; just like when using useSelector(state=> state.myRed....)
            const idToken = getState().authRed.idToken;


            const response = await fetch(`https://rn-firebase-expo-project.firebaseio.com/myProducts/${id}.json?auth=${idToken}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description: descrip,
                        imageUrl,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Oops! something went wrong!');
            }
            dispatch({
                type: EDIT_PRODUCT,
                productId: id,
                productData: {
                    title: title,
                    description: descrip,
                    imageUrl,
                    //modern js syntax, the  key and value have the same name...ie param=key, arg = val

                },
            })
        }


    );
};