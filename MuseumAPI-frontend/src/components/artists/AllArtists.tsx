import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { getAccount, getAuthToken } from "../../auth";
import axios from "axios";

let page = 1;

export const AllArtists = () => {
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);

	const [sorting, setSorting] = useState({ key: 'column name', ascending: false });

	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
	const [totalPages, setTotalPages] = useState(999999);

	useEffect(() => {
        const account = getAccount();

        if (account && account.userProfile) {
            setPageSize(account.userProfile.pagePreference ?? 5);
        }
    }, []);
	  
	async function fetchArtists(page: number): Promise<Artist[]> {
        const response = await axios.get<Artist[]>(
            `${BACKEND_API_URL}/artists/${page}/${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }
        );

        return response.data;
    }
	
	useEffect(() => {
        const fetchPageCount = async () => {
            const response = await axios.get<number>(
                `${BACKEND_API_URL}/artists/count/${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const count = response.data;
            setTotalPages(count);
        };
        fetchPageCount();
    }, [pageSize]);

    useEffect(() => {
        setLoading(true);

        fetchArtists(pageIndex).then((data) => {
            setArtists(data);
            setLoading(false);
        });
    }, [pageIndex, pageSize]);

    function handlePageClick(pageNumber: number) {
        setPageIndex(pageNumber - 1);
    }

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

	const location = useLocation();
	const path = location.pathname;

    return (
		<Container>
			<h1>All artists</h1>

			{loading && <CircularProgress />}
			{!loading && artists.length === 0 && <p>No artists found!</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/artists/add`}>
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
											sx={{ mr: 3 }}
											to={`/artists/${artist.id}/details`}
										>
											<Tooltip title="View artist details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/artists/${artist.id}/edit`}
										>
											<EditIcon />
										</IconButton>
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/artists/${artist.id}/delete`}
										>
											<DeleteForeverIcon sx={{ color: "red" }} />
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
                        marginBottom: 16,
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
