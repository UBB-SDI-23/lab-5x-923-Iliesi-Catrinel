import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Painting } from "../../models/Painting";
import { Artist } from "../../models/Artist";

export const PaintingAdd = () => {
	const navigate = useNavigate();

	const [painting, setPainting] = useState<Painting>({
		title: "",
        creationYear: 1900,
        height: 0.0,
        subject: "",
        medium: "",
        description: "",
        artistId: 0
	});

    const [artistNames, setArtistNames] = useState<Artist[]>([]);

    const fetchArtistSuggestions = async (query: string) => {
        try {
            const response = await axios.get<Artist[]>(
                `${BACKEND_API_URL}/paintings/autocomplete-artist?query=${query}`
            );
            const data = await response.data;
            setArtistNames(data);
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

    const handleInputChange = (event: any, value: any, reason: any) => {
        console.log("input", value, reason);

        if (reason === "input") {
            debouncedFetchArtistSuggestions(value);
        }
    };

	const displayError = (message: string | any) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_CENTER,
		});
	  };	  

	const displaySuccess = (message: string) => {
		toast.success(message, {
		  position: toast.POSITION.TOP_CENTER,
		});
	};	 

	const addPainting = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_API_URL}/paintings/`, painting).then(() => {
                displaySuccess("Painting added successfully!");
              })
              .catch((reason: AxiosError) => {
                displayError("Failed to add painting!");
                console.log(reason.message);
              });
			navigate("/paintings");
		} catch (error) {
			displayError("Failed to add painting!");
			console.log(error);
		}
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/paintings`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addPainting}>
                    <TextField
							id="title"
							label="Title"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setPainting({ ...painting, title: event.target.value })}
						/>
						<TextField
							id="creationYear"
							label="Creation Year"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setPainting({ ...painting, creationYear: parseInt(event.target.value) })}
						/>
                        <TextField
							id="height"
							label="Height"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setPainting({ ...painting, height: parseFloat(event.target.value) })}
						/>
                        <TextField
							id="subject"
							label="Subject"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setPainting({ ...painting, subject: event.target.value })}
						/>
                        <TextField
							id="medium"
							label="Medium"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setPainting({ ...painting, medium: event.target.value })}
						/>
                        <TextField
							id="description"
							label="Description"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setPainting({ ...painting, description: event.target.value })}
						/>
                        <Autocomplete style={{margin: 10}}
                                id="artistId"
                                options={artistNames}
                                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                renderInput={(params) => <TextField {...params} label="Artist" variant="outlined" />}
                                filterOptions={() => artistNames}
                                onInputChange={handleInputChange}
                                onChange={(event, value) => {
                                    if (value) {
                                        console.log(value);
                                        setPainting({ ...painting, artistId: value.id ?? 0 });
                                    }
                                }}
                        />
						<Button type="submit">Add Painting</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};
