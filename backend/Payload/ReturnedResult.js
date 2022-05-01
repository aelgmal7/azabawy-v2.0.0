 import {HTTP_STATUS_CODES} from './statusCode.ts' ;
 export class ReturnedResult {

   status ;
    succeeded;
   result;
  constructor(status, succeeded , result) {
    this.status=status;
    this.succeeded=succeeded;
    this.result=result;

  }
}

export const returnedResult =(status,succeeded,result) => {
  let tmp = new ReturnedResult(status,succeeded,result)
  return tmp; 
}
module.exports={returnedResult}