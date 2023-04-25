import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { Artist } from "../../models/Artist";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ArtistAdd = () => {
	const navigate = useNavigate();

	const [artist, setArtist] = useState<Artist>({
		firstName: "",
        lastName: "",
        birthDate: new Date(),
        birthPlace: "",
        education: "",
        movement: ""
	});

	const [artistNames, setArtistNames] = useState<Artist[]>([]);

	const fetchSuggestions = async (query: string) => {
		try {
			const response = await axios.get<Artist[]>(
				`${BACKEND_API_URL}/artists/autocomplete?query=${query}`
			);
			const data = await response.data;
			setArtistNames(data);
		} catch (error) {
			console.error("Error fetching suggestions:", error);
		}
	};

	const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

	useEffect(() => {
		return () => {
			debouncedFetchSuggestions.cancel();
		};
	}, [debouncedFetchSuggestions]);

	const handleInputChange = (event: any, value: any, reason: any) => {
		console.log("input", value, reason);

		if (reason === "input") {
			debouncedFetchSuggestions(value);
		}
	};

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

	const addArtist = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_API_URL}/artists/`, artist).then(() => {
                displaySuccess("Artist added successfully!");
              })
              .catch((reason: AxiosError) => {
                displayError("Failed to add artist!");
                console.log(reason.message);
              });
			navigate("/artists");
		} catch (error) {
			displayError("Failed to add artist!");
			console.log(error);
		}
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/artists`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addArtist}>
						<Autocomplete
							id="firstName"
							options={artistNames}
							getOptionLabel={(option) => `${option.firstName}`}
							renderInput={(params) => <TextField {...params} label="First Name" variant="outlined" fullWidth sx={{ mb: 2 }}/>}
							filterOptions={(x) => x}
							onInputChange={handleInputChange}
							onChange={(event, value) => {
								if (value) {
									console.log(value);
									setArtist({ ...artist, firstName: value.firstName });
								}
							}}
						/>
						<TextField
							id="lastName"
							label="Last Name"
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
						<Button type="submit">Add Artist</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};
