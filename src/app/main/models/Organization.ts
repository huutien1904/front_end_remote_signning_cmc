import { Address } from "cluster";

export class Organization {
    countryOrganizationId:string;
    organizationName:string;
    parentOrganizationId:string;
    subscriberCategory:string;
    leaderName:string;
    phoneNumber:string;
    website:string;
    email:string;
    organizationId:string;
    createdUser:string;
    managedUser:string;
    subscriberId:string;
    subscriberCategoryName: any;
    username: string;
    parentOrganizationName: string;
    address: any;
}

export class OrganizationCategory{
    subscriberCategoryId:string;
    subscriberCategoryName:string;
}
