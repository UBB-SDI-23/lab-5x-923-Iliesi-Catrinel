import { useState,useContext  } from 'react';
import { TextField, Button, Container, TableContainer, Table, colors, TableHead, TableCell, TableRow, TableBody, Tooltip, IconButton, Paper, useTheme, useMediaQuery, Grid, CardContent, Card, Typography, CardActions, Box } from '@mui/material';
import ReadMoreIcon from "@mui/icons-material/ReadMore"
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { Link } from "react-router-dom";
import { BACKEND_API_URL } from '../../constants';
import { Painting } from '../../models/Painting';
import { getAuthToken, isAuthorized } from '../../auth';
import { SnackbarContext } from '../SnackbarContext';
import axios, { AxiosError } from 'axios';
import Paginator from '../Paginator';

export const PaintingFilter = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(false);
    const [paintings, setPaintings] = useState<Painting[]>([]);

    const [yearText, setYearText] = useState("1900");

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));

    const headers = [
        { text: "#", propName: "", hide: false },
        { text: "Title", propName: "title", hide: false },
        { text: "Creation Year", propName: "year", hide: false },
        { text: "Height", propName: "height", hide: isLargeScreen },
        { text: "Subject", propName: "subject", hide: isLargeScreen },
        { text: "Medium", propName: "", hide: isLargeScreen },
        { text: "Description", propName: "", hide: isLargeScreen },
        { text: "Artist", propName: "", hide: false },
        { text: "User", propName: "", hide: false },
        { text: "Operations", propName: "", hide: false },
    ];

    const fetchPaintings = async (year: number) => {
        setLoading(true);
        try {
            await axios
                .get<Painting[]>(
                    `${BACKEND_API_URL}/paintings/Filter?year=${year}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setPaintings(data);

                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch paintings!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch paintings due to an unknown error!"
            );
        }
    };

    function parseData() {
        const value = parseInt(yearText, 10);

        if (value >= 1000 && value <= 3000) {
            fetchPaintings(value);
        } else {
            openSnackbar(
                "error",
                "Please enter a valid number (1000 <= year <= 3000)"
            );
        }
    }

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        const key = event.key;

        // Only allow digits (0-9) and Enter
        if (
            ![
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "Enter",
            ].includes(key)
        ) {
            event.preventDefault();
        } else if (key === "Enter") {
            parseData();
        }
    }

    return (
        <Container>
            <h1>Filter Paintings</h1>
             <Container sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <p
                    style={{
                        marginRight: 8,
                        userSelect: "none",
                    }}
                >
                    {`Minimum creation year: `}
                </p>
                <TextField 
                    label="year" 
                    type="text"
                    inputProps={{ min: 1, style: { textAlign: "center" } }}
                    onChange={(event) => setYearText(event.target.value)}
                    onKeyPress={handleInputKeyPress}
                    variant="outlined"
                    size="small"
                    style={{
                        width: 100,
                        marginRight: 16,
                    }}
                />
                <Button variant="contained" onClick={parseData}>Filter</Button>
            </Container>
            {loading && <div>Loading...</div>}
            {!loading && paintings.length === 0 && <div>No paintings found after the given year.</div>}
            {!loading && paintings.length > 0 && (isMediumScreen ? (
                    <Grid container spacing={3}>
                        {paintings.map((painting, index) => (
                            <Grid item xs={12} sm={6} md={4} key={painting.id}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                        >
                                            {painting.title}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {"Artist: "}
                                            {painting.artist?.firstName + " " + painting.artist?.lastName ??"Unknown"}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Year: {painting.creationYear}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Height:{" "}
                                            {painting.height}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton
                                            component={Link}
                                            to={`/paintings/${painting.id}/details`}
                                        >
                                            <Tooltip
                                                title="View painting details"
                                                arrow
                                            >
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            sx={{ ml: 1, mr: 1 }}
                                            to={`/paintings/${painting.id}/edit`}
                                            disabled={
                                                !isAuthorized(painting.user?.id)
                                            }
                                        >
                                            <Tooltip
                                                title="Edit painting"
                                                arrow
                                            >
                                                <EditIcon />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            to={`/paintings/${painting.id}/delete`}
                                            disabled={
                                                !isAuthorized(painting.user?.id)
                                            }
                                            sx={{
                                                color: "red",
                                            }}
                                        >
                                            <Tooltip
                                                title="Delete painting"
                                                arrow
                                            >
                                                <DeleteForeverIcon />
                                            </Tooltip>
                                        </IconButton>
                                    </CardActions>
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
                                                align={
                                                    header.text === "Operations"
                                                        ? "center"
                                                        : "left"
                                                }
                                            >
                                                {header.text}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paintings.map((painting, index) => {
                                    const paintingData = [
                                        index + 1,
                                        painting.name,
                                        painting.creationYear,
                                        painting.height,
                                        painting.subject,
                                        painting.medium,
                                        painting.description,
                                        painting.artist?.firstName + ' ' + painting.artist?.lastName ??
                                            "Unknown",
                                        painting.user?.name ? (
                                            <Link
                                                to={`/users/${painting.user?.id}/details`}
                                                title="View user details"
                                            >
                                                {painting.user?.name}
                                            </Link>
                                        ) : (
                                            <p>N/A</p>
                                        ),
                                        <Box
                                            display="flex"
                                            alignItems="flex-start"
                                            justifyContent="center"
                                        >
                                            <IconButton
                                                component={Link}
                                                to={`/paintings/${painting.id}/details`}
                                            >
                                                <Tooltip
                                                    title="View painting details"
                                                    arrow
                                                >
                                                    <ReadMoreIcon color="primary" />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                sx={{ ml: 1, mr: 1 }}
                                                to={`/paintings/${painting.id}/edit`}
                                                disabled={
                                                    !isAuthorized(
                                                        painting.user?.id
                                                    )
                                                }
                                            >
                                                <Tooltip
                                                    title="Edit painting"
                                                    arrow
                                                >
                                                    <EditIcon />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                to={`/paintings/${painting.id}/delete`}
                                                disabled={
                                                    !isAuthorized(
                                                        painting.user?.id
                                                    )
                                                }
                                                sx={{ color: "red" }}
                                            >
                                                <Tooltip
                                                    title="Delete painting"
                                                    arrow
                                                >
                                                    <DeleteForeverIcon />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>,
                                    ];
                                    return (
                                        <TableRow key={painting.id}>
                                            {paintingData.map((data, i) => {
                                                const header = headers[i];
                                                if (header.hide) {
                                                    return null;
                                                }
                                                return (
                                                    <TableCell
                                                        key={i}
                                                        align={
                                                            header.text ===
                                                            "Operations"
                                                                ? "center"
                                                                : "left"
                                                        }
                                                    >
                                                        {data}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ))}
        </Container>
    );
};