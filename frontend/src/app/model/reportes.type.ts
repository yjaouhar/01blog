export interface Reports{
    id: string;
    reasone: string;
    reportedBy: string;
    time: Date;
    type: string;
    reacted: boolean;
    target : string

}
export interface Baned{
    id: string;
    type: string;
    name: string 
    description: string;
    time: Date;
}