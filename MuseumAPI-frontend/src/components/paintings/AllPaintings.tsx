import { useEffect, useState } from "react";
import {Box, Button, CircularProgress, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL } from "../../constants";
import { Painting } from "../../models/Painting";

export const AllPaintings = () => {
    const [loading, setLoading] = useState(false);
    const [paintings, setPaintings] = useState<Painting[]>([]);
	const [sorting, setSorting] = useState({ key: 'column name', ascending: false });
	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
	const [hasMorePages, setHasMorePages] = useState(true);

	function applySorting(key: string, ascending: boolean) {
		setSorting({ key: key, ascending: ascending });
	  }

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/paintings/${pageIndex}/${pageSize}`)
            .then(response => response.json())
            .then(async data => {
                for (let i = 0; i < data.length; i++) {
                    const artistResponse = await fetch(`${BACKEND_API_URL}/artists/${data[i].artistId}`);
                    const artistData = await artistResponse.json();
                    data[i].artist = artistData;
                }
                setPaintings(data); 
                setLoading(false); 
                setHasMorePages(data.length >= pageSize);
            });
    }, [pageIndex]);
    

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

	function handleNextPage() {
        setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }

    function handlePrevPage() {
        setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 0));
    }

    return (
		<Container>
			<h1>All paintings</h1>

			{loading && <CircularProgress />}
			{!loading && paintings.length === 0 && <p>No paintings found!</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/paintings/add`}>
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
                                <TableCell align="left">Creation year</TableCell>
								<TableCell align="left">Height</TableCell>
								<TableCell align="left">Subject</TableCell>
								<TableCell align="left">Medium</TableCell>
								<TableCell align="left">Description</TableCell>
                                <TableCell align="left">Artist</TableCell>
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
                                    <TableCell align="left">{painting.artist?.firstName + " " + painting.artist?.lastName}</TableCell>
									<TableCell align="left">
									<Box display="flex" justifyContent="center">
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/paintings/${painting.id}/details`}>
											<Tooltip title="View painting details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/paintings/${painting.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/paintings/${painting.id}/delete`}>
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
			{!loading && paintings.length > 0 && (
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
}