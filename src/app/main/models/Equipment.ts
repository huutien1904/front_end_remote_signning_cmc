export interface Token {
    tokenId: string,
    hsmId:number;
    hsmName: string,
    tokenName: string,
    slotNumber: string,
    keypairNumber: string,
    hsmInformation: Hsm
}
export interface tokenInfo {
    label:string,
    manufacturerId: string,
    model: string    ,
    serialNumber: string   ,
    maxSessionCount: number,
    sessionCount: number,
    maxRwSessionCount: number,
    rwSessionCount: number,
    maxPinLen: number,
    minPinLen: number,
    totalPublicMemory: number,
    freePublicMemory: number,
    totalPrivateMemory: number,
    freePrivateMemory: number,
    hardwareVersion: object,
    firmwareVersion: object,
    time: any,
    rng: boolean,
    writeProtected: boolean,
    loginRequired: boolean,
    userPinInitialized: boolean,
    restoreKeyNotNeeded: boolean,
    clockOnToken: boolean,
    protectedAuthenticationPath: boolean,
    dualCryptoOperations: boolean,
    tokenInitialized: boolean,
    secondaryAuthentication: boolean,
    userPinCountLow: boolean,
    userPinFinalTry: boolean,
    userPinLocked: boolean,
    userPinToBeChanged: boolean,
    soPinCountLow: boolean,
    soPinFinalTry: boolean,
    soPinLocked: boolean,
    soPinToBeChanged: boolean
}
export interface Hsm {
    hsmId:number;
    hardwareId: string,
    hsmName: string,
    hsmManufacturer: string,
    hsmType: string,
    hsmModel: string,
    tokens:Array<Token>;
    hsmLibraryPath: string
}
export interface Template{
    keypairId: number,
    cryptoSystem: string,
    keypairLength: string,
    keypairAlias: string,
    keypairStatusName: string,
    p12Content: string,
    organizationName: string,
    
    username: string,
    email: string
}
