import { useEffect, useState, useContext } from "react";
import {Box, Button, CircularProgress, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
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

export const AllPaintings = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const [paintings, setPaintings] = useState<Painting[]>([]);

	const [sorting, setSorting] = useState({ key: 'column name', ascending: false });
	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
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
		<Container>
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
			{!loading && paintings.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left" style= {{cursor: "pointer", whiteSpace: "nowrap"}} onClick={() => applySorting('title', !sorting.ascending)}>
									Title{sorting.key === "title" && (sorting.ascending ? ' ↑' : ' ↓')}</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Creation year</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Height</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Subject</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Medium</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Description</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Artist</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>User</TableCell>
								<TableCell align="center" style={{whiteSpace: "nowrap", userSelect: "none"}}>Operations</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paintings.map((painting, index) => (
								<TableRow key={painting.id}>
									<TableCell component="th" scope="row">
										{pageIndex * pageSize + index + 1}
									</TableCell>
									<TableCell component="th" scope="row">
										<Link to={`/paintings/${painting.id}/details`} title="View painting details">
											{painting.title}
										</Link>
									</TableCell>
									<TableCell align="left">{painting.creationYear}</TableCell>
									<TableCell align="left">{painting.height}</TableCell>
                                    <TableCell align="left">{painting.subject}</TableCell>
                                    <TableCell align="left">{painting.medium}</TableCell>
									<TableCell align="left">{painting.description}</TableCell>
                                    <TableCell align="left">{painting.artist?.firstName + " " + painting.artist?.lastName ??"Unknown"}</TableCell>
									<TableCell align="left">
                                        <Link
                                            to={`/users/${painting.user?.id}/details`}
                                            title="View user details"
                                        >
                                            {painting.user?.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">
									<Box display="flex" justifyContent="center" alignItems="flex-start">
										<IconButton
											component={Link}
											to={`/paintings/${painting.id}/details`}>
											<Tooltip title="View painting details" arrow>
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
                                                }>
                                                <Tooltip
                                                    title="Edit painting"
                                                    arrow>
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
											sx={{
                                                color: "red",
                                            }}
                                            >
                                            <Tooltip
                                                    title="Delete painting"
                                                    arrow
                                                >
											<DeleteForeverIcon/>
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
