import { Box, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";
import { Exhibition } from "../../models/Exhibition";
import { SnackbarContext } from "../SnackbarContext";

export const ExhibitionDetails = () => {
	const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);

	const { artistId, museumId } = useParams();
	const [exhibition, setExhibition] = useState<Exhibition>();

	const fetchExhibition = async () => {
        setLoading(true);
        try {
            await axios
                .get<Exhibition>(
                    `${BACKEND_API_URL}/exhibitions/${artistId}/${museumId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const shift = response.data;
                    setExhibition(shift);
                    setLoading(false);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch exhibition details!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch exhibition details due to an unknown error!"
            );
        }
    };

    useEffect(() => {
        fetchExhibition();
    }, [artistId, museumId]);

	return (
		<Container>
			<Card sx={{ p: 2 }}>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h3>Exhibition Details</h3>

					<Box sx={{ ml: 1 }}>
						<p>Artist Name: {exhibition?.artist?.firstName}{" "}{exhibition?.artist?.lastName}</p>
						<p>Museum Name: {exhibition?.museum?.name}</p>
						<p>Start Date: {formatDate(exhibition?.startDate)}</p>
						<p>End Date: {formatDate(exhibition?.startDate)}</p>
					</Box>
				</CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
					<IconButton component={Link}
						to={`/exhibitions/${artistId}/${museumId}/edit`} 
						sx={{
							color: "gray",
							textTransform: "none",
						}}
						disabled={!isAuthorized(exhibition?.user?.id)}>
						<EditIcon /> Edit
					</IconButton>

					<IconButton component={Link}  
						to={`/exhibitions/${artistId}/${museumId}/delete`}
						sx={{
							color: "red",
                            textTransform: "none",
						}}
						disabled={!isAuthorized(exhibition?.user?.id)}
						>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};