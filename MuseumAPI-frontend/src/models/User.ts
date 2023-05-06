import { UserProfile } from "./UserProfile";

export interface User {
    id?: number;
    name: string;
    password: string;

    accessLevel?: number;
    userProfile?: UserProfile;

    artistCount?: number;
    paintingCount?: number;
    museumCount?: number;
    exhibitionCount?: number;
}