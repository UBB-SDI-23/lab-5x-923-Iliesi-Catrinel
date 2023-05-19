import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BACKEND_API_URL } from "../../constants";
import "react-toastify/dist/ReactToastify.css";
import { Museum } from "../../models/Museum";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const MuseumAdd = () => {
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);

	const [museum, setMuseum] = useState<Museum>({
		name: "",
        address: "",
        foundationDate: new Date(),
        architect: "",
        website: "",
	});	 

	const addMuseum = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .post(`${BACKEND_API_URL}/museums`, museum, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then(() => {
                    openSnackbar("success", "Museum added successfully!");
                    navigate("/museums");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to add museum!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to add museum due to an unknown error!"
            );
        }
    };

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/museums`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form id="addMuseumForm" onSubmit={addMuseum}>
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
					</form>
				</CardContent>
				<CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
					<Button type="submit" variant="contained" id="addMuseumForm">Add Museum</Button>
				</CardActions>
			</Card>
		</Container>
	);
};
