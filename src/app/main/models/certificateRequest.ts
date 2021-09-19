import { Keypair } from "./Keypair";

export class CertificateRequest {
    certificateRequestId:string;
    certificateRequest:string;
    certificateRequestCreatedTime:string;
    keypairInformation:Keypair;
}
