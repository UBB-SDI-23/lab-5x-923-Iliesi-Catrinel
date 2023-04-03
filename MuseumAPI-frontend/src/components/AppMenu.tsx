import { AppBar, Box, Button, IconButton, Toolbar, Typography, colors } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import AddIcon from '@mui/icons-material/Add';
import SummarizeIcon from '@mui/icons-material/Summarize';


export const AppMenu = () => {
    const location = useLocation();
	const path = location.pathname;

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ marginBottom: "20px"}}>
				<Toolbar>
					<IconButton
						component={Link}
						to="/"
						size="large"
						edge="start"
						color="inherit"
						aria-label="school"
						sx={{ mr: 2 }}>
					</IconButton>
					<Typography variant="h6" component="div" sx={{ mr: 5 }}>
						Museum management
					</Typography>
					<Button
						variant={path.startsWith("/artists") ? "outlined" : "text"}
						to="/artists"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<LocalLibraryIcon />}>
						Artists
					</Button>
					<Button
						variant={path.startsWith("/artists/") ? "outlined" : "text"}
						to="/artists/getbypaintingage"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<SummarizeIcon />}>
						Artists ordered by average Painting age
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};