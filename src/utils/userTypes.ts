export type User = {
    id:number;
    username:string;
    email: string;
    password: string;
}

export type UserVerbose = {
    id: number
    username: string; 
    display_name:string, 
    proflie_image: string, 
    active_account: boolean
}

export type UserInfoResponse = {
    id: number
    username:string
}