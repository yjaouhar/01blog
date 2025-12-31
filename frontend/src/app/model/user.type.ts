export interface User {
    user: any
    status: String
    data: {
        id: string,
        username: string,
        token: string
    },
    errors: string
}