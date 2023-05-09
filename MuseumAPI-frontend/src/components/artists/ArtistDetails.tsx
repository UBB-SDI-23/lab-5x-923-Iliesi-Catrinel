import { Box, Button, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import { getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";

export const ArtistDetails = () => {
	const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
	
	const { artistId } = useParams();
	const [artist, setArtist] = useState<Artist>();

	const fetchArtist = async () => {
        setLoading(true);
        try {
            await axios
                .get<Artist>(
                    `${BACKEND_API_URL}/artists/${artistId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const role = response.data;
                    setArtist(role);
                    setLoading(false);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch artist details!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch artist details due to an unknown error!"
            );
        }
    };

	useEffect(() => {
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

					<Box sx={{ ml: 1 }}>
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
					</Box>
					<Button
                        component={Link}
                        to={`/artists/${artistId}/addexhibition`}
                        variant="text"
                        size="large"
						sx={{
							color: "green",
							textTransform: "none",
							mt: 1,
							ml: 2.4,
						}}
                        startIcon={<ArtTrackIcon />}
						disabled={!isAuthorized(artist?.user?.id)}
                    >
                        Add Exhibition
                    </Button>
				</CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
					<IconButton 
						component={Link} 
						to={`/artists/${artistId}/edit`} 
						sx={{
                                color: "gray",
                                textTransform: "none",
                            }} 
						disabled={!isAuthorized(artist?.user?.id)}>
						<EditIcon />
						Edit
					</IconButton>

					<IconButton 
						component={Link} 
						to={`/artists/${artistId}/delete`} 
						sx={{
							color: "red",
							textTransform: "none",
						}}
						disabled={!isAuthorized(artist?.user?.id)}>
						<DeleteForeverIcon />
						Delete
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};