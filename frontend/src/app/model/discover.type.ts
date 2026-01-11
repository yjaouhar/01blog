

// export interface DiscoverModel {
//     data: User[];
//     currentPage: number;
//     totalPages: number;
//     hasNext: boolean;

// }
export interface User {
    id: string,
    username: string
    name: string,
    email : string,
    avatar: string,
    totalPoste: number,
    followed: boolean
}