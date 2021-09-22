export interface Token {
    tokenId: string,
    tokenName: string,
    slotNumber: string,
    keypairNumber: string,
    tokenPassword: string,
    hsmInformation: Hsm
}

export interface Hsm {
    hsmId: string,
    hsmName: string,
    hardwareId: string,
    hsmManufacturer: string,
    hsmModel: string,
    hsmLibraryPath: string
}
