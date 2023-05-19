import { useContext, useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { getAccount, getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";
import Paginator from "../Paginator";

export const AllArtists = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState<Artist[]>([]);

	const [sorting, setSorting] = useState({ key: 'column name', ascending: false });

	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
	const [totalPages, setTotalPages] = useState(999999);

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
        { text: "Movement", hide: isLargeScreen },
        { text: "# of Paintings", hide: false },
        { text: "User", hide: false },
        { text: "Operations", hide: false },
    ];
	
	const fetchPageCount = async () => {
        try {
            await axios
                .get<number>(
                    `${BACKEND_API_URL}/artists/count/${pageSize}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setTotalPages(data);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch page count!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch page count due to an unknown error!"
            );
        }
    };

    useEffect(() => {
        fetchPageCount();
    }, [pageSize]);
	  
    const fetchArtists = async () => {
        setLoading(true);
        try {
            await axios
                .get<Artist[]>(
                    `${BACKEND_API_URL}/artists/${pageIndex}/${pageSize}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setArtists(data);
                    setLoading(false);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch artists!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch artists due to an unknown error!"
            );
        }
    };

    useEffect(() => {
        fetchArtists();
    }, [pageIndex, pageSize]);

	function applySorting(key: string, ascending: boolean) {
		setSorting({ key: key, ascending: ascending });
	}

	useEffect(() => {
        if (artists.length === 0) {
            return;
        }

        const currentArtists = [...artists];
        const sortedCurrentArtists = currentArtists.sort((a, b) => {
            return a[sorting.key].localeCompare(b[sorting.key]);
        });

        setArtists(
            sorting.ascending
                ? sortedCurrentArtists
                : sortedCurrentArtists.reverse()
        );
    }, [sorting]);

    return (
		<Container data-testid="test-all-artists-container">
			<h1>All artists</h1>

			{loading && <CircularProgress />}
			{!loading && artists.length === 0 && <p style={{ marginLeft: 16 }}>No artists found!</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/artists/add`} disabled={getAccount() === null}>
					<Tooltip title="Add a new artist" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}
			{!loading && artists.length > 0 && 
				(isMediumScreen ? (
                    <Grid container spacing={3}>
                        {artists.map((artist, index) => (
                            <Grid item xs={12} sm={6} md={4} key={artist.id}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                        >
                                            {artist.firstName}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                        >
                                            {artist.lastName}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {"# of Paintings: "}
                                            {artist.paintings?.length}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton
                                            component={Link}
                                            to={`/artists/${artist.id}/details`}
                                        >
                                            <Tooltip
                                                title="View artist details"
                                                arrow
                                            >
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            sx={{ ml: 1, mr: 1 }}
                                            to={`/artists/${artist.id}/edit`}
                                            disabled={
                                                !isAuthorized(artist.user?.id)
                                            }
                                        >
                                            <Tooltip title="Edit artist" arrow>
                                                <EditIcon />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            to={`/artists/${artist.id}/delete`}
                                            disabled={
                                                !isAuthorized(artist.user?.id)
                                            }
                                            sx={{ color: "red" }}
                                        >
                                            <Tooltip title="Delete artist" arrow>
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
                                {artists.map((artist, index) => {
                                    const artistData = [
                                        pageIndex * pageSize + index + 1,
                                        artist.firstName,
                                        artist.lastName,
                                        artist.birthDate.toLocaleString(),
                                        artist.birthPlace,
                                        artist.education,
                                        artist.movement,
                                        artist.paintings?.length,
                                        artist.user?.name ? (
                                            <Link
                                                to={`/users/${artist.user?.id}/details`}
                                                title="View user details"
                                            >
                                                {artist.user?.name}
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
                                                to={`/artists/${artist.id}/details`}
                                            >
                                                <Tooltip
                                                    title="View artist details"
                                                    arrow
                                                >
                                                    <ReadMoreIcon color="primary" />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                sx={{ ml: 1, mr: 1 }}
                                                to={`/artists/${artist.id}/edit`}
                                                disabled={
                                                    !isAuthorized(artist.user?.id)
                                                }
                                            >
                                                <Tooltip
                                                    title="Edit artist"
                                                    arrow
                                                >
                                                    <EditIcon />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                to={`/artists/${artist.id}/delete`}
                                                disabled={
                                                    !isAuthorized(artist.user?.id)
                                                }
                                                sx={{ color: "red" }}
                                            >
                                                <Tooltip
                                                    title="Delete artist"
                                                    arrow
                                                >
                                                    <DeleteForeverIcon />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>,
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
            {!loading && artists.length > 0 && (
                <Paginator
                    route="artists"
                    pageSize={pageSize}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                />
            )}
        </Container>
    );
};