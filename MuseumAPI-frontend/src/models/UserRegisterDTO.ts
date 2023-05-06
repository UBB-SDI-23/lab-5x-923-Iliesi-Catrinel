import { MaritalStatus, Gender } from "./UserProfile";

export interface UserRegisterDTO {
    name: string;
    password: string;

    bio: string;
    location: string;

    birthday?: string;
    gender: Gender;
    maritalStatus: MaritalStatus;
}