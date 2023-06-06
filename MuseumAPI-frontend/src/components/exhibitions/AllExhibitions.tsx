import { useEffect, useState, useContext } from "react";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Exhibition } from "../../models/Exhibition";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { getAccount, getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";
import Paginator from "../Paginator";

export const AllExhibitions = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
    const [totalPages, setTotalPages] = useState(9999999);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));

    const headers = [
        { text: "#", hide: false },
        { text: "Artist", hide: false },
        { text: "Museum", hide: false },
        { text: "Start Date", hide: isLargeScreen },
        { text: "End Date", hide: isLargeScreen },
        { text: "User", hide: false },
        { text: "Operations", hide: false },
    ];
    
    const fetchPageCount = async () => {
        try {
            await axios
                .get<number>(
                    `${BACKEND_API_URL}/exhibitions/count/${pageSize}`,
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

    const fetchExhibitions = async () => {
        setLoading(true);
        try {
            await axios
                .get<Exhibition[]>(
                    `${BACKEND_API_URL}/exhibitions/page/${pageIndex}/${pageSize}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setExhibitions(data);
                    setLoading(false);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch exhibitions!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch exhibitions due to an unknown error!"
            );
        }
    };

    useEffect(() => {
        fetchExhibitions();
    }, [pageIndex, pageSize]);

    return (
        <Container>
            <h1>All exhibitions</h1>

            {loading && <CircularProgress />}
            {!loading && exhibitions.length === 0 && <p style={{ marginLeft: 16 }}>No exhibitions found!</p>}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions/add`} disabled={getAccount() === null}>
                    <Tooltip title="Add a new exhibition" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && exhibitions.length > 0 && (isMediumScreen ? (
                    <Grid container spacing={3}>
                        {exhibitions.map((exhibition, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                        >
                                            {exhibition.artist?.firstName +
                                                " " +
                                                exhibition.artist?.lastName +
                                                " at " +
                                                exhibition.musem?.name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {"Start Date: "}
                                            {formatDate(exhibition.startDate)}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {"End Date: "}
                                            {formatDate(exhibition.endDate)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton
                                            component={Link}
                                            to={`/exhibitions/${exhibition.artistId}/${exhibition.museumId}/details`}
                                        >
                                            <Tooltip
                                                title="View exhibition details"
                                                arrow
                                            >
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            sx={{ ml: 1, mr: 1 }}
                                            to={`/exhibitions/${exhibition.artistId}/${exhibition.museumId}/edit`}
                                            disabled={
                                                !isAuthorized(exhibition.user?.id)
                                            }
                                        >
                                            <Tooltip title="Edit exhibition" arrow>
                                                <EditIcon />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            to={`/exhibitions/${exhibition.artistId}/${exhibition.museumId}/delete`}
                                            disabled={
                                                !isAuthorized(exhibition.user?.id)
                                            }
                                            sx={{ color: "red" }}
                                        >
                                            <Tooltip title="Delete exhibition" arrow>
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
                                {exhibitions.map((exhibition, index) => {
                                    const exhibitionData = [
                                        pageIndex * pageSize + index + 1,
                                        `${exhibition.artist?.firstName} ${exhibition.artist?.lastName}`,
                                        exhibition.museum?.name,
                                        formatDate(exhibition.startDate),
                                        formatDate(exhibition.endDate),
                                        exhibition.user?.name ? (
                                            <Link
                                                to={`/users/${exhibition.user?.id}/details`}
                                                title="View user details"
                                            >
                                                {exhibition.user?.name}
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
                                                to={`/exhibitions/${exhibition.artistId}/${exhibition.museumId}/details`}
                                            >
                                                <Tooltip
                                                    title="View exhibition details"
                                                    arrow
                                                >
                                                    <ReadMoreIcon color="primary" />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                sx={{ ml: 1, mr: 1 }}
                                                to={`/exhibitions/${exhibition.artistId}/${exhibition.museumId}/edit`}
                                                disabled={
                                                    !isAuthorized(
                                                        exhibition.user?.id
                                                    )
                                                }
                                            >
                                                <Tooltip
                                                    title="Edit exhibition"
                                                    arrow
                                                >
                                                    <EditIcon />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                to={`/exhibitions/${exhibition.artistId}/${exhibition.museumId}/delete`}
                                                disabled={
                                                    !isAuthorized(
                                                        exhibition.user?.id
                                                    )
                                                }
                                                sx={{ color: "red" }}
                                            >
                                                <Tooltip
                                                    title="Delete exhibition"
                                                    arrow
                                                >
                                                    <DeleteForeverIcon />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>,
                                    ];
                                    return (
                                        <TableRow key={index}>
                                            {exhibitionData.map((data, i) => {
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
            {!loading && exhibitions.length > 0 && (
                <Paginator
                    route="exhibitions"
                    pageSize={pageSize}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                />
            )}
        </Container>
    );
};