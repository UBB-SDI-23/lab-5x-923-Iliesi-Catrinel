import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";


export const ArtistDelete = () => {
	const { artistId } = useParams();
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);

	const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .delete(`${BACKEND_API_URL}/artists/${artistId}`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then(() => {
                    openSnackbar("success", "Artist deleted successfully!");
                    navigate("/artists");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to delete artist!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to delete artist due to an unknown error!"
            );
        }
    };

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/artists");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/artists`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this artist? This cannot be undone!
				</CardContent>
				<CardActions sx={{
                        mb: 1,
                        mt: 1,
                        display: "flex",
                        justifyContent: "center",
                    }}>
					<Button type="submit" onClick={handleDelete} variant="contained" color="error" sx={{ mr: 2 }}>Delete</Button>
					<Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};