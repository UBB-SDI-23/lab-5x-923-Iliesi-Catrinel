import { useContext, useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
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

export const AllArtists = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState<Artist[]>([]);

	const [sorting, setSorting] = useState({ key: 'column name', ascending: false });

	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
	const [totalPages, setTotalPages] = useState(999999);

    const displayedPages = 9;

    let startPage = pageIndex - Math.floor((displayedPages - 3) / 2) + 1;
    let endPage = startPage + displayedPages - 3;

    if (startPage <= 2) {
        startPage = 1;
        endPage = displayedPages - 1;
    } else if (endPage >= totalPages - 1) {
        startPage = totalPages - displayedPages + 2;
        endPage = totalPages;
    }

    function handlePageClick(pageNumber: number) {
        setPageIndex(pageNumber - 1);
    }
	
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
		<Container>
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
			{!loading && artists.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left" style= {{cursor: "pointer", whiteSpace: "nowrap"}} onClick={() => applySorting('firstName', !sorting.ascending)}>
									First Name{sorting.key === "firstName" && (sorting.ascending ? ' ↑' : ' ↓')}</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Last Name</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Birth Date</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Birth Place</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Education</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Movement</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}># of Paintings</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>User</TableCell>
								<TableCell align="center" style={{whiteSpace: "nowrap", userSelect: "none"}}>Operations</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{artists.map((artist, index) => (
							<TableRow key={artist.id}>
								<TableCell component="th" scope="row">
									{ pageIndex * pageSize + index + 1}
								</TableCell>
								<TableCell component="th" scope="row">
									<Link to={`/artists/${artist.id}/details`} title="View artist details">
										{artist.firstName}
									</Link>
								</TableCell>
								<TableCell component="th" scope="row">
									<Link to={`/artists/${artist.id}/details`} title="View artist details">
										{artist.lastName}
									</Link>
								</TableCell>
								<TableCell align="left">{formatDate(artist.birthDate)}</TableCell>
								<TableCell align="left">{artist.birthPlace}</TableCell>
								<TableCell align="left">{artist.education}</TableCell>
								<TableCell align="left">{artist.movement}</TableCell>
								<TableCell align="left">{artist.paintings?.length}</TableCell>
								<TableCell align="left">
                                        <Link
                                            to={`/users/${artist.user?.id}/details`}
                                            title="View user details"
                                        >
                                            {artist.user?.name}
                                        </Link>
								</TableCell>
								<TableCell align="center">
									<Box display="flex" alignItems="flex-start" justifyContent="center">
										<IconButton
											component={Link}
											to={`/artists/${artist.id}/details`}
										>
											<Tooltip title="View artist details" arrow>
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
                                                ><EditIcon />
                                                </Tooltip>
										</IconButton>
										<IconButton
											component={Link}
											to={`/artists/${artist.id}/delete`}
                                            disabled={
                                                !isAuthorized(artist.user?.id)
                                            }
                                            sx={{
                                                color: "red",
                                            }}
										>
											<Tooltip
                                                    title="Delete artist"
                                                    arrow
                                                ><DeleteForeverIcon/>
                                                </Tooltip>
										</IconButton>
									</Box>
								</TableCell>
							</TableRow>
						))}

						</TableBody>
					</Table>
				</TableContainer>
			)}
			{!loading && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 16,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() =>
                            setPageIndex((prevPageIndex) =>
                                Math.max(prevPageIndex - 1, 0)
                            )
                        }
                        disabled={pageIndex === 0}
                    >
                        &lt;
                    </Button>
                    {startPage > 1 && (
                        <>
                            <Button
                                variant={
                                    pageIndex === 0 ? "contained" : "outlined"
                                }
                                onClick={() => handlePageClick(1)}
                                style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                }}
                            >
                                1
                            </Button>
                            <span>...</span>
                        </>
                    )}
                    {Array.from(
                        { length: endPage - startPage + 1 },
                        (_, i) => i + startPage
                    ).map((number) => (
                        <Button
                            key={number}
                            variant={
                                pageIndex === number - 1
                                    ? "contained"
                                    : "outlined"
                            }
                            onClick={() => handlePageClick(number)}
                            style={{
                                marginLeft: 8,
                                marginRight: 8,
                            }}
                        >
                            {number}
                        </Button>
                    ))}
                    {endPage < totalPages && (
                        <>
                            <span>...</span>
                            <Button
                                variant={
                                    pageIndex === totalPages - 1
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => handlePageClick(totalPages)}
                                style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                }}
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}
                    <Button
                        variant="contained"
                        onClick={() =>
                            setPageIndex((prevPageIndex) => prevPageIndex + 1)
                        }
                        disabled={pageIndex + 1 >= totalPages}
                    >
                        &gt;
                    </Button>
                </div>
            )}
        </Container>
    );
};
