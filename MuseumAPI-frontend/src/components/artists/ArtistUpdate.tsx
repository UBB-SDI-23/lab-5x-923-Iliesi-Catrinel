import { Button, Card, CardActions, CardContent, CircularProgress, Container, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ArtistUpdate = () => {
    const { artistId } = useParams<{ artistId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [artist, setArtist] = useState<Artist>({
        id: parseInt(String(artistId)),
        firstName: "",
        lastName: "",
        birthDate: new Date("2023-04-02T19:24:09.239Z"),
        birthPlace: "",
        education: "",
        movement: "",
        paintings: [],
        museums: [],
        exhibitions: [],
    });

    useEffect(() => {
        const fetchArtist = async () => {
            const response = await fetch(`${BACKEND_API_URL}/artists/${artistId}/`);
            const artist = await response.json();
            setArtist({
                id: artist.id,
                firstName: artist.firstName,
                lastName: artist.lastName,
                birthDate: artist.birthDate,
                birthPlace: artist.birthPlace,
                education: artist.education,
                movement: artist.movement,
                paintings: artist.paintings,
                museums: artist.museums,
                exhibitions: artist.exhibitions,
            })
            setLoading(false);
            console.log(artist);
        };
        fetchArtist();
    }, [artistId]);

    const displayError = (message: string) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_CENTER,
		});
	  };	  

	const displaySuccess = (message: string) => {
		toast.success(message, {
		  position: toast.POSITION.TOP_CENTER,
		});
	};

    const handleUpdate =async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.put(`${BACKEND_API_URL}/artists/${artistId}/`, artist).then(() => {
                displaySuccess("Artist updated successfully!");
              })
              .catch((reason: AxiosError) => {
                displayError("Failed to update artist!");
                console.log(reason.message);
              });
            navigate("/artists");
        } catch (error) {
            displayError("Failed to update artist!");
            console.log(error);
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/artists");
	};

    return (
        <Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/artists`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={handleUpdate}>
                    <TextField
							id="firstName"
							label="First name"
                            value={artist.firstName}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, firstName: event.target.value })}
						/>
						<TextField
							id="lastName"
							label="Last name"
                            value={artist.lastName}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, lastName: event.target.value })}
						/>
                        <TextField
							id="birthDate"
							label="Birth Date"
                            value={artist.birthDate}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, birthDate: new Date(event.target.value) })}
						/>
                        <TextField
							id="birthPlace"
							label="Birth Place"
                            value={artist.birthPlace}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, birthPlace: event.target.value })}
						/>
                        <TextField
							id="education"
							label="Education"
                            value={artist.education}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, education: event.target.value })}
						/>
                        <TextField
							id="movement"
							label="Movement"
                            value={artist.movement}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, movement: event.target.value })}
						/>
					</form>
				</CardContent>
				<CardActions>
                <CardActions sx={{ justifyContent: "center" }}>
					<Button type="submit" onClick={handleUpdate} variant="contained">Update</Button>
					<Button onClick={handleCancel} variant="contained">Cancel</Button>
				</CardActions>
                </CardActions>
			</Card>
		</Container>
    )
};