import {
    Box,
    Button,
    Card,
    CircularProgress,
    CardActions,
    CardContent,
    Container,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
} from "@mui/material";
import { useCallback, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";
import { Exhibition } from "../../models/Exhibition";

export const ExhibitionUpdate = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const { artistId, museumId } = useParams();
    const [museumName, setMuseumName] = useState("");
    const [artistName, setArtistName] = useState("");

    const [loading, setLoading] = useState(false);
    const [exhibition, setExhibition] = useState<Exhibition>({
		artistId: 0,
        museumId: 0,
        startDate: new Date(),
        endDate: new Date(),
	});

    useEffect(() => {
        setLoading(true);
        const fetchExhibition = async () => {
            const response = await axios.get<Exhibition>(
                `${BACKEND_API_URL}/exhibitions/${artistId}/${museumId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const data = response.data;

            setMuseumName(
                data.storeEmployee?.firstName +
                    " " +
                    data.storeEmployee?.lastName ?? ""
            );
            setArtistName(data.store?.name ?? "");

            setExhibition({
                startDate: data.startDate,
                endDate: data.endDate,

                artistId: data.artistId,
                museumId: data.museumId,
            });

            setLoading(false);
        };
        fetchExhibition();
    }, [artistId, museumId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(
                    `${BACKEND_API_URL}/exhibitions/${artistId}/${museumId}`,
                    exhibition,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then(() => {
                    openSnackbar("success", "Exhibition updated successfully!");
                    navigate("/exhibitions");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update exhibition!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update exhibition due to an unknown error!"
            );
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/exhibition");
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions`}>
						<ArrowBackIcon />
					</IconButton>{" "}
                    <h3>Edit Exhibition</h3>
                        <form onSubmit={handleUpdate}>
                            <TextField
                                id="artistName"
                                label="Artist Name"
                                value={artistName}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                disabled={true}
                            />

                            <TextField
                                id="museumName"
                                label="Museum Name"
                                value={museumName}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                disabled={true}
                            />

                            <TextField
                                id="startDate"
                                label="Start Date"
                                variant="outlined"
                                onChange={(event) => setExhibition({...exhibition, startDate: new Date(event.target.value)})}
						    />

                            <TextField
                                id="endDate"
                                label="End Date"
                                variant="outlined"
                                onChange={(event) => setExhibition({...exhibition, endDate: new Date(event.target.value)})}
                            />
                        </form>
                    </CardContent>
                    <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
					    <Button type="submit" onClick={handleUpdate} variant="contained" sx={{ mr: 2 }}>Update</Button>
					    <Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
				</CardActions>
                </Card>
        </Container>
    );
};
