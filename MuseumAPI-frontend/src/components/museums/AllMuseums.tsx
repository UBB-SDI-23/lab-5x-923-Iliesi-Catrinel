import { useEffect, useState } from "react";
import {Box, Button, CircularProgress, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { Museum } from "../../models/Museum";

export const AllMuseums = () => {
    const [loading, setLoading] = useState(false);
    const [museums, setMuseums] = useState<Museum[]>([]);
	const [sorting, setSorting] = useState({ key: 'column name', ascending: false });
	const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
	const [hasMorePages, setHasMorePages] = useState(true);

	function applySorting(key: string, ascending: boolean) {
		setSorting({ key: key, ascending: ascending });
	  }

	useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/museums/${pageIndex}/${pageSize}`)
			.then(response => response.json())
			.then(data => { 
				setMuseums(data); 
				setLoading(false); 
				setHasMorePages(data.length >= pageSize);
			});
	}, [pageIndex]);

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

	function handleNextPage() {
        setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }

    function handlePrevPage() {
        setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 0));
    }

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
                                <TableCell align="left" style={{whiteSpace: "nowrap"}}>Address</TableCell>
								<TableCell align="left">Foundation date</TableCell>
								<TableCell align="left">Architect</TableCell>
								<TableCell align="left">Website</TableCell>
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
                                    <Box display="flex" justifyContent="center">
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
			{!loading && museums.length > 0 && (
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