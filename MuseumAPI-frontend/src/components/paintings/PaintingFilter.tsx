import { useState,useContext  } from 'react';
import { TextField, Button, Container, TableContainer, Table, colors, TableHead, TableCell, TableRow, TableBody, Tooltip, IconButton, Paper } from '@mui/material';
import ReadMoreIcon from "@mui/icons-material/ReadMore"
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { Link } from "react-router-dom";
import { BACKEND_API_URL } from '../../constants';
import { Painting } from '../../models/Painting';
import { getAuthToken, isAuthorized } from '../../auth';
import { SnackbarContext } from '../SnackbarContext';
import axios, { AxiosError } from 'axios';

export const PaintingFilter = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(false);
    const [paintings, setPaintings] = useState<Painting[]>([]);

    const [yearText, setYearText] = useState("1900");

    const fetchPaintings = async (year: number) => {
        setLoading(true);
        try {
            await axios
                .get<Painting[]>(
                    `${BACKEND_API_URL}/paintings/Filter?year=${year}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setPaintings(data);

                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch paintings!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch paintings due to an unknown error!"
            );
        }
    };

    function parseData() {
        const value = parseInt(yearText, 10);

        if (value >= 1000 && value <= 3000) {
            fetchPaintings(value);
        } else {
            openSnackbar(
                "error",
                "Please enter a valid number (1000 <= year <= 3000)"
            );
        }
    }

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        const key = event.key;

        // Only allow digits (0-9) and Enter
        if (
            ![
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "Enter",
            ].includes(key)
        ) {
            event.preventDefault();
        } else if (key === "Enter") {
            parseData();
        }
    }

    return (
        <Container>
            <h1>Filter Paintings</h1>
             <Container sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <p
                    style={{
                        marginRight: 8,
                        userSelect: "none",
                    }}
                >
                    {`Minimum creation year: `}
                </p>
                <TextField 
                    label="year" 
                    type="text"
                    inputProps={{ min: 1, style: { textAlign: "center" } }}
                    onChange={(event) => setYearText(event.target.value)}
                    onKeyPress={handleInputKeyPress}
                    variant="outlined"
                    size="small"
                    style={{
                        width: 100,
                        marginRight: 16,
                    }}
                />
                <Button variant="contained" onClick={parseData}>Filter</Button>
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
                                            to={`/paintings/${painting.id}/details`}>
                                            <Tooltip title="View painting details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>
    
                                        <IconButton 
                                            component={Link} 
                                            sx={{ ml: 1, mr: 1 }} 
                                            to={`/paintings/${painting.id}/edit`}  
                                            disabled={
                                                    !isAuthorized(
                                                        painting.user?.id
                                                    )
                                                }>
                                            <Tooltip
                                                    title="Edit painting"
                                                    arrow
                                                >    
                                            <EditIcon />
                                            </Tooltip>    
                                        </IconButton>
    
                                        <IconButton 
                                            component={Link} 
                                            to={`/paintings/${painting.id}/delete`}
                                            disabled={
                                                !isAuthorized(
                                                    painting.user?.id
                                                )
                                            }
                                            sx={{
                                                color: "red",
                                            }}
                                            >
                                            <Tooltip
                                                    title="Delete painting"
                                                    arrow
                                                >
                                            <DeleteForeverIcon/>
                                            </Tooltip>
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
    
