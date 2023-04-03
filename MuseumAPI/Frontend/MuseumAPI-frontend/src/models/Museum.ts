import { Artist } from './Artist';
import { Exhibition } from './Exhibition';

export interface Museum {
    id: number;
    name: string;
    address: string;
    foundationDate: Date;
    architect: string;
    website: string;
    artists: Artist[];
    exhibitions: Exhibition[];
}