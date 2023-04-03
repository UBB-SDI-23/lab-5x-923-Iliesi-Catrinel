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
	IconButton,
	Tooltip,
} from "@mui/material";

import { useEffect, useState } from "react";
import { BACKEND_API_URL } from "../../constants";
import { ArtistStatistic } from "../../models/ArtistStatistic";

export const ArtistAveragePaintingAge = () => {
    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_API_URL}/artists/getbypaintingage/`)
            .then(response => response.json())
            .then(data => {
                setArtists(data);
                setLoading(false);
            }
            );
    }, []);

    console.log(artists);

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
                            <TableCell align="center">First Name</TableCell>
                            <TableCell align="center">Last Name</TableCell>
                            <TableCell align="center">Birth Date</TableCell>
                            <TableCell align="center">Birth Place</TableCell>
                            <TableCell align="center">Education</TableCell>
                            <TableCell align="center">Movement</TableCell>
                            <TableCell align="center">Average Years Of their Paintings</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {artists.map((artist:ArtistStatistic, index) => (
                            <TableRow key={artist.id}>
                                <TableCell component="th" scope="row">{index + 1}</TableCell>
                                <TableCell align="center">{artist.firstName}</TableCell>
                                <TableCell align="center">{artist.lastName}</TableCell>
                                <TableCell align="center">{artist.birthDate.toLocaleString()}</TableCell>
                                <TableCell align="center">{artist.birthPlace}</TableCell>
                                <TableCell align="center">{artist.education}</TableCell>
                                <TableCell align="center">{artist.movement}</TableCell>
                                <TableCell align="center">{artist.averagePaintingAge}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
                </Table>
            </TableContainer>
        )}
    </Container>
    )
}