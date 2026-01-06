export interface ProfileModel {
    id: string,
    firstName: string,
    lasteName: string,
    birthday: string,
    gender: string,
    bio: string,
    userName: string,
    email: string,
    avatar: string,
    reported: boolean; 
    role: string,
    postes: number;
    followers: number;
    following: number;
    personelProfile: boolean;
    reacted: boolean;
}