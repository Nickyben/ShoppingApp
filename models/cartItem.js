class CartItem {
    constructor(qnt, price, title, pushToken, sum){
        this.quantity = qnt;
        this.productPrice = price;
        this.productTitle = title;
        this.pushToken = pushToken;
        this.productSum = sum;

    }
}

export default CartItem; 