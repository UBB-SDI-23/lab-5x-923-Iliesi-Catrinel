import { Artist } from './Artist';
import { Museum } from './Museum';

export interface Exhibition {
    artistId: number;
    artist: Artist;
    museumId: number;
    museum: Museum;
    startDate: Date;
    endDate: Date;

    [key: string]: any;
}
