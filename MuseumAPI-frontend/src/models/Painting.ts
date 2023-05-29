import { Artist } from './Artist';
import { User } from './User';

export interface Painting {
    id?: number;
    title: string;
    creationYear: number;
    height: number;
    subject: string;
    medium: string;
    description?: string;
    price: number;
    artist?: Artist;
    artistId: number;

    userId?: number;
    user?: User;

    [key: string]: any;
}