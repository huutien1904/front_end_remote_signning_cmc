export interface Token {
    tokenId: string,
    tokenName: string,
    slotNumber: string,
    keypairNumber: string,
    tokenPassword: string,
    hsmInformation: {
        hsmId: string,
        hsmName: string,
        hardwareId: string,
        hsmManufacturer: string,
        hsmModel: string,
        hsmLibraryPath: string,
        createdAt: string,
        updatedAt: string
    }
}
