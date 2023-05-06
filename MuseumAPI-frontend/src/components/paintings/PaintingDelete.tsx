import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "../../auth";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";


export const PaintingDelete = () => {
	const { paintingId } = useParams();
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);

	const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .delete(`${BACKEND_API_URL}/paintings/${paintingId}`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then(() => {
                    openSnackbar("success", "Painting deleted successfully!");
                    navigate("/paintings");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to delete painting!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to delete painting due to an unknown error!"
            );
        }
    };

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/paintings");
	};

	return (
		<Container>
			<Card sx={{ p: 2 }}>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/paintings`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this painting? This cannot be undone!
				</CardContent>
				<CardActions>
					<Button type="submit" onClick={handleDelete} variant="contained" color="error">Delete</Button>
					<Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};