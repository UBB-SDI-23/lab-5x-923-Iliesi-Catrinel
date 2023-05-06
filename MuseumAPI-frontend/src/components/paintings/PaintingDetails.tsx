import { Box, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Painting } from "../../models/Painting";
import { Artist } from "../../models/Artist";
import { getAuthToken } from "../../auth";
import axios from "axios";

export const PaintingDetails = () => {
    const { paintingId } = useParams();
    const [painting, setPainting] = useState<Painting>();

    useEffect(() => {
        const fetchPainting = async () => {
            const response = await axios.get<Painting>(
                `${BACKEND_API_URL}/paintings/${paintingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const painting = response.data;
            setPainting(painting);
        };
        fetchPainting();
    }, [paintingId]);

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/paintings`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <h3>Painting Details</h3>

                    <Box sx={{ ml: 1 }}>
                        <p>Title: {painting?.title}</p>
                        <p>Creation Year: {painting?.creationYear}</p>
                        <p>Height: {painting?.height}</p>
                        <p>Subject: {painting?.subject}</p>
                        <p>Medium: {painting?.medium}</p>
                        <p>Description: {painting?.description}</p>
                        <p>Artist:</p>
                        <div style={{ marginLeft: "24px" }}>
                            <p>Name: {painting?.artist?.firstName} {painting?.artist?.lastName}</p>
                            <p>Birth Date: {formatDate(painting?.artist?.birthDate)}</p>
                            <p>Birth Place: {painting?.artist?.birthPlace}</p>
                            <p>Education: {painting?.artist?.education}</p>
                            <p>Movement: {painting?.artist?.movement}</p>
                            <p style={{ textAlign: "left", marginLeft: "12px" }}>Paintings:</p>
                            <ul>
                                {painting?.artist?.paintings?.map((painting) => (
                                    <li key={painting.id}>{painting.title}</li>
                                ))}
                            </ul>
                        </div>
                    </Box>
                </CardContent>
                <CardActions>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/paintings/${paintingId}/edit`}>
                        <EditIcon />
                    </IconButton>

                    <IconButton component={Link} sx={{ mr: 3 }} to={`/paintings/${paintingId}/delete`}>
                        <DeleteForeverIcon sx={{ color: "red" }} />
                    </IconButton>
                </CardActions>
            </Card>
        </Container>
    );
};
