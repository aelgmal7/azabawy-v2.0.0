class ClientModel {
    clientName;
    phoneNumber;
    type;
    typeString;
    totalBalance;
    paid;
    remain;
    posVsNeg;
    orders;
    bills;
    paying;
    enabled;
    constructor(clientName, phoneNumber, type, typeString, totalBalance, paid, remain,orders, bills,paying){
        this.clientName = clientName;
        this.phoneNumber = phoneNumber;
        this.type = type;
        this.typeString = typeString;
        this.totalBalance = totalBalance;
        this.paid = paid;
        this.remain = remain;
        this.orders = orders;
        this.bills= bills;
        this.paying= paying;
        this.posVsNeg = ( (totalBalance - paid)? true : false)

    }


}

module.exports ={ClientModel}