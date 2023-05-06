import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	CircularProgress,
	Container,
} from "@mui/material";

import { useEffect, useState } from "react";
import { BACKEND_API_URL } from "../../constants";
import { ArtistStatistic } from "../../models/ArtistStatisticAge";
import axios from "axios";
import { getAuthToken } from "../../auth";

export const ArtistAveragePaintingAge = () => {
    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        setLoading(true);

        const fetchArtists = async () => {
            const response = await axios.get<[]>(
                `${BACKEND_API_URL}/artists/getbypaintingage/`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );

            setArtists(response.data);
            setLoading(false);
        };
        fetchArtists();
    }, []);

    return (
        <Container>
        <h1>All Artists Ordered By The Average Age of their Paintings</h1>
        {loading && <CircularProgress />}
        {!loading && artists.length == 0 && <div>No artists found!</div>}
        {!loading && artists.length > 0 && (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 900 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">First Name</TableCell>
                            <TableCell align="left">Last Name</TableCell>
                            <TableCell align="left">Birth Date</TableCell>
                            <TableCell align="left">Birth Place</TableCell>
                            <TableCell align="left">Education</TableCell>
                            <TableCell align="left">Movement</TableCell>
                            <TableCell align="left">Average Years Of their Paintings</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {artists.map((artist:ArtistStatistic, index) => (
                            <TableRow key={artist.id}>
                                <TableCell component="th" scope="row">{index + 1}</TableCell>
                                <TableCell align="left">{artist.firstName}</TableCell>
                                <TableCell align="left">{artist.lastName}</TableCell>
                                <TableCell align="left">{artist.birthDate.toLocaleString()}</TableCell>
                                <TableCell align="left">{artist.birthPlace}</TableCell>
                                <TableCell align="left">{artist.education}</TableCell>
                                <TableCell align="left">{artist.movement}</TableCell>
                                <TableCell align="left">{artist.averagePaintingAge}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
                </Table>
            </TableContainer>
        )}
    </Container>
    )
}