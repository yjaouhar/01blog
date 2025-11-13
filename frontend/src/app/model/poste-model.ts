export interface PostModel {
    id: number;
    authore: string;
    time: Date;
    title : string;
    descreption : string;
    mediaType : string;
    mediaUrl : string;
    totalLike : number;
    totalComment : number;
    liked : boolean;
}