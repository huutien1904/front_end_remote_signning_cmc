export interface Address {
    addressId: number;
    streetId: number;
    communeId: number;
    districtId: number;
    provinceId: number;
    countryId: number;
    houseNumber:string;
}
export interface AddressFull {
    addressId: number;
    houseNumber:string;
    streetId: number;
    streetName:string;
    communeId: number;
    communeName:string;
    districtId: number;
    districtName:string;
    provinceId: number;
    provinceName:string;
    countryId: number;
    countryName:string
}
export interface Province {
    provinceId:number;
    provinceName:string;
    provinceType:string;
    provinceDisplay:string;
    countryId: number;
}
export interface  District{
    districtId:number;
    districtName:string;
    districtType:string;
    districtDisplay:string;
    provinceId:number;
}

export interface  Commune{
    communeId:number;
    communeName:string;
    communeType:string;
    communeDisplay:string;
    provinceId:number;
}
export interface  Street{
    streetId:number;
    streetName:string;
    streetType:string;
    streetDisplay:string;
    communeId:number;
}