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
}
export class ParentOrganizationId{
    parentOrganizationId:string
}
export class SubscriberCategoryId{
    subscriberCategoryId:string
}