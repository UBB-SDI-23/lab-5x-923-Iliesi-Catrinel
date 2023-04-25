import { Button, Card, CardActions, CardContent, CircularProgress, Container, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Museum } from "../../models/Museum";

export const MuseumUpdate = () => {
    const { museumId } = useParams<{ museumId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
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
            const response = await fetch(`${BACKEND_API_URL}/museums/${museumId}/`);
            const museum = await response.json();
            setMuseum({
                id: museum.id,
                name: museum.name,
                address: museum.address,
                foundationDate: museum.foundationDate,
                architect: museum.architect,
                website: museum.website,
                artists: museum.artists,
                exhibitions: museum.exhibitions,
            })
            setLoading(false);
            console.log(museum);
        };
        fetchMuseum();
    }, [museumId]);

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

    const handleUpdate =async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.put(`${BACKEND_API_URL}/museums/${museumId}/`, museum).then(() => {
                displaySuccess("Museum updated successfully!");
              })
              .catch((reason: AxiosError) => {
                displayError("Failed to update museum!");
                console.log(reason.message);
              });
            navigate("/museums");
        } catch (error) {
            displayError("Failed to update museum!");
            console.log(error);
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
				<CardActions>
                <CardActions sx={{ justifyContent: "center" }}>
					<Button type="submit" onClick={handleUpdate} variant="contained">Update</Button>
					<Button onClick={handleCancel} variant="contained">Cancel</Button>
				</CardActions>
                </CardActions>
			</Card>
		</Container>
    )
};