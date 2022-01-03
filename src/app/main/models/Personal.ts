
import { Address } from "./Address";
import { Organization } from "./Organization";

export class Personal {
    staffId:number;
    userId:number;
    username:string;
    firstName:string;
    middleName:string;
    lastName:string;
    birthday:string;
    subscriberCategoryName:string;
    address:Address;
    birthPlace:Address;
    phoneNumber:string;
    email:string;
    organizationName:string;
    personalCountryId:string;
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
