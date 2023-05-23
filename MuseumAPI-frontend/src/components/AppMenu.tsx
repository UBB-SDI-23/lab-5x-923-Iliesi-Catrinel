import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import { useContext, useEffect, useRef, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AccessLevel } from "../models/User";
import ChatIcon from "@mui/icons-material/Chat";


export const AppMenu = () => {
	const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const location = useLocation();
	const path = location.pathname;

	const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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

	const menuItems = [
        { link: "/artists", title: "Artists", icon: <PersonSearchIcon /> },
        { link: "/paintings", title: "Paintings", icon: <BrushIcon /> },
        { link: "/filterpaintings", title: "Filter", icon: <ColorLensIcon /> },
		{ link: "/museums", title: "Museums", icon: <MuseumIcon /> },
		{ link: "/exhibitions", title: "Exhibitions", icon: <ArtTrackIcon /> },
		{ link: "/agereport", title: "Age Report", icon: <TodayIcon /> },
		{ link: "/heightreport", title: "Height Report", icon: <HeightIcon /> },
        { link: "/chat", title: "Chat", icon: <ChatIcon /> },
    ];

	return (
        <Box sx={{ flexGrow: 1, position: "sticky", top: "0", zIndex: "9" }}>
            <AppBar position="static" sx={{ marginBottom: "20px" }}>
                <Toolbar>
                    {isSmallScreen ? (
                        <>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenuOpen}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ mr: 5, whiteSpace: "nowrap" }}
                            >
                                Museum Management
                            </Typography>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    to="/"
                                >
                                    <IconButton size="large" color="inherit">
                                        <HomeIcon />
                                    </IconButton>
                                    Home
                                </MenuItem>

                                {menuItems.map((item) => (
                                    <MenuItem
                                        key={item.title}
                                        onClick={handleMenuClose}
                                        component={Link}
                                        to={item.link}
                                    >
                                        <IconButton
                                            size="large"
                                            color="inherit"
                                        >
                                            {item.icon}
                                        </IconButton>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    ) : (
                        <>
                            <IconButton
                                component={Link}
                                to="/"
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="school"
                                sx={{ mr: 2 }}
                            >
                                <HomeIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ mr: 5, whiteSpace: "nowrap" }}
                            >
                                Museum Management
                            </Typography>

                            {menuItems.map((item) => (
                                <Button
                                    key={item.title}
                                    variant={
                                        path.startsWith(item.link)
                                            ? "outlined"
                                            : "text"
                                    }
                                    to={item.link}
                                    component={Link}
                                    color="inherit"
                                    sx={{ mr: 5 }}
                                    startIcon={item.icon}
                                >
                                    {item.title}
                                </Button>
                            ))}
                        </>
                    )}

                    <Box sx={{ display: "flex", marginLeft: "auto" }}>
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
                                    getAccount()?.accessLevel ===
                                    AccessLevel.Admin
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
							data-testid="login-button"
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
                                    getAccount() !== null
                                        ? "none"
                                        : "inline-flex",
                            }}
							data-testid="register-button"
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
                                    getAccount() !== null
                                        ? "inline-flex"
                                        : "none",
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