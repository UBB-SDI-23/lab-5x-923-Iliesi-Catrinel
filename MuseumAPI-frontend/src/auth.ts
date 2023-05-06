import { User } from "./models/User";

let token: string | null = null;
let account: User | null = null;

export const setAuthToken = (newToken: string | null) => {
    token = newToken;
};

export const getAuthToken = () => {
    return token;
};

export const setAccount = (newAccount: User | null) => {
    account = newAccount;
}

export const getAccount = () => {
    return account;
}

export const updatePref = (pref: number) => {
    if (account && account.userProfile) {
        account.userProfile.pagePreference = pref;
    }
}