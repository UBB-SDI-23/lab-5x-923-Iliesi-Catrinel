import { Box, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Artist } from "../../models/Artist";
import { BACKEND_API_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getAuthToken } from "../../auth";
import axios from "axios";
import { Exhibition } from "../../models/Exhibition";

export const ExhibitionDetails = () => {
	const { artistId, museumId } = useParams();
	const [exhibition, setExhibition] = useState<Exhibition>();

	useEffect(() => {
        const fetchExhibition = async () => {
            const response = await axios.get<Exhibition>(
                `${BACKEND_API_URL}/exhibitions/${artistId}/${museumId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const exhibition = response.data;
            setExhibition(exhibition);
        };
        fetchExhibition();
    }, [museumId, artistId]);

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
					<IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions/${artistId}/${museumId}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/exhibitions/${artistId}/${museumId}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};