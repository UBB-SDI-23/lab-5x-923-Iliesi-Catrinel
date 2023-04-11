import { useEffect, useState } from "react";
import {Box, Button, CircularProgress, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL } from "../../constants";

export const AllArtists = () => {
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
	const [sorting, setSorting] = useState({ key: 'firstName', ascending: false });
	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
	const [hasMorePages, setHasMorePages] = useState(true);

	function applySorting(key: string, ascending: boolean) {
		setSorting({ key: key, ascending: ascending });
	  }

	useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/artists/${pageIndex}/${pageSize}`)
			.then(response => response.json())
			.then(data => { 
				setArtists(data); 
				setLoading(false); 
				setHasMorePages(data.length >= pageSize);
			});
	}, [pageIndex]);

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

	function handleNextPage() {
        setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }

    function handlePrevPage() {
        setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 0));
    }

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
                                <TableCell align="left" style={{whiteSpace: "nowrap"}}>Last Name</TableCell>
								<TableCell align="left">Birth Date</TableCell>
								<TableCell align="left">Birth Place</TableCell>
								<TableCell align="left">Education</TableCell>
                                <TableCell align="left">Movement</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{artists.map((artist, index) => (
								<TableRow key={artist.id}>
									<TableCell component="th" scope="row">
										{pageIndex * pageSize + index + 1}
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
									<TableCell align="left">{artist.birthDate.toLocaleString()}</TableCell>
									<TableCell align="left">{artist.birthPlace}</TableCell>
                                    <TableCell align="left">{artist.education}</TableCell>
                                    <TableCell align="left">{artist.movement}</TableCell>
									<TableCell align="left">
									<Box display="flex" justifyContent="center">
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/artists/${artist.id}/details`}>
											<Tooltip title="View artist details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/artists/${artist.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/artists/${artist.id}/delete`}>
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
			{!loading && artists.length > 0 && (
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