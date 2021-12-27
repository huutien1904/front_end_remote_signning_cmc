import { Keypair } from "./Keypair";

export class CertificateRequest {
    certificateRequestId:string;
    certificateRequestContent:string;
    email:string;
    keypairAlias:string;
}