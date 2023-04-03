import { Button, Card, CardActions, CardContent, CircularProgress, Container, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../../constants";
import { Artist } from "../../models/Artist";

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
            const response = await fetch(`${BACKEND_URL}/artists/${artistId}/`);
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

    const handleUpdate =async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.put(`${BACKEND_URL}/artists/${artistId}/`, artist).then(() => {
                alert("Artist updated successfully!");
              })
              .catch((reason: AxiosError) => {
                alert("Failed to update artist!");
                console.log(reason.message);
              });
            navigate(`/artists/${artistId}`);
        } catch (error) {
            alert("Failed to update artist!");
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
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, firstName: event.target.value })}
						/>
						<TextField
							id="lastName"
							label="Last name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, lastName: event.target.value })}
						/>

                        <TextField
							id="birthDate"
							label="Birth Date"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, birthDate: new Date(event.target.value) })}
						/>

                        <TextField
							id="birthPlace"
							label="Birth Place"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, birthPlace: event.target.value })}
						/>

                        <TextField
							id="education"
							label="Education"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, education: event.target.value })}
						/>

                        <TextField
							id="movement"
							label="Movement"
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