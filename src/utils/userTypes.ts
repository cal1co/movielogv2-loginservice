export type User = {
    id:number;
    username:string;
    email: string;
    password: string;
}
export type FollowData = {
    following: number,
    followers: number
}

export type UserData = {
    id: number
    username: string; 
    display_name:string, 
    profile_image: string, 
    active_account: boolean,
    follow_data: FollowData
}


export type UserInfoResponse = {
    id: number
    username:string
}