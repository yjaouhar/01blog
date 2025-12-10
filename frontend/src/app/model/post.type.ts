export interface PostModel {
    id: string;
    authore: string;
    avatar: string;
    time: Date;
    title: string;
    descreption: string;
    mediaType: string;
    mediaUrl: string;
    totalLike: number;
    totalComment: number;
    liked: boolean;
}