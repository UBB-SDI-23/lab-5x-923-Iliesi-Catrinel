import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { Key, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Museum } from "../../models/Museum";

export const MuseumDetails = () => {
	const { museumId } = useParams();
	const [museum, setMuseum] = useState<Museum>();

	useEffect(() => {
		const fetchMuseum = async () => {
			const response = await fetch(`${BACKEND_API_URL}/museums/${museumId}/`);
			const museum = await response.json();
			setMuseum(museum);
		};
		fetchMuseum();
	}, [museumId]);

	return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/museums`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <h3>Museum Details</h3>
                    {museum ? (
                        <>
                            <p>Name: {museum.name}</p>
                            <p>Address: {museum.address}</p>
                            <p>Foundation Date: {formatDate(museum.foundationDate)}</p>
                            <p>Architect: {museum.architect}</p>
                            <p>Website: {museum.website}</p>
                            <p>Movement: {museum.movement}</p>
                            <p style={{textAlign: "left", marginLeft: "12px"}}>Artists:</p>
                            <ul>
                                {museum?.artists?.map((artist) => (
                                    <li key={artist.id}>{artist.firstName + " " + artist.lastName}</li>
                                ))}
                            </ul>
                            <p style={{textAlign: "left", marginLeft: "12px"}}>Exhibitions:</p>
                            <ul>
                                {museum?.exhibitions?.map((exhibition) => (
                                    <li key={exhibition.id}>{"Start Date: "}{exhibition.startDate.toLocaleString()}{", End Date:"}{exhibition.endDate.toLocaleString()}</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
                <CardActions>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/museums/${museumId}/edit`}>
                        <EditIcon />
                    </IconButton>
    
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/museums/${museumId}/delete`}>
                        <DeleteForeverIcon sx={{ color: "red" }} />
                    </IconButton>
                </CardActions>
            </Card>
        </Container>
    );
    
};