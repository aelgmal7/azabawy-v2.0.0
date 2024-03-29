class ProductModel {
        productName;
        totalWeight;
        totalAmount;
        kiloPrice;
        alarm;
        type;

        constructor(productName,weightsAndAmounts,kiloPrice,alarm,type) {
                this.productName = productName;
                const amounts = weightsAndAmounts.map(item => item.a)
                this.totalAmount = amounts.reduce((total,item)=> {
                        return Number(total) + Number(item)
                })
                const tmp = weightsAndAmounts.map((item,index)=> {
                        return (Number(item.w) * Number(item.a))
                })
                this.totalWeight = tmp.reduce((total,num)=> {
                        return Number(total) + Number(num)
                })
                this.kiloPrice = kiloPrice
                this.alarm= alarm;
                this.type = type
        }       
}
module.exports = {ProductModel}