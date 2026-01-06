export class Edit {
    profileId: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    gender: string | null;
    birthday: string | null;
    bio: string | null;
    email: string | null;
    removeMedia: boolean|null;
    constructor(profileId: string) {
        this.profileId = profileId;
        this.firstName = null;//
        this.lastName = null;//
        this.username = null;//
        this.gender = null;//
        this.birthday = null;//
        this.bio = null;//
        this.email = null;//
        this.removeMedia =null
    }


}