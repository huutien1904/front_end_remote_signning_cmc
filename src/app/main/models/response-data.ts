export interface ResponseData<T> {
    result:boolean;
    code:number;
    message:string;
    data:T;
}
