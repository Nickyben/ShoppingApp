 import moment from 'moment';// import * as moment from 'moment' returns an error;

class Order{
    constructor(id, items, totalAmt, date){
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmt;
        this.date = date;

    }

    get readableDate(){
        // return this.date.toLocaleDateString('en-EN', {
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric',
        //     hour: '2-digit',
        //     minute: '2-digit',
        // });
        return moment(this.date).format('MMMM Do YYYY, hh:ss a');
    }
}

export default Order;