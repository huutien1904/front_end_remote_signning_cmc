import { CertificateRequest } from "./CertificateRequest";

export class Keypair {
  keypairId: string;
  userId:string;
  cryptoSystem: string;
  keypairLength: string;
  keypairAlias: string;
  keypairTemplate: string;
  keypairStatus: string;
  updatedAt:string;
  createdAt:string
}
export class KeypairAccessRight{
  keyAlias:string;
}
export class KeypairStatus {
  keypairStatusId: string;
  keypairStatus: string;
}
export class KeypairTemplate {
  keypairTemplateId: string;
  keypairTemplateName: string;
  privateKeyExtractable: boolean;
  privateKeySensitive: boolean;
  privateKeyDerive: boolean;
  privateKeyDecrypt: boolean;
  privateKeySign: boolean;
  privateKeySignRecover: boolean;
  privateKeyUnwrap: boolean;
  publicKeyModifiable: boolean;
  publicKeyToken: boolean;
  publicKeyPrivate: boolean;
  publicKeyDerive: boolean;
  publicKeyPublicExponent: string;
  publicKeyModulusBits: string;
  publicKeyWrap: boolean;
}
