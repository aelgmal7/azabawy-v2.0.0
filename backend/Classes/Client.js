class ClientModel {
    clientName;
    type;
    typeString;
    totalBalance;
    paid;
    remain;
    enabled;
    constructor(clientName,totalBalance, paid, type=true, typeString="عميل"){
        this.clientName = clientName;
        this.type = type;
        this.typeString = typeString;
        this.totalBalance = totalBalance;
        this.paid = paid;
        this.remain =  Number(totalBalance) - Number(paid);;
      
    }


}

module.exports ={ClientModel}