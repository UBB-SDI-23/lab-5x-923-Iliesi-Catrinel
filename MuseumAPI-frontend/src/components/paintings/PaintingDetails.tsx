import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Painting } from "../../models/Painting";
import { Artist } from "../../models/Artist";

export const PaintingDetails = () => {
    const { paintingId } = useParams();
    const [painting, setPainting] = useState<Painting>();

    useEffect(() => {
        const fetchPainting = async () => {
            const response = await fetch(`${BACKEND_API_URL}/paintings/${paintingId}/`);
            const painting = await response.json();
            setPainting(painting);
        };
        fetchPainting();
    }, [paintingId]);

    const [artist, setArtist] = useState<Artist>();

    useEffect(() => {
        if (painting) {
            const fetchArtist = async () => {
                const response = await fetch(`${BACKEND_API_URL}/artists/${painting.artistId}/`);
                const artist = await response.json();
                setArtist(artist);
            };
            fetchArtist();
        }
    }, [painting]);

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/paintings`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <h3>Painting Details</h3>
                    <p>Title: {painting?.title}</p>
                    <p>Creation Year: {painting?.creationYear}</p>
                    <p>Height: {painting?.height}</p>
                    <p>Subject: {painting?.subject}</p>
                    <p>Medium: {painting?.medium}</p>
                    <p>Description: {painting?.description}</p>
					<p>Artist:</p>
                    <div style={{ marginLeft: "24px" }}>
                        <p>Name: {artist?.firstName} {artist?.lastName}</p>
                        <p>Birth Date: formatDate(artist?.birthDate?)</p>
                        <p>Birth Place: {artist?.birthPlace}</p>
                        <p>Education: {artist?.education}</p>
                        <p>Movement: {artist?.movement}</p>
                        <p style={{ textAlign: "left", marginLeft: "12px" }}>Paintings:</p>
                        <ul>
                            {artist?.paintings?.map((painting) => (
                                <li key={painting.id}>{painting.title}</li>
                            ))}
                        </ul>
                    </div>
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
