import { Button, Card, CardActions, CardContent, CircularProgress, Container, IconButton, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Museum } from "../../models/Museum";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const MuseumUpdate = () => {
    const { museumId } = useParams<{ museumId: string }>();
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const [loading, setLoading] = useState(true);
    const [museum, setMuseum] = useState<Museum>({
        id: parseInt(String(museumId)),
        name: "",
        address: "",
        foundationDate: new Date(),
        architect: "",
        website: "",
        artists: [],
        exhibitions: [],
    });

    useEffect(() => {
        const fetchMuseum = async () => {
            const response = await axios.get<Museum>(
                `${BACKEND_API_URL}/museums/${museumId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );

            const museum = response.data;
            setMuseum({
                id: museum.id,
                name: museum.name,
                address: museum.address,
                foundationDate: museum.foundationDate,
                architect: museum.architect,
                website: museum.website,
                artists: museum.artists,
                exhibitions: museum.exhibitions,
            });

            setLoading(false);
        };
        fetchMuseum();
    }, [museumId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(`${BACKEND_API_URL}/museums/${museumId}`, museum, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then(() => {
                    openSnackbar("success", "Museum updated successfully!");
                    navigate("/museums");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update museum!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update museum due to an unknown error!"
            );
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/museums");
	};

    return (
        <Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/museums`}>
						<ArrowBackIcon />
					</IconButton>{" "}
                    <h3>Edit Museum</h3>
					<form onSubmit={handleUpdate}>
                    <TextField
							id="name"
							label="Name"
                            value={museum.name}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum,name: event.target.value })}
						/>
                        <TextField
							id="address"
							label="Address"
                            value={museum.address}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum, address: event.target.value })}
						/>
                        <TextField
							id="foundationDate"
							label="Foundation Date"
                            value={museum.foundationDate}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum, birthDate: new Date(event.target.value) })}
						/>
                        <TextField
							id="architect"
							label="Architect"
                            value={museum.architect}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum, architect: event.target.value })}
						/>
                        <TextField
							id="website"
							label="Website"
                            value={museum.website}
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum, website: event.target.value })}
						/>
					</form>
				</CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
					<Button type="submit" onClick={handleUpdate} variant="contained" sx={{ mr: 2 }}>Update</Button>
					<Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
				</CardActions>
			</Card>
		</Container>
    )
};