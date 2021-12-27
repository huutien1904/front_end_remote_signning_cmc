export interface Token {
    tokenId: string,
    tokenName: string,
    slotNumber: string,
    keypairNumber: string,
    hsmInformation: Hsm
}

export interface Hsm {
    hardwareId: string,
    hsmName: string,
    hsmManufacturer: string,
    hsmType: string,
    hsmModel: string,
    tokens:Array<Token>;
    hsmLibraryPath: string
}
