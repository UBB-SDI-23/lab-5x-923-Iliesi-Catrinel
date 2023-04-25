import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Exhibition } from "../../models/Exhibition";
import { BACKEND_API_URL, formatDate } from "../../constants";

export const AllExhibitions = () => {
    const [loading, setLoading] = useState(false);
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [sorting, setSorting] = useState({ key: 'startDate', ascending: true });
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [hasMorePages, setHasMorePages] = useState(true);

    function applySorting(key: string, ascending: boolean) {
        setSorting({ key: key, ascending: ascending });
    }

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/exhibitions/${pageIndex}/${pageSize}`)
            .then(response => response.json())
            .then(data => { 
                setExhibitions(data); 
                setLoading(false); 
                setHasMorePages(data.length >= pageSize);
            });
    }, [pageIndex]);

    function handleNextPage() {
        setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }

    function handlePrevPage() {
        setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 0));
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
                                <TableCell align="left" style={{ whiteSpace: "nowrap" }}>Artist</TableCell>
                                <TableCell align="left" style={{ whiteSpace: "nowrap" }}>Museum</TableCell>
                                <TableCell align="left">Start Date</TableCell>
                                <TableCell align="left">End Date</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {exhibitions.map((exhibition, index) => (
                                        <TableRow key={exhibition.id}>
                                            <TableCell component="th" scope="row">
                                                {pageIndex * pageSize + index + 1}
                                            </TableCell>
                                            <TableCell align="left">{`${exhibition.artist.firstName} ${exhibition.artist.lastName}`} </TableCell>
                                            <TableCell align="left">{exhibition.museum.name}</TableCell>
                                            <TableCell align="left">{formatDate(exhibition.startDate)}</TableCell>
                                            <TableCell align="left">{formatDate(exhibition.endDate)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                    </TableContainer>
        )}
            {!loading && exhibitions.length > 0 && (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePrevPage}
                        disabled={pageIndex === 0}
                        sx={{ mr: 2 , marginTop: 2, marginBottom: 2 }}
                    >Previous Page
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNextPage}
                        disabled={!hasMorePages}
                        sx={{ marginTop: 2, marginBottom: 2 }}
                    >Next Page
                    </Button>
                </div>
        )}
    </Container>
);
        };