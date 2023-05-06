import { Artist } from './Artist';
import { Exhibition } from './Exhibition';
import { User } from './User';

export interface Museum {
    id?: number;
    name: string;
    address: string;
    foundationDate: Date;
    architect: string;
    website: string;
    artists?: Artist[];
    exhibitions?: Exhibition[];

    userId?: number;
    user?: User;

    [key: string]: any;
}