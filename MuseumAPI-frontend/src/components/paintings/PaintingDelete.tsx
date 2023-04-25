import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const PaintingDelete = () => {
	const { paintingId } = useParams();
	const navigate = useNavigate();

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

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		await axios.delete(`${BACKEND_API_URL}/paintings/${paintingId}`).then(() => {
            displaySuccess("Painting deleted successfully!");
          })
          .catch((reason: AxiosError) => {
            displayError("Failed to delete painting!");
            console.log(reason.message);
          });;
		// go to paintings list
		navigate("/paintings");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		// go to paintings list
		navigate("/paintings");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/paintings`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this painting? This cannot be undone!
				</CardContent>
				<CardActions>
					<Button type="submit" onClick={handleDelete} variant="contained">Delete</Button>
					<Button onClick={handleCancel} variant="contained">Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};