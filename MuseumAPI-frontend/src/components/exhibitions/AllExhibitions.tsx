import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Exhibition } from "../../models/Exhibition";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { getAccount, getAuthToken } from "../../auth";
import axios from "axios";

export const AllExhibitions = () => {
    const [loading, setLoading] = useState(false);
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(9999999);

    useEffect(() => {
        const account = getAccount();

        if (account && account.userProfile) {
            setPageSize(account.userProfile.pagePreference ?? 5);
        }
    }, []);

    async function fetchExhibitions(page: number): Promise<Exhibition[]> {
        const response = await axios.get<Exhibition[]>(
            `${BACKEND_API_URL}/exhibitions/page/${page}/${pageSize}`,
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
                `${BACKEND_API_URL}/exhibitions/count/${pageSize}`,
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

        fetchExhibitions(pageIndex).then((data) => {
            setExhibitions(data);
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

    return (
        <Container>
            <h1>All exhibitions</h1>

            {loading && <CircularProgress />}
            {!loading && exhibitions.length === 0 && <p>No exhibitions found!</p>}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions/add`}>
                    <Tooltip title="Add a new exhibition" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && exhibitions.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Artist</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Museum</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>Start Date</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>End Date</TableCell>
                                <TableCell align="left" style={{whiteSpace: "nowrap", userSelect: "none"}}>User</TableCell>
                                <TableCell align="center" style={{whiteSpace: "nowrap", userSelect: "none"}}>Operations</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {exhibitions.map((exhibition, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {pageIndex * pageSize + index + 1}
                                            </TableCell>
                                            <TableCell align="left">
                                                {exhibition.artist?.firstName}{" "}
                                                {exhibition.artist?.lastName} 
                                            </TableCell>
                                            <TableCell align="left">{exhibition.museum?.name}</TableCell>
                                            <TableCell align="left">{formatDate(exhibition.startDate)}</TableCell>
                                            <TableCell align="left">{formatDate(exhibition.endDate)}</TableCell>
                                            <TableCell align="left">
                                                <Link
                                                    to={`/users/${exhibition.user?.id}/details`}
                                                    title="View user details"
                                                >
                                                    {exhibition.user?.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box display="flex" justifyContent="center" alignItems="flex-start">
                                                    <IconButton
                                                        component={Link}
                                                        sx={{ mr: 3 }}
                                                        to={`/exhibitions/${exhibition.id}/details`}>
                                                        <Tooltip title="View exhibition details" arrow>
                                                            <ReadMoreIcon color="primary" />
                                                        </Tooltip>
                                                    </IconButton>

                                                    <IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions/${exhibition.id}/edit`}>
                                                        <EditIcon />
                                                    </IconButton>

                                                    <IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions/${exhibition.id}/delete`}>
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