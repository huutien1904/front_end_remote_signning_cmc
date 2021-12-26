export interface Token {
    tokenId: string,
    tokenName: string,
    slotNumber: string,
    keypairNumber: string,
    tokenPassword: string,
    hsmInformation: Hsm
}

export interface Hsm {
    hardwareId: string,
    hsmName: string,
    hsmManufacturer: string,
    hsmType: string,
    hsmModel: string,
    hsmLibraryPath: string
}
