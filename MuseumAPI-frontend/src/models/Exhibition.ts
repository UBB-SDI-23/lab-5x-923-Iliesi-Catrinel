import { Artist } from './Artist';
import { Museum } from './Museum';
import { User } from './User';

export interface Exhibition {
    artistId: number;
    artist?: Artist;
    museumId: number;
    museum?: Museum;
    startDate: Date;
    endDate: Date;

    userId?: number;
    user?: User;

    [key: string]: any;
}
