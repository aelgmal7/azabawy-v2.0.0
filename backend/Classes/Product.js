class ProductModel {
        productName;
        amounts;
        weights;
        totalWeight;
        totalAmount;
        unit;
        alarm;
        supplierName;

        constructor(productName, amounts,weights,unit,alarm,supplierName) {
                this.productName = productName;
                this.amounts = amounts;
                this.weights = weights;
                this.totalAmount = amounts.split(',').reduce((total,num)=> {
                        return Number(total) + Number(num)
                })
                const tmp = weights.split(',').map((w,index)=> {
                        console.log( amounts.split(',')[index] )
                        return (Number(w) * Number(amounts.split(',')[index]))
                })
                this.totalWeight = tmp.reduce((total,num)=> {
                        return Number(total) + Number(num)
                })
                
               
                this.unit= unit;
                this.alarm= alarm;
        }       
}
module.exports = {ProductModel}