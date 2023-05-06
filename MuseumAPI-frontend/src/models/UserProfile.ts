import { User } from "./User";

export enum Gender {
    Female,
    Male,
    Other,
}

export enum MaritalStatus {
    Single,
    Married,
    Widowed,
    Separated,
    Divorced,
}

export interface UserProfile {
    userId?: number;
    user?: User;

    bio: string;
    location: string;

    birthday?: string;
    gender: Gender;
    maritalStatus: MaritalStatus;

    pagePreference?: number;
}