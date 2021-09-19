import { Token } from './Equipment'

export interface certificateRequest
{
    certificateRequestId: string,
    certificateRequest: string,
    certificateRequestCreatedTime: string,
    keypairInformation: {
        keypairId: string,
        cryptoSystem: string,
        keypairParameter: null,
        keypairLength: string,
        tokenInformation: {
            tokenInformation: Token,
            createdAt: string
            updatedAt: string,
            hibernateLazyInitializer: {}
        },
        keypairStatus: {
            keypairStatusId: string,
            keypairStatus: string,
            createdAt: string,
            updatedAt: string
        },
        keypairTemplate: {
            keypairTemplateId: string,
            keypairTemplateName: string,
            privateKeyExtractable: boolean,
            privateKeySensitive: boolean,
            privateKeyDerive: boolean,
            privateKeyDecrypt: boolean,
            privateKeySign: boolean,
            privateKeySignRecover: boolean,
            privateKeyUnwrap: boolean,
            publicKeyModifiable: boolean,
            publicKeyToken: boolean,
            publicKeyPrivate: boolean,
            publicKeyDerive: boolean,
            publicKeyPublicExponent: string,
            publicKeyModulusBits: string,
            publicKeyWrap: boolean,
            createdAt: string,
            updatedAt: string
        },
        createdAt: string,
        updatedAt: string,
        certificateRequests: [
            {
                certificateRequestId: string,
                certificateRequest: string,
                certificateRequestCreatedTime: string
            }
        ]
    },
    createdAt: string,
    updatedAt: string
}
