
import { Address } from "./Address";
import { Organization } from "./Organization";

export class Personal {
    personalId:number;
    userId:number;
    personalFirstName:string;
    personalMiddleName:string;
    personalLastName:string;
    birthday:string;
    address:Address;
    birthPlace:Address;
    phoneNumber:string;
    email:string;
    organization:string;
    personalCountryId:string;
    isActive:boolean;
    gender:string;
    
}
export class PersonalDetail {
    address:Address;
    birthPlace:Address;
    birthday:string;
    createdAt:string;
    createdUser:string;
    email:string;
    gender:string;
    isActive:boolean;
    managedUser:string;
    organization:Organization;
    personalCountryId:string;
    personalFirstName:string;
    personalId:string;
    personalLastName:string;
    personalMiddleName:string;
    phoneNumber:string;
    subscriberId:string;
    updatedAt:string;
}
