import { useEffect, useState } from "react";
import {Box, Button, CircularProgress, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { Museum } from "../../models/Museum";
import { getAccount, getAuthToken } from "../../auth";
import axios from "axios";

export const AllMuseums = () => {
    const [loading, setLoading] = useState(false);
    const [museums, setMuseums] = useState<Museum[]>([]);

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

	async function fetchMuseums(page: number): Promise<Museum[]> {
        const response = await axios.get<Museum[]>(
            `${BACKEND_API_URL}/museums/${page}/${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }
        );

        return response.data;
    }

    useEffect(() => {
        setLoading(true);

        fetchMuseums(pageIndex).then((data) => {
            setMuseums(data);
            setLoading(false);
        });
    }, [pageIndex, pageSize]);

	useEffect(() => {
        const fetchPageCount = async () => {
            const response = await axios.get<number>(
                `${BACKEND_API_URL}/museums/count/${pageSize}`,
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

        fetchMuseums(pageIndex).then((data) => {
            setMuseums(data);
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
		<Container>
			<h1>All museums</h1>

			{loading && <CircularProgress />}
			{!loading && museums.length === 0 && <p>No museums found!</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/museums/add`}>
					<Tooltip title="Add a new museum" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}
			{!loading && museums.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left" style= {{cursor: "pointer", whiteSpace: "nowrap"}} onClick={() => applySorting('name', !sorting.ascending)}>
									Name{sorting.key === "name" && (sorting.ascending ? ' ↑' : ' ↓')}</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Address</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Foundation date</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Architect</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Website</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}># of exhibitions</TableCell>
								<TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>User</TableCell>
								<TableCell align="center" style={{whiteSpace: "nowrap", userSelect: "none"}}>Operations</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{museums.map((museum, index) => (
								<TableRow key={museum.id}>
									<TableCell component="th" scope="row">
										{pageIndex * pageSize + index + 1}
									</TableCell>
									<TableCell component="th" scope="row">
										<Link to={`/museums/${museum.id}/details`} title="View museum details">
											{museum.name}
										</Link>
									</TableCell>
									<TableCell align="left">{museum.address}</TableCell>
									<TableCell align="left">{formatDate(museum.foundationDate)}</TableCell>
									<TableCell align="left">{museum.architect}</TableCell>
                                    <TableCell align="left">{museum.website}</TableCell>
									<TableCell align="left">{museum.exhibitions?.length}</TableCell>
									<TableCell align="left">
                                        <Link
                                            to={`/users/${museum.user?.id}/details`}
                                            title="View user details"
                                        >
                                            {museum.user?.name}
                                        </Link></TableCell>
                                    <Box display="flex" justifyContent="center" alignItems="flex-start">
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/museums/${museum.id}/details`}>
											<Tooltip title="View museum details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/museums/${museum.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/museums/${museum.id}/delete`}>
											<DeleteForeverIcon sx={{ color: "red" }} />
										</IconButton>
									</Box>
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