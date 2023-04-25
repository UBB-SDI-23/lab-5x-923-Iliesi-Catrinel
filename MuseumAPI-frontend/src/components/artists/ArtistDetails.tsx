import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export const ArtistDetails = () => {
	const { artistId } = useParams();
	const [artist, setArtist] = useState<Artist>();

	useEffect(() => {
		const fetchArtist = async () => {
			const response = await fetch(`${BACKEND_API_URL}/artists/${artistId}/`);
			const artist = await response.json();
			setArtist(artist);
		};
		fetchArtist();
	}, [artistId]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/artists`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h3>Artist Details</h3>
					<p>First Name: {artist?.firstName}</p>
                    <p>First Name: {artist?.lastName}</p>
					<p>Birth Date: {formatDate(artist?.birthDate)}</p>
                    <p>Birth Place: {artist?.birthPlace}</p>
                    <p>Education: {artist?.education}</p>
                    <p>Movement: {artist?.movement}</p>
                    <p style={{textAlign: "left", marginLeft: "12px"}}>Paintings:</p>
					<ul>
						{artist?.paintings?.map((painting) => (
                            <li key={painting.id}>{painting.title}</li>
						))}
					</ul>
                    <p style={{textAlign: "left", marginLeft: "12px"}}>Museums:</p>
					<ul>
						{artist?.museums?.map((museum) => (
                            <li key={museum.id}>{museum.name}</li>
						))}
					</ul>
					<p style={{textAlign: "left", marginLeft: "12px"}}>Exhibitions:</p>
					<ul>
						{artist?.exhibitions?.map((exhibition) => (
                            <li key={exhibition.artistId}>{"Start Date: "}{exhibition.startDate.toLocaleString()}{", End Date:"}{exhibition.endDate.toLocaleString()}</li>
						))}
					</ul>
				</CardContent>
                <CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/artists/${artistId}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/artists/${artistId}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};