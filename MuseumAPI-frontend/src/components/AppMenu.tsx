import { AppBar, Box, Button, IconButton, Toolbar, Typography, colors } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import SummarizeIcon from '@mui/icons-material/Summarize';
import BrushIcon from '@mui/icons-material/Brush';
import MuseumIcon from '@mui/icons-material/Museum';
import ColorLensIcon from '@mui/icons-material/ColorLens';


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
					<Button
						variant={path.startsWith("/artists/") ? "outlined" : "text"}
						to="/artists/getbypaintingheight"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<SummarizeIcon />}>
						Artists ordered by average Painting height
					</Button>
					<Button
						variant={path.startsWith("/paintings") ? "outlined" : "text"}
						to="/paintings"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<BrushIcon />}>
						Paintings
					</Button>
					<Button
						variant={path.startsWith("/paintings") ? "outlined" : "text"}
						to="/paintings/filter-year"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<BrushIcon />}>
						Paintings Filter
					</Button>
					<Button
						variant={path.startsWith("/museums") ? "outlined" : "text"}
						to="/museums"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<MuseumIcon />}>
						Museums
					</Button>
					{/*<Button
						variant={path.startsWith("/exhibitions") ? "outlined" : "text"}
						to="/exhibitions"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<ColorLensIcon />}>
						Exhibitions
	</Button>*/}
				</Toolbar>
			</AppBar>
		</Box>
	);
};