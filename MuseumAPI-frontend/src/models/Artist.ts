import { Exhibition } from "./Exhibition";
import { Museum } from "./Museum";
import { Painting } from "./Painting";

export interface Artist {
    id?: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    birthPlace: string;
    education: string;
    movement: string;
    paintings?: Painting[];
    museums?: Museum[];
    exhibitions?: Exhibition[];

    [key: string]: any;
}
