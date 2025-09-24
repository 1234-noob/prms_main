export interface AuthModel {
    refresh_token:string,
    access_token:string,
    access_token_expiry:number,
    token_type:TokenType,
    user_name:string,
    merchant_id:number
}

interface TokenType{
    value:string
}

export interface UserModel{
    id:number,
    email:string,
    name:string,
    phone:string,
    role:string,
    profile_picture:string
}