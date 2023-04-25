import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    IconButton,
    TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { Painting } from "../../models/Painting";
import { Artist } from "../../models/Artist";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const PaintingUpdate = () => {
    const { paintingId } = useParams<{ paintingId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [painting, setPainting] = useState<Painting>({
        id: parseInt(String(paintingId)),
        title: "",
        creationYear: 1900,
        height: 0.0,
        subject: "",
        medium: "",
        description: "",
        artistId: 0,
        artist : {} as Artist
    });

    useEffect(() => {
        const fetchPainting = async () => {
            const response = await fetch(`${BACKEND_API_URL}/paintings/${paintingId}/`);
            const painting = await response.json();
            setPainting({
                id: painting.id,
                title: painting.title,
                creationYear: painting.creationYear,
                height: painting.height,
                subject: painting.subject,
                medium: painting.medium,
                description: painting.description,
                artistId: painting.artistId,
            });
            setLoading(false);
            console.log(painting);
        };
        fetchPainting();
    }, [paintingId]);

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

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        fetch(`${BACKEND_API_URL}/paintings/${paintingId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(painting) 
        }).then(response => {
            if (response.ok) {
                displaySuccess("Painting updated successfully!");
            } else {
                console.error("Failed to update painting!", response.statusText);
                displayError(response.toString());
            }
            navigate("/paintings");
            setLoading(false);
        }).catch(error => {
            console.error("Failed to update painting!", error);
            displayError(error);
            setLoading(false);
        });
    }
    
    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/paintings");
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
                            id="title"
                            label="Title"
                            value={painting.title}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setPainting({ ...painting, title: event.target.value })
                            }
                        />
                        <TextField
                            id="creationYear"
                            label="Creation Year"
                            value={painting.creationYear}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setPainting({
                                    ...painting,
                                    creationYear: parseInt(event.target.value),
                                })
                            }
                        />
                        <TextField
                            id="height"
                            label="Height"
                            value={painting.height}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setPainting({
                                    ...painting,
                                    height: parseFloat(event.target.value),
                                })
                            }
                        />
                        <TextField
                            id="subject"
                            label="Subject"
                            value={painting.subject}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setPainting({ ...painting, subject: event.target.value })
                            }
                        />
                        <TextField
                            id="medium"
                            label="Medium"
                            value={painting.medium}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setPainting({ ...painting, medium: event.target.value })
                            }
                        />
                        <TextField
                            id="description"
                            label="Description"
                            value={painting.description}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setPainting({ ...painting, description: event.target.value })
                            }
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
                    </form>
                </CardContent>
                <CardActions>
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Button type="submit" onClick={handleUpdate} variant="contained">
                            Update
                        </Button>
                        <Button onClick={handleCancel} variant="contained">
                            Cancel
                        </Button>
                    </CardActions>
                </CardActions>
            </Card>
        </Container>
    );
                        }
