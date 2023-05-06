import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SnackbarContext } from "../SnackbarContext";
import { useContext } from "react";
import { getAuthToken } from "../../auth";


export const MuseumDelete = () => {
	const { museumId } = useParams();
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);

	const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .delete(`${BACKEND_API_URL}/museums/${museumId}`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then(() => {
                    openSnackbar("success", "Museum deleted successfully!");
                    navigate("/museums");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to delete museum!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to delete museum due to an unknown error!"
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
					Are you sure you want to delete this museum? This cannot be undone!
				</CardContent>
				<CardActions 
					sx={{
                        mb: 1,
                        mt: 1,
                        display: "flex",
                        justifyContent: "center",
                    }}>
					<Button type="submit" onClick={handleDelete} variant="contained" color="error">Delete</Button>
					<Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};