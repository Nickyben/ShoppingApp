
class Product{
    constructor(id, ownerId, devicePushToken, title, imageUrl, description, price){
        this.id = id;
        this.ownerId= ownerId;
        this.pushToken= devicePushToken;
        this.title = title;
        this.imageUrl=imageUrl;
        this.description = description;
        this.price = price;
    }
}

export default Product;