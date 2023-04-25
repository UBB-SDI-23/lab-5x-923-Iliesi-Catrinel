import { Artist } from './Artist';

export interface Painting {
    id?: number;
    title: string;
    creationYear: number;
    height: number;
    subject: string;
    medium: string;
    description?: string;
    artist?: Artist;
    artistId: number;

    [key: string]: any;
}