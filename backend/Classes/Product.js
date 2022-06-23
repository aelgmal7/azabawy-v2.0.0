class ProductModel {
        productName;
        weightsAndAmounts
        totalWeight;
        totalAmount;
        kiloPrice;
        alarm;

        constructor(productName,weightsAndAmounts,kiloPrice,alarm) {
                this.productName = productName;
                const amounts = weightsAndAmounts.map(item => item.a)
                this.totalAmount = amounts.reduce((total,item)=> {
                        console.log("aaa a",  (total))
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
        }       
}
module.exports = {ProductModel}