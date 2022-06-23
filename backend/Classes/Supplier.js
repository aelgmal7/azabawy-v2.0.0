class SupplierModel {
    clientName;
    phoneNumber;
    type;
    typeString;
    totalBalance;
    paid;
    remain;
    enabled;
    constructor(supplierName, phoneNumber, type, typeString, totalBalance, paid, remain){
        this.supplierName = supplierName;
        this.phoneNumber = phoneNumber;
        this.type = type;
        this.typeString = typeString;
        this.totalBalance = totalBalance;
        this.paid = paid;
        this.remain = remain;
      
    }


}

module.exports ={ SupplierModel}