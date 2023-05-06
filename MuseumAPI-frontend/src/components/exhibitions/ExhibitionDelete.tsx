import {
    Container,
    Card,
    CardContent,
    IconButton,
    CardActions,
    Button,
    Box,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const ExhibitionDelete = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);
    const { artistId, museumId } = useParams();

    const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .delete(
                    `${BACKEND_API_URL}/exhibitions/${artistId}/${museumId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then(() => {
                    openSnackbar("success", "Exhibition deleted successfully!");
                    navigate("/exhibitions");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to delete exhibition!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to delete exhibition due to an unknown error!"
            );
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/exhibitions");
    };

    return (
        <Container>
            <Card sx={{ p: 2 }}>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions`}>
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