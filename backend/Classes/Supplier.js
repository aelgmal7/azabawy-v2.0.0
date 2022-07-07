class SupplierModel {
    supplierName;
    type;
    typeString;
    totalBalance;
    paid;
    remain;
    enabled;
    constructor(supplierName,totalBalance, paid, type=false, typeString="مورد"){
        this.supplierName = supplierName;
        this.type = type;
        this.typeString = typeString;
        this.totalBalance = totalBalance;
        this.paid = paid;
        this.remain = Number(totalBalance) - Number(paid);
    
      
    }


}

module.exports ={ SupplierModel}