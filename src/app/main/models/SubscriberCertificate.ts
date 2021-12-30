import { KeypairStatus } from "./Keypair";

export class SubscriberCertificate {
    subscriberCertificateId:number;
    certificateContent:string;
    keypairAlias:string;
    email:string;
    keypairStatus:KeypairStatus;
    tokenName;
}