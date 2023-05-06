import { Button, Card, CardActions, CardContent, CircularProgress, Container, IconButton, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL } from "../../constants";
import "react-toastify/dist/ReactToastify.css";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const ArtistUpdate = () => {
    const { artistId } = useParams<{ artistId: string }>();
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

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
            const response = await axios.get<Artist>(
                `${BACKEND_API_URL}/artists/${artistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const artist = response.data;

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
        };
        fetchArtist();
    }, [artistId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(`${BACKEND_API_URL}/artists/${artistId}`, artist, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then(() => {
                    openSnackbar("success", "Artist updated successfully!");
                    navigate("/artists");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update artist!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update artist due to an unknown error!"
            );
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
                    <h3>Edit Artist</h3>
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
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
					<Button type="submit" onClick={handleUpdate} variant="contained" sx={{ mr: 2 }}>Update</Button>
					<Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
				</CardActions>
                </CardActions>
			</Card>
		</Container>
    );
};