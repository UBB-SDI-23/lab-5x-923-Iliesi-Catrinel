import * as React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";
import { SnackbarContext } from "./components/SnackbarContext";
import { AppMenu } from "./components/AppMenu";
import { AppHome } from "./components/AppHome";
import { AllArtists } from "./components/artists/AllArtists";
import { ArtistDetails } from "./components/artists/ArtistDetails";
import { ArtistAdd } from "./components/artists/ArtistAdd";
import { ArtistUpdate } from "./components/artists/ArtistUpdate";
import { ArtistDelete } from "./components/artists/ArtistDelete";
import { ArtistAveragePaintingAge } from "./components/artists/ArtistAveragePaintingAge";
import { AllPaintings } from "./components/paintings/AllPaintings";
import { ToastContainer } from "react-toastify";
import { PaintingDetails } from "./components/paintings/PaintingDetails";
import { PaintingAdd } from "./components/paintings/PaintingAdd";
import { PaintingDelete } from "./components/paintings/PaintingDelete";
import { PaintingUpdate } from "./components/paintings/PaintingUpdate";
import { PaintingFilter } from "./components/paintings/PaintingFilter";
import { ArtistAveragePaintingHeight } from "./components/artists/ArtistAveragePaintingHeight";
import { AllMuseums } from "./components/museums/AllMuseums";
import { MuseumDetails } from "./components/museums/MuseumDetails";
import { MuseumDelete } from "./components/museums/MuseumDelete";
import { MuseumAdd } from "./components/museums/MuseumAdd";
import { MuseumUpdate } from "./components/museums/MuseumUpdate";
import { AllExhibitions } from "./components/exhibitions/AllExhibitions";
import { ArtistExhibitionAdd } from "./components/artists/ArtistExhibitionAdd";
import { UserDetails } from "./components/users/UserDetails";
import { UserRegister } from "./components/users/UserRegister";
import { UserConfirm } from "./components/users/UserConfirm";
import { UserLogin } from "./components/users/UserLogin";
import { MuseumExhibitionAdd } from "./components/museums/MuseumExhibitionAdd";
import { ExhibitionAdd } from "./components/exhibitions/ExhibitionAdd";
import { ExhibitionUpdate } from "./components/exhibitions/ExhibitionUpdate";
import { ExhibitionDetails } from "./components/exhibitions/ExhibitionDetails";
import { ExhibitionDelete } from "./components/exhibitions/ExhibitionDelete";
import { Box } from "@mui/material";
import { AdminPanel } from "./components/users/AdminPanel";
import { AllUsers } from "./components/users/AllUsers";
import { UserAdd } from "./components/users/UserAdd";
import { UserDelete } from "./components/users/UserDelete";
import { UserUpdate } from "./components/users/UserUpdate";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
	const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [message, setMessage] = useState("placeholder");

    const openSnackbar = (severity: AlertColor, message: string) => {
        handleClose();

        setTimeout(() => {
            setSeverity(severity);
            setMessage(message);
            setOpen(true);
        }, 250);
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

  	return (
		<React.Fragment>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%", whiteSpace: "pre-wrap" }}
                >
                    {message}
                </Alert>
            </Snackbar>

			<SnackbarContext.Provider value={openSnackbar}>
				<Router>
					<AppMenu />

					<Routes>
						<Route path="/" element={<AppHome />} />

						<Route path="/users/:userId/details" element={<UserDetails />}/>
                        <Route path="/users/register" element={<UserRegister />}/>
                        <Route path="/users/register/confirm/:code" element={<UserConfirm />}/>
                        <Route path="/users/login" element={<UserLogin />} />

						<Route path="/users/adminpanel" element={<AdminPanel />}/>
						<Route path="/users" element={<AllUsers />} />
                        <Route path="/users/:userId/details" element={<UserDetails />}/>
                        <Route path="/users/add" element={<UserAdd />} />
                        <Route path="/users/:userId/delete" element={<UserDelete />}/>
                        <Route path="/users/:userId/edit" element={<UserUpdate />}/>

						<Route path="/artists" element={<AllArtists />} />
						<Route path="/artists/:artistId/details" element={<ArtistDetails />} />
						<Route path="/artists/add" element={<ArtistAdd />} /> 
						<Route path="/artists/:artistId/delete" element={<ArtistDelete />} />
						<Route path="/artists/:artistId/edit" element={<ArtistUpdate />} />
						<Route path="/agereport" element={<ArtistAveragePaintingAge />} />
						<Route path="/heightreport" element={<ArtistAveragePaintingHeight />} />
						<Route path="/artists/:artistId/addexhibition" element={<ArtistExhibitionAdd />} />

						<Route path="/paintings" element={<AllPaintings />} />
						<Route path="/paintings/:paintingId/details" element={<PaintingDetails />} />
						<Route path="/paintings/add" element={<PaintingAdd />} /> 
						<Route path="/paintings/:paintingId/delete" element={<PaintingDelete />} />
						<Route path="/paintings/:paintingId/edit" element={<PaintingUpdate />} />
						<Route path="/filterpaintings" element={<PaintingFilter />} />

						<Route path="/museums" element={<AllMuseums />} />
						<Route path="/museums/:museumId/details" element={<MuseumDetails />} />
						<Route path="/museums/add" element={<MuseumAdd />} /> 
						<Route path="/museums/:museumId/delete" element={<MuseumDelete />} />
						<Route path="/museums/:museumId/edit" element={<MuseumUpdate />} />
						<Route path="/museums/:museumId/addexhibition" element={<MuseumExhibitionAdd />}/>

						<Route path="/exhibitions" element={<AllExhibitions />} />
						<Route path="/exhibitions/:artistId/:museumId/details" element={<ExhibitionDetails />} />
						<Route path="/exhibitions/add" element={<ExhibitionAdd />} /> 
						<Route path="/exhibitions/:artistId/:museumId/delete" element={<ExhibitionDelete />} />
						<Route path="/exhibitions/:artistId/:museumId/edit" element={<ExhibitionUpdate />} />
					</Routes>
					<Box sx={{ mb: 4 }} />
				</Router>
			</SnackbarContext.Provider>
		</React.Fragment>
	);
}

export default App;
