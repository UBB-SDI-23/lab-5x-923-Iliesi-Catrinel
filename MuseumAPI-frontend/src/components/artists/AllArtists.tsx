import { useEffect, useState } from "react";
import {CircularProgress, colors, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { Artist } from "../../models/Artist";
import { BACKEND_URL, BASE_URL } from "../../constants";

export const AllArtists = () => {
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/artists`)
        .then(response => response.json())
        .then(data => { 
            setArtists(data); 
            setLoading(false); 
        });
    } , 
    []);

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
								<TableCell align="right">First Name</TableCell>
                                <TableCell align="right">Last Name</TableCell>
								<TableCell align="right">Birth Date</TableCell>
								<TableCell align="right">Birth Place</TableCell>
								<TableCell align="right">Education</TableCell>
                                <TableCell align="right">Movement</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{artists.map((artist, index) => (
								<TableRow key={artist.id}>
									<TableCell component="th" scope="row">
										{index + 1}
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
									<TableCell align="right">{artist.birthDate.toLocaleString()}</TableCell>
									<TableCell align="right">{artist.birthPlace}</TableCell>
                                    <TableCell align="right">{artist.education}</TableCell>
                                    <TableCell align="right">{artist.movement}</TableCell>
									<TableCell align="right">
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
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
}