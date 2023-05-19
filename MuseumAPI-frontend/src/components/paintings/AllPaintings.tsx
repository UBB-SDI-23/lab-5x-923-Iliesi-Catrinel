import { useEffect, useState, useContext } from "react";
import {Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL } from "../../constants";
import { Painting } from "../../models/Painting";
import { getAccount, getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";
import Paginator from "../Paginator";

export const AllPaintings = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const [paintings, setPaintings] = useState<Painting[]>([]);

	const [sorting, setSorting] = useState({ key: 'column name', ascending: false });
	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
	const [totalPages, setTotalPages] = useState(999999);

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

    const fetchPageCount = async () => {
        try {
            await axios
                .get<number>(
                    `${BACKEND_API_URL}/paintings/count/${pageSize}`,
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

	const fetchPaintings = async () => {
        setLoading(true);
        try {
            await axios
                .get<Painting[]>(
                    `${BACKEND_API_URL}/paintings/${pageIndex}/${pageSize}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setPaintings(data);
                    setLoading(false);
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

    useEffect(() => {
        fetchPaintings();
    }, [pageIndex, pageSize]);

	function applySorting(key: string, ascending: boolean) {
		setSorting({ key: key, ascending: ascending });
	}

	useEffect(() => {
        if (paintings.length === 0) {
            return;
        }

        const currentPaintings = [...paintings];
        const sortedCurrentPaintings = currentPaintings.sort((a, b) => {
            return a[sorting.key].localeCompare(b[sorting.key]);
        });

        setPaintings(
            sorting.ascending
                ? sortedCurrentPaintings
                : sortedCurrentPaintings.reverse()
        );
    }, [sorting]);

    return (
		<Container data-testid="test-all-paintings-container">
			<h1>All paintings</h1>

			{loading && <CircularProgress />}
			{!loading && paintings.length === 0 && <p style={{ marginLeft: 16 }}>No paintings found!</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/paintings/add`} disabled={getAccount() === null}>
					<Tooltip title="Add a new painting" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}
			{!loading && paintings.length > 0 && 
                (isMediumScreen ? (
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
                                                style={{
                                                    cursor: header.propName
                                                        ? "pointer"
                                                        : "default",
                                                    whiteSpace: header.propName
                                                        ? "nowrap"
                                                        : "normal",
                                                    userSelect: "none",
                                                }}
                                                align={
                                                    header.text === "Operations"
                                                        ? "center"
                                                        : "left"
                                                }
                                                onClick={() =>
                                                    header.propName &&
                                                    applySorting(
                                                        header.propName,
                                                        sorting.key ===
                                                            header.propName
                                                            ? !sorting.ascending
                                                            : true
                                                    )
                                                }
                                            >
                                                {header.text}
                                                {sorting.key ===
                                                    header.propName &&
                                                    (sorting.ascending
                                                        ? " ↑"
                                                        : " ↓")}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paintings.map((painting, index) => {
                                    const paintingData = [
                                        pageIndex * pageSize + index + 1,
                                        painting.title,
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
            {!loading && paintings.length > 0 && (
                <Paginator
                    route="paintings"
                    pageSize={pageSize}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                />
            )}
        </Container>
    );
};