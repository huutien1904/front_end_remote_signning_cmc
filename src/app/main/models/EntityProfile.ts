export class EntityProfile{
     endEntityProfileId : number;
     endEntityProfileName : string;
     distinguishedName : Attribute[];
     alternativeName : Attribute[];

}
export class Attribute{
    name:String;
    defaultValue:string;
    required:boolean;
    modifiable:boolean;
    validation:boolean;
}