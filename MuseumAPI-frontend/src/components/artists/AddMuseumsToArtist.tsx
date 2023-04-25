import {
	Autocomplete,
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { debounce } from "lodash";
import { Artist } from "../../models/Artist";
import { Museum } from "../../models/Museum";
import { ArtistMuseumList } from "../../models/ArtistMuseumList";


export const AddMuseumsToArtist = () => {
	const navigate = useNavigate();

	const [artists, setArtists] = useState<Artist[]>([]);
    const [museums, setMuseums] = useState<Museum[]>([]);
	const [artistMuseums, setArtistMuseums] = useState<ArtistMuseumList>({
		artistId: 0,
        museumId: [],
        startDate: new Date(),
        endDate: new Date(),
	});

	const fetchArtistSuggestions = async (query: string) => {
		try {
			const response = await axios.get<Artist[]>(
				`${BACKEND_API_URL}/artists/autocomplete?query=${query}`
			);
			const data = await response.data;
			setArtists(data);
		} catch (error) {
			console.error("Error fetching artist suggestions:", error);
		}
	};

	const debouncedFetchArtistSuggestions = useCallback(debounce(fetchArtistSuggestions, 500), []);

	useEffect(() => {
		return () => {
			debouncedFetchArtistSuggestions.cancel();
		};
	}, [debouncedFetchArtistSuggestions]);

	const handleArtistInputChange = (event: any, value: any, reason: any) => {
		console.log("input", value, reason);

		if (reason === "input") {
			debouncedFetchArtistSuggestions(value);
		}
	};

	const fetchMuseumSuggestions = async (query: string) => {
		try {
			const response = await axios.get<Museum[]>(
				`${BACKEND_API_URL}/museums/autocomplete?query=${query}`
			);
			const data = await response.data;
			setMuseums(data);
		} catch (error) {
			console.error("Error fetching museum suggestions:", error);
		}
	};

	const debouncedFetchMuseumSuggestions = useCallback(debounce(fetchMuseumSuggestions, 500), []);

	useEffect(() => {
		return () => {
			debouncedFetchMuseumSuggestions.cancel();
		};
	}, [debouncedFetchMuseumSuggestions]);

	const handleMuseumInputChange = (event: any, value: any, reason: any) => {
		console.log("input", value, reason);

		if (reason === "input") {
			debouncedFetchMuseumSuggestions(value);
		}
	};

	const addArtistMuseum = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_API_URL}/artists/${artistMuseums?.artistId}/museumList/`, artistMuseums);
			alert("Museums added successfully to artist!");
			navigate("/artists");
		} catch (error) {
			alert("Failed to add museums to artist!");
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
					<form onSubmit={addArtistMuseum} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
						<Autocomplete
                                id="artistId"
                                options={artists}
                                getOptionLabel={(option) => `${option.firstName} - ${option.lastName}`}
                                renderInput={(params) => <TextField {...params} label="Artist" variant="outlined" />}
                                filterOptions={(x) => x}
                                onInputChange={handleArtistInputChange}
                                onChange={(event, value) => {
                                    if (value) {
                                        console.log(value);
                                        setArtistMuseums({ ...artistMuseums, artistId: value.id  ?? 0});
                                    }
                                }}
                            />
						<Autocomplete
							multiple
							id="museumId"
							options={museums}
							getOptionLabel={(option) => `${option.name}`}
							renderInput={(params) => <TextField {...params} label="Museums" variant="outlined" placeholder="Artists"/>}
							filterSelectedOptions
							onInputChange={handleMuseumInputChange}
							onChange={(event, value) => {
								if (value) {
									console.log(value);
									const artistIds = value.map((artist) => artist?.id) as number[];
           							setArtistMuseums({ ...artistMuseums, museumId: artistIds });
								}
							}}
                    	/> 
                        <TextField
                            id="startDate"
                            label="Start Date"
                            variant="outlined"
                            onChange={(event) => setArtistMuseums({...artistMuseums, startDate: new Date(event.target.value)})}
						/>

                        <TextField
                            id="endDate"
                            label="End Date"
                            variant="outlined"
                            onChange={(event) => setArtistMuseums({...artistMuseums, endDate: new Date(event.target.value)})}
						/>
						<Button type="submit">Add Exibition</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};