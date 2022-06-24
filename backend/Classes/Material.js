class MaterialModel {
    materialName;
    totalWeight;
    totalAmount;
    kiloPrice;
    unit;
    alarm;
///
//////////////////////////////////////////////////////////////////////////////////////////////// //////////// 
///// TODO not completed idea 
    constructor(materialName,weightsAndAmountsMat,kiloPrice,unit,alarm) {
            this.materialName = materialName;
            const amounts = weightsAndAmountsMat.map(item => item.a)
            this.totalAmount = amounts.reduce((total,item)=> {
                    return Number(total) + Number(item)
            })
            const tmp = weightsAndAmountsMat.map((item,index)=> {
                    return (Number(item.w) * Number(item.a))
            })
            this.totalWeight = tmp.reduce((total,num)=> {
                    return Number(total) + Number(num)
            })
            this.kiloPrice = kiloPrice;
            this.alarm= alarm;
            this.unit= unit;
    }       
}
module.exports = {MaterialModel}