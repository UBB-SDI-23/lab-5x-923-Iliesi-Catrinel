import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import BrushIcon from '@mui/icons-material/Brush';
import MuseumIcon from '@mui/icons-material/Museum';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import KeyIcon from '@mui/icons-material/Key';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import HeightIcon from '@mui/icons-material/Height';
import TodayIcon from '@mui/icons-material/Today';
import { getAccount } from "../auth";


export const AppMenu = () => {
    const location = useLocation();
	const path = location.pathname;

	return (
		<Box sx={{ flexGrow: 1, position: "sticky", top: "0" }}>
			<AppBar position="static" sx={{ marginBottom: "20px"}}>
				<Toolbar sx={{ display: "flex", flexWrap: "nowrap" }}>
					<IconButton
						component={Link}
						to="/"
						size="large"
						edge="start"
						color="inherit"
						aria-label="school"
						sx={{ mr: 2 }}>
						<HomeIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ mr: 2, whiteSpace: "nowrap" }}>
						MUSEUM MANAGEMENT
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center" }}>
					<Button
						variant={path.startsWith("/artists") ? "outlined" : "text"}
						to="/artists"
						component={Link}
						color="inherit"
						sx={{ mr: 4 }}
						startIcon={<PersonSearchIcon />}
						disabled={getAccount() === null}>
						Artists
					</Button>
					
					<Button
						variant={path.startsWith("/paintings") ? "outlined" : "text"}
						to="/paintings"
						component={Link}
						color="inherit"
						sx={{ mr: 4 }}
						startIcon={<BrushIcon />}
						disabled={getAccount() === null}>
						Paintings
					</Button>

					<Button
						variant={path.startsWith("/filterpaintings") ? "outlined" : "text"}
						to="/filterpaintings"
						component={Link}
						color="inherit"
						sx={{ mr: 4, whiteSpace: "nowrap" }}
						startIcon={<ColorLensIcon />}
						disabled={getAccount() === null}>
						Filter Paintings
					</Button>

					<Button
						variant={path.startsWith("/museums") ? "outlined" : "text"}
						to="/museums"
						component={Link}
						color="inherit"
						sx={{ mr: 4 }}
						startIcon={<MuseumIcon />}
						disabled={getAccount() === null}>
						Museums
					</Button>

					<Button
						variant={path.startsWith("/exhibitions") ? "outlined" : "text"}
						to="/exhibitions"
						component={Link}
						color="inherit"
						sx={{ mr: 4 }}
						startIcon={<ArtTrackIcon />}
						disabled={getAccount() === null}>
						Exhibitions
					</Button>

					<Button
						variant={path.startsWith("/agereport") ? "outlined" : "text"}
						to="/agereport"
						component={Link}
						color="inherit"
						sx={{ mr: 4, whiteSpace: "nowrap" }}
						startIcon={<TodayIcon />}
						disabled={getAccount() === null}>
						Age Report
					</Button>

					<Button
						variant={path.startsWith("/heightreport") ? "outlined" : "text"}
						to="/heightreport"
						component={Link}
						color="inherit"
						sx={{ mr: 4, whiteSpace: "nowrap" }}
						startIcon={<HeightIcon />}
						disabled={getAccount() === null}>
						Height Report
					</Button>
					
                    <Button
                        variant="text"
                        to={`/users/${getAccount()?.id}/details`}
                        component={Link}
                        color="inherit"
                        sx={{ mr: 2 }}
                        disabled={getAccount() === null}
                    >
                        {getAccount()?.name}
                    </Button>

                    <IconButton
                        component={Link}
                        to="/users/login"
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="school"
                        sx={{ mr: 2 }}
                    >
                        <KeyIcon />
                    </IconButton>

                    <IconButton
                        component={Link}
                        to="/users/register"
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="school"
                        sx={{ mr: 0 }}
                    >
                        <AssignmentIcon />
                    </IconButton>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};