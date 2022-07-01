class ClientModel {
    clientName;
    phoneNumber;
    type;
    typeString;
    totalBalance;
    paid;
    remain;
    enabled;
    constructor(clientName, phoneNumber, type=true, typeString="عميل", totalBalance, paid, remain){
        this.clientName = clientName;
        this.phoneNumber = phoneNumber;
        this.type = type;
        this.typeString = typeString;
        this.totalBalance = totalBalance;
        this.paid = paid;
        this.remain = remain;
      
    }


}

module.exports ={ClientModel}