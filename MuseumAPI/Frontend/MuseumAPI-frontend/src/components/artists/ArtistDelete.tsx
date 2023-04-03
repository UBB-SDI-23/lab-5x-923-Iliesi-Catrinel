import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../../constants";

export const ArtistDelete = () => {
	const { artistId } = useParams();
	const navigate = useNavigate();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		await axios.delete(`${BACKEND_URL}/artists/${artistId}`).then(() => {
            alert("Artist deleted successfully!");
          })
          .catch((reason: AxiosError) => {
            alert("Failed to delete artist!");
            console.log(reason.message);
          });;
		// go to artists list
		navigate("/artists");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		// go to artists list
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
				<CardActions>
					<Button type="submit" onClick={handleDelete} variant="contained">Delete</Button>
					<Button onClick={handleCancel} variant="contained">Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};