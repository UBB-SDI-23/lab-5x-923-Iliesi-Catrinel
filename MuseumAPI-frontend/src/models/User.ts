import { UserProfile } from "./UserProfile";

export enum AccessLevel {
    Unconfirmed,
    Regular,
    Moderator,
    Admin,
}

export interface User {
    id?: number;
    name: string;
    password: string;

    accessLevel?: AccessLevel;
    userProfile?: UserProfile;

    artistCount?: number;
    paintingCount?: number;
    museumCount?: number;
    exhibitionCount?: number;
}