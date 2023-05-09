import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrushIcon from '@mui/icons-material/Brush';
import MuseumIcon from '@mui/icons-material/Museum';
import HomeIcon from '@mui/icons-material/Home';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import HeightIcon from '@mui/icons-material/Height';
import TodayIcon from '@mui/icons-material/Today';
import { getAccount, logOut } from "../auth";
import { SnackbarContext } from "./SnackbarContext";
import { useContext } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AccessLevel } from "../models/User";


export const AppMenu = () => {
	const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const location = useLocation();
	const path = location.pathname;

	const accountNameClick = (event: { preventDefault: () => void }) => {
        event.preventDefault();

        const account = getAccount();
        if (account !== null) {
            navigate(`/users/${account.id}/details`);
        } else {
            navigate("/users/login");
        }
    };

    const logOutClick = (event: { preventDefault: () => void }) => {
        event.preventDefault();

        logOut();
        navigate("/");
        openSnackbar("info", "Logged out successfully!");
    };

	return (
		<Box sx={{ flexGrow: 1, position: "sticky", top: "0", zIndex: "9" }}>
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
						startIcon={<PersonSearchIcon />}>
						Artists
					</Button>
					
					<Button
						variant={path.startsWith("/paintings") ? "outlined" : "text"}
						to="/paintings"
						component={Link}
						color="inherit"
						sx={{ mr: 4 }}
						startIcon={<BrushIcon />}>
						Paintings
					</Button>

					<Button
						variant={path.startsWith("/filterpaintings") ? "outlined" : "text"}
						to="/filterpaintings"
						component={Link}
						color="inherit"
						sx={{ mr: 4}}
						startIcon={<ColorLensIcon />}>
						Filter
					</Button>

					<Button
						variant={path.startsWith("/museums") ? "outlined" : "text"}
						to="/museums"
						component={Link}
						color="inherit"
						sx={{ mr: 4 }}
						startIcon={<MuseumIcon />}>
						Museums
					</Button>

					<Button
						variant={path.startsWith("/exhibitions") ? "outlined" : "text"}
						to="/exhibitions"
						component={Link}
						color="inherit"
						sx={{ mr: 4 }}
						startIcon={<ArtTrackIcon />}>
						Exhibitions
					</Button>

					<Button
						variant={path.startsWith("/agereport") ? "outlined" : "text"}
						to="/agereport"
						component={Link}
						color="inherit"
						sx={{ mr: 4, whiteSpace: "nowrap" }}
						startIcon={<TodayIcon />}>
						Age Report
					</Button>

					<Button
						variant={path.startsWith("/heightreport") ? "outlined" : "text"}
						to="/heightreport"
						component={Link}
						color="inherit"
						sx={{ mr: 4, whiteSpace: "nowrap" }}
						startIcon={<HeightIcon />}>
						Height Report
					</Button>
					
					<Box sx={{ flexGrow: 1 }} />

					<IconButton
                        component={Link}
                        to={`/users/adminpanel`}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="school"
                        sx={{
                            mr: 0,
                            display:
                                getAccount()?.accessLevel === AccessLevel.Admin
                                    ? "inline-flex"
                                    : "none",
                        }}
                    >
                        <AdminPanelSettingsIcon />
                    </IconButton>

                    <Button
                        variant="text"
                        color="inherit"
                        sx={{ mr: 2 }}
                        onClick={accountNameClick}
                    >
                        {getAccount()?.name ?? "Log In"}
                    </Button>

                    <Button
                        variant="text"
                        to="/users/register"
                        component={Link}
                        color="inherit"
                        sx={{
                            mr: 0,
                            display:
                                getAccount() !== null ? "none" : "inline-flex",
                        }}
                    >
                        Register
                    </Button>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="school"
                        sx={{
                            mr: 0,
                            display:
                                getAccount() !== null ? "inline-flex" : "none",
                        }}
                        onClick={logOutClick}
                    >
                        <LogoutIcon />
                    </IconButton>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};