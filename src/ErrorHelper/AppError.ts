class AppError extends Error{
      public statusCode:number;
      constructor(statuscode:number,message:string,stack:''){
            super(message)//throw new error ('somethig went wrong') this message is comming form our javascript error message

            this.statusCode = statuscode// this. status code is come form our public variable.

            if(stack){
                  this.stack = stack
            }else{
                  Error.captureStackTrace(this,this.constructor)
            }
      }
}

export default AppError;