import { useState } from 'react';
import { TextField, Button, Container, TableContainer, Table, colors, TableHead, TableCell, TableRow, TableBody, Tooltip, IconButton, Paper } from '@mui/material';
import ReadMoreIcon from "@mui/icons-material/ReadMore"
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { Link } from "react-router-dom";
import { BACKEND_API_URL } from '../../constants';
import { Painting } from '../../models/Painting';
import { getAuthToken } from '../../auth';

export const PaintingFilter = () => {
    const [year, setYear] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [paintings, setPaintings] = useState<Painting[]>([]);

    const handleYearChange = (event: { target: { value: string }; }) => {
        const year = parseInt(event.target.value);
        setYear(isNaN(year) ? null : year);
    };

    const handleFilterClick = () => {
        if (year !== null) {
            setLoading(true);
            fetch(`${BACKEND_API_URL}/paintings/filter?year=${year}`,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                setPaintings(data);
            })
            .catch(() => {
                setLoading(false);
                setPaintings([]);
            });
        }
    };

    return (
        <Container>
            <h1>Filter Paintings</h1>
             <Container sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField 
                    label="Year" 
                    type="number"
                    onChange={handleYearChange} 
                    InputProps={{style: {color: "#000000"}}}
                    sx={{ width: '15%', mr: 2 }}
                />
                <Button variant="contained" onClick={handleFilterClick}>Filter</Button>
            </Container>
            {loading && <div>Loading...</div>}
            {!loading && paintings.length === 0 && <div>No paintings found after the given year.</div>}
            {!loading && paintings.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left" style= {{whiteSpace: "nowrap"}}>Title</TableCell>
                                <TableCell align="left" style= {{whiteSpace: "nowrap"}}>Creation year</TableCell>
								<TableCell align="left">Height</TableCell>
								<TableCell align="left">Subject</TableCell>
								<TableCell align="left">Medium</TableCell>
								<TableCell align="left">Description</TableCell>
                                <TableCell align="left">Artist</TableCell>
                                <TableCell align="center">Operations</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paintings.map((painting, index) => (
								<TableRow key={painting.id}>
									<TableCell component="th" scope="row">
										{index + 1}
									</TableCell>
									<TableCell component="th" scope="row">
										<Link to={`/paintings/${painting.id}/details`} title="View painting details">
											{painting.title}
										</Link>
									</TableCell>
									<TableCell align="left">{painting.creationYear}</TableCell>
								    <TableCell align="left">{painting.height}</TableCell>
								    <TableCell align="left">{painting.subject}</TableCell>
								    <TableCell align="left">{painting.medium}</TableCell>
                                    <TableCell align="left">{painting.description}</TableCell>
									<TableCell align="left">{painting.artist?.firstName + " " + painting.artist?.lastName}</TableCell>
                                    <TableCell align="center">
										<IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/paintings/${painting.id}/details`}>
                                            <Tooltip title="View painting details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>
    
                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/paintings/${painting.id}/edit`}>
                                            <EditIcon />
                                        </IconButton>
    
                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/paintings/${painting.id}/delete`}>
                                            <DeleteForeverIcon sx={{ color: "red" }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            
        </Container>
    );
};
    
