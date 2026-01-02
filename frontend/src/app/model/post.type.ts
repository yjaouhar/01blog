export interface PostModel {
    data: Post[];
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
}
export interface Post {
    id: string;
    authore: string;
    avatar: string;
    createTime: Date;
    updateTime: Date
    descreption: string;
    media: [{
        mediaType: string,
        mediaUrl: string
    }]
    totalLike: number;
    totalComment: number;
    liked: boolean;
}
export type Media = {
    mediaType: string; mediaUrl: string;
}