export class Profile{
     endEntityProfileId : number;
     endEntityProfileName : string;
     distinguishedName : Attribute[];
     alternativeName : Attribute[];

}
export class Attribute{
    name:String;
    required:boolean;
    modifiable:boolean;
    validation:boolean;
}