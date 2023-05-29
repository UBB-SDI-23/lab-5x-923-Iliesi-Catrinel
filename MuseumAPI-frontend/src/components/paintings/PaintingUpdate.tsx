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
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { Painting } from "../../models/Painting";
import { Artist } from "../../models/Artist";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const PaintingUpdate = () => {
    const { paintingId } = useParams<{ paintingId: string }>();
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [painting, setPainting] = useState<Painting>({
        id: parseInt(String(paintingId)),
        title: "",
        creationYear: 1900,
        height: 0.0,
        subject: "",
        medium: "",
        description: "",
        price: 0.0,
        artistId: 0,
        artist : {} as Artist
    });

    const artist = useRef<Artist>({
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        birthPlace: "",
        education: "",
        movement: ""
    });

    useEffect(() => {
        const fetchPainting = async () => {
            const response = await axios.get<Painting>(
                `${BACKEND_API_URL}/paintings/${paintingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );

            const painting = response.data;
            const fetchedArtist = {
                id: painting.artist?.id ?? 0,
                firstName: painting.artist?.firstName ?? "",
                lastName: painting.artist?.lastName ?? "",
                birthDate: painting.artist?.birthDate ?? new Date(),
                birthPlace: painting.artist?.birthPlace ?? "",
                education: painting.artist?.education ?? "",
                movement: painting.artist?.movement ?? "",
            };

            artist.current = fetchedArtist;
            setArtists([artist.current]);

            setPainting({
                id: painting.id,
                title: painting.title,
                creationYear: painting.creationYear,
                height: painting.height,
                subject: painting.subject,
                medium: painting.medium,
                description: painting.description,
                price: painting.price,
                artistId: painting.artistId,
            });

            setLoading(false);
        };
        fetchPainting();
    }, [paintingId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(
                    `${BACKEND_API_URL}/paintings/${paintingId}`,
                    painting,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then(() => {
                    openSnackbar("success", "Painting updated successfully!");
                    navigate("/paintings");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update painting!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update painting due to an unknown error!"
            );
        }
    };


    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/paintings");
    };

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<Artist[]>(
                `${BACKEND_API_URL}/artists/search?query=${query}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const data = response.data;
            data.unshift(artist.current);
            const removedDupes = data.filter(
                (v, i, a) => a.findIndex((v2) => v2.name === v.name) === i
            );

            setArtists(removedDupes);
        } catch (error) {
            console.error("Error fetching artist suggestions:", error);
        }
    };

    const debouncedFetchArtistSuggestions = useCallback(debounce(fetchSuggestions, 250), []);

    useEffect(() => {
        return () => {
            debouncedFetchArtistSuggestions.cancel();
        };
    }, [debouncedFetchArtistSuggestions]);

    const handleInputChange = (event: any, value: any, reason: any) => {
        if (value.length < 3) return;
        console.log("input", value, reason);

        if (reason === "input") {
            debouncedFetchArtistSuggestions(value);
        }
    };
    
    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/artists`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <h3>Edit Painting</h3>
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
                        <TextField
                            id="price"
                            label="Price"
                            value={painting.price}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setPainting({
                                    ...painting,
                                    price: parseFloat(event.target.value),
                                })
                            }
                        />
                        <Autocomplete
                                id="artistId"
                                sx={{ mb: 2 }}
                                options={artists}
                                value={artist.current}
                                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option.id}>
                                            {option.name}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Artist"
                                        variant="outlined"
                                    />
                                )}
                                filterOptions={(x) => x}
                                onInputChange={handleInputChange}
                                onChange={(event, value) => {
                                    if (value) {
                                        console.log(value);
                                        artist.current = value;

                                        setPainting({
                                            ...painting,
                                            artistId: value.id ?? 0,
                                        });
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
                        <Button onClick={handleCancel} variant="contained" color="error">
                            Cancel
                        </Button>
                    </CardActions>
                </CardActions>
            </Card>
        </Container>
    );
};
