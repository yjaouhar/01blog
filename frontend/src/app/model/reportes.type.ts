// export interface ReportResponse<T> {
//     data: T[];
//     currentPage: number;
//     totalPages: number;
//     hasNext: boolean;
// }

export interface Reports {
    id: string;
    type: string;
    reporter: string;
    time: Date;
    target: string;
    reason: boolean;
    status: string

}
export interface Users {
    id:string
    avatart: string;
    username: string;
    email: string;
    status: boolean;
}
export interface Baned {
    id: string;
    type: string;
    name: string
    description: string;
    time: Date;
}
export interface Stats {
    totalUsers: number;
    totalPosts: number;
    activeReports: number;
    banned: number;
}
