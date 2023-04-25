import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Museum } from "../../models/Museum";

export const MuseumAdd = () => {
	const navigate = useNavigate();

	const [museum, setMuseum] = useState<Museum>({
		name: "",
        address: "",
        foundationDate: new Date(),
        architect: "",
        website: "",
	});

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

	const addMuseum = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_API_URL}/museums/`, museum).then(() => {
                displaySuccess("Museum added successfully!");
              })
              .catch((reason: AxiosError) => {
                displayError("Failed to add museum!");
                console.log(reason.message);
              });
			navigate("/museums");
		} catch (error) {
			displayError("Failed to add museum!");
			console.log(error);
		}
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/museums`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addMuseum}>
						<TextField
							id="name"
							label="Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum,name: event.target.value })}
						/>
                        <TextField
							id="address"
							label="Address"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum, address: event.target.value })}
						/>
                        <TextField
							id="foundationDate"
							label="Foundation Date"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum, birthDate: new Date(event.target.value) })}
						/>
                        <TextField
							id="architect"
							label="Architect"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum, architect: event.target.value })}
						/>
                        <TextField
							id="website"
							label="Website"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setMuseum({ ...museum, website: event.target.value })}
						/>
						<Button type="submit">Add Museum</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};
