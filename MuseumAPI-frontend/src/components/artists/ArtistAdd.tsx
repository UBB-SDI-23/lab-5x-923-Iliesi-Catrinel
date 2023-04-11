import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { Artist } from "../../models/Artist";
import { debounce } from "lodash";

export const ArtistAdd = () => {
	const navigate = useNavigate();

	const [artist, setArtist] = useState({
		"firstName": "",
        "lastName": "",
        "birthDate": "2023-04-02T19:24:09.239Z",
        "birthPlace": "",
        "education": "",
        "movement": ""
	});

	const [artistNames, setArtistNames] = useState<Artist[]>([]);

	const fetchSuggestions = async (query: string) => {
		try {
			const response = await axios.get<Artist[]>(
				`${BACKEND_API_URL}/artists/autocomplete?query=${query}&pageNumber=1&pageSize=100`
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

	const addArtist = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_API_URL}/artists/`, artist).then(() => {
                alert("Artist added successfully!");
              })
              .catch((reason: AxiosError) => {
                alert("Failed to add artist!");
                console.log(reason.message);
              });
			navigate("/artists");
		} catch (error) {
			alert("Failed to add artist!");
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
						{/*<TextField
							id="firstName"
							label="First Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setArtist({ ...artist, firstName: event.target.value })}
	/>*/}

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
							onChange={(event) => setArtist({ ...artist, birthDate: event.target.value })}
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
