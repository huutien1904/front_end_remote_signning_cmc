export interface Address {
    addressId: number;
    streetId: number;
    communeId: number;
    districtId: number;
    provinceId: number;
    countryId: number;
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