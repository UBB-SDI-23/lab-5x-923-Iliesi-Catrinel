import { Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { Artist } from "../../models/Artist";
import "react-toastify/dist/ReactToastify.css";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const ArtistAdd = () => {
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);

	const [artist, setArtist] = useState<Artist>({
		firstName: "",
        lastName: "",
        birthDate: new Date(),
        birthPlace: "",
        education: "",
        movement: ""
	});

	const addArtist = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .post(`${BACKEND_API_URL}/artists`, artist, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then(() => {
                    openSnackbar("success", "Artist added successfully!");
                    navigate("/artists");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to add artist!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to add artist due to an unknown error!"
            );
        }
    };

	return (
		<Container data-testid="test-add-container">
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/artists`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>Add Artist</h1>
					<form id="addArtistForm" onSubmit={addArtist}>
						<TextField
							data-testid="test-firstname-input"
							id="firstName"
							label="First Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, firstName: event.target.value })}
						/>
						<TextField
							data-testid="test-lastname-input"
							id="lastName"
							label="Last Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, lastName: event.target.value })}
						/>
                        <TextField
						    data-testid="test-birthdate-input"
							id="birthDate"
							label="Birth Date"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, birthDate: new Date(event.target.value) })}
						/>
                        <TextField
							data-testid="test-birthplace-input"
							id="birthPlace"
							label="Birth Place"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, birthPlace: event.target.value })}
						/>
                        <TextField
							data-testid="test-education-input"
							id="education"
							label="Education"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, education: event.target.value })}
						/>
                        <TextField
							data-testid="test-movement-input"
							id="movement"
							label="Movement"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, movement: event.target.value })}
						/>
					</form>
				</CardContent>
				<CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
					<Button type="submit" form="addArtistForm" variant="contained" data-testid="test-add-btn">Add Artist</Button>
				</CardActions>
			</Card>
		</Container>
	);
};
