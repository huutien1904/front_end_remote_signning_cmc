export interface Token {
    tokenId: string,
    hsmId:number;
    hsmName: string,
    tokenName: string,
    slotNumber: string,
    keypairNumber: string,
    hsmInformation: Hsm
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
