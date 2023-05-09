import { Box, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Painting } from "../../models/Painting";
import { getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";

export const PaintingDetails = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);

    const { paintingId } = useParams();
    const [painting, setPainting] = useState<Painting>();

    const fetchPainting = async () => {
        setLoading(true);
        try {
            await axios
                .get<Painting>(
                    `${BACKEND_API_URL}/paintings/${paintingId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const employee = response.data;
                    setPainting(employee);
                    setLoading(false);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch painting details!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch painting details due to an unknown error!"
            );
        }
    };

    useEffect(() => {
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
                            <p>Name: {painting?.artist?.firstName ?? "Unknown"} {painting?.artist?.lastName ?? ""}</p>
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
                    <IconButton 
                            component={Link}
                            to={`/paintings/${paintingId}/edit`} 
                            sx={{
                                color: "gray",
                                textTransform: "none",
                            }}
                            disabled={!isAuthorized(painting?.user?.id)}>
                        <EditIcon /> Edit
                    </IconButton>

                    <IconButton component={Link} 
                            to={`/paintings/${paintingId}/delete`}
                            sx={{
                                color: "red",
                                textTransform: "none",
                            }}
                            disabled={!isAuthorized(painting?.user?.id)}>
                        <DeleteForeverIcon /> Delete
                    </IconButton>
                </CardActions>
            </Card>
        </Container>
    );
};
