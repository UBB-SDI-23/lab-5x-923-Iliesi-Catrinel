import { useEffect, useState, useContext } from "react";
import {Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { Museum } from "../../models/Museum";
import { getAccount, getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";
import Paginator from "../Paginator";

export const AllMuseums = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const [museums, setMuseums] = useState<Museum[]>([]);

	const [sorting, setSorting] = useState({ key: 'column name', ascending: false });
	
	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
	const [totalPages, setTotalPages] = useState(999999);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));

    const headers = [
        { text: "#", hide: false },
        { text: "Name", hide: false },
        { text: "Address", hide: false },
        { text: "Foundation Date", hide: isLargeScreen },
        { text: "Architect", hide: isLargeScreen },
        { text: "Website", hide: isLargeScreen },
        { text: "# of Exhibitons", hide: false },
        { text: "User", hide: false },
        { text: "Operations", hide: false },
    ];

    const fetchPageCount = async () => {
        try {
            await axios
                .get<number>(`${BACKEND_API_URL}/museums/count/${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
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

	const fetchMuseums = async () => {
        setLoading(true);
        try {
            await axios
                .get<Museum[]>(
                    `${BACKEND_API_URL}/museums/${pageIndex}/${pageSize}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setMuseums(data);
                    setLoading(false);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch museums!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch museums due to an unknown error!"
            );
        }
    };

    useEffect(() => {
        fetchMuseums();
    }, [pageIndex, pageSize]);

	function applySorting(key: string, ascending: boolean) {
		setSorting({ key: key, ascending: ascending });
	}

	useEffect(() => {
        if (museums.length === 0) {
            return;
        }

        const currentMuseums = [...museums];
        const sortedCurrentMuseums = currentMuseums.sort((a, b) => {
            return a[sorting.key].localeCompare(b[sorting.key]);
        });

        setMuseums(
            sorting.ascending
                ? sortedCurrentMuseums
                : sortedCurrentMuseums.reverse()
        );
    }, [sorting]);

    return (
		<Container data-testid="test-all-museums-container">
			<h1>All museums</h1>

			{loading && <CircularProgress />}
			{!loading && museums.length === 0 && <p>No museums found!</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/museums/add`} disabled={getAccount() === null}>
					<Tooltip title="Add a new museum" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}
			{!loading && museums.length > 0 && 
                (isMediumScreen ? (
                    <Grid container spacing={3}>
                        {museums.map((museum, index) => (
                            <Grid item xs={12} sm={6} md={4} key={museum.id}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                        >
                                            {museum.name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {"Address: "}
                                            {museum.address}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {"# of Exhibitions: "}
                                            {museum.exhibitions?.length}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton
                                            component={Link}
                                            to={`/museums/${museum.id}/details`}
                                        >
                                            <Tooltip
                                                title="View museum details"
                                                arrow
                                            >
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            sx={{ ml: 1, mr: 1 }}
                                            to={`/museums/${museum.id}/edit`}
                                            disabled={
                                                !isAuthorized(museum.user?.id)
                                            }
                                        >
                                            <Tooltip title="Edit museum" arrow>
                                                <EditIcon />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            to={`/museums/${museum.id}/delete`}
                                            disabled={
                                                !isAuthorized(museum.user?.id)
                                            }
                                            sx={{ color: "red" }}
                                        >
                                            <Tooltip title="Delete museum" arrow>
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
                                {museums.map((museum, index) => {
                                    const museumData = [
                                        pageIndex * pageSize + index + 1,
                                        museum.name,
                                        museum.address,
                                        museum.foundationDate.toLocaleString(),
                                        museum.architect,
                                        museum.website,
                                        museum.exhibitions?.length,
                                        museum.user?.name ? (
                                            <Link
                                                to={`/users/${museum.user?.id}/details`}
                                                title="View user details"
                                            >
                                                {museum.user?.name}
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
                                                to={`/museums/${museum.id}/details`}
                                            >
                                                <Tooltip
                                                    title="View museum details"
                                                    arrow
                                                >
                                                    <ReadMoreIcon color="primary" />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                sx={{ ml: 1, mr: 1 }}
                                                to={`/museums/${museum.id}/edit`}
                                                disabled={
                                                    !isAuthorized(
                                                        museum.user?.id
                                                    )
                                                }
                                            >
                                                <Tooltip
                                                    title="Edit museum"
                                                    arrow
                                                >
                                                    <EditIcon />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                to={`/museums/${museum.id}/delete`}
                                                disabled={
                                                    !isAuthorized(
                                                        museum.user?.id
                                                    )
                                                }
                                                sx={{ color: "red" }}
                                            >
                                                <Tooltip
                                                    title="Delete museum"
                                                    arrow
                                                >
                                                    <DeleteForeverIcon />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>,
                                    ];
                                    return (
                                        <TableRow key={museum.id}>
                                            {museumData.map((data, i) => {
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
            {!loading && museums.length > 0 && (
                <Paginator
                    route="museums"
                    pageSize={pageSize}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                />
            )}
        </Container>
    );
};