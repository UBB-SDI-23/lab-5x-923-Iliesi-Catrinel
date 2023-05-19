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
    useTheme,
    useMediaQuery,
    Card,
    Typography,
    Grid,
    CardContent,
} from "@mui/material";

import { useEffect, useState } from "react";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { ArtistStatisticAge } from "../../models/ArtistStatisticAge";
import axios from "axios";
import { getAuthToken } from "../../auth";

export const ArtistAveragePaintingAge = () => {
    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState([]);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));

    const headers = [
        { text: "#", hide: false },
        { text: "First Name", hide: false },
        { text: "Last Name", hide: false },
        { text: "Birth Date", hide: isLargeScreen },
        { text: "Birth Place", hide: isLargeScreen },
        { text: "Education", hide: isLargeScreen },
        { text: "Movement", hide: false },
        { text: "Average Age Of their Paintings", hide: false },
    ];

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
        {!loading && artists.length > 0 && (isMediumScreen ? (
            <Grid container spacing={3}>
                {artists.map((artist: ArtistStatisticAge, index) => (
                    <Grid item xs={12} sm={6} md={4} key={artist.id}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    component="div"
                                >
                                    {artist.firstName} {" "}{artist.lastName}
                                </Typography>
                                <Typography color="text.secondary">
                                    {"Movement: "}
                                    {artist.movement}
                                </Typography>
                                <Typography color="text.secondary">
                                    Average Painting Age: {artist.averagePaintingAge}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 0 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {headers.map((header, i) => {
                                        if (header.hide) {
                                            return null;
                                        }
                                        return (
                                            <TableCell
                                                key={i}
                                                style={{ userSelect: "none" }}
                                                align="left"
                                            >
                                                {header.text}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {artists.map(
                                    (artist: ArtistStatisticAge, index) => {
                                        const artistData = [
                                            index + 1,
                                            artist.firstName,
                                            artist.lastName,
                                            formatDate(artist.birthDate),
                                            artist.birthPlace,
                                            artist.education,
                                            artist.movement,
                                            artist.averagePaintingAge,
                                        ];
                                        return (
                                            <TableRow key={artist.id}>
                                                {artistData.map((data, i) => {
                                                    const header = headers[i];
                                                    if (header.hide) {
                                                        return null;
                                                    }
                                                    return (
                                                        <TableCell
                                                            key={i}
                                                            align="left"
                                                        >
                                                            {data}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ))}
        </Container>
    );
};