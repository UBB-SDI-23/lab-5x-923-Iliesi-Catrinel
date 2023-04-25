import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { AddMuseumsToArtist } from "./components/artists/AddMuseumsToArtist";


function App() {

  return (
		<React.Fragment>
			<ToastContainer />
			<Router>
				<AppMenu />

				<Routes>
					<Route path="/" element={<AppHome />} />
					<Route path="/artists" element={<AllArtists />} />
					<Route path="/artists/:artistId/details" element={<ArtistDetails />} />
					<Route path="/artists/add" element={<ArtistAdd />} /> 
					<Route path="/artists/:artistId/delete" element={<ArtistDelete />} />
					<Route path="/artists/:artistId/edit" element={<ArtistUpdate />} />
					<Route path="/artists/getbypaintingage" element={<ArtistAveragePaintingAge />} />
					<Route path="/artists/getbypaintingheight" element={<ArtistAveragePaintingHeight />} />
					<Route path="/artists/add-museums" element={<AddMuseumsToArtist />} />

					<Route path="/paintings" element={<AllPaintings />} />
					<Route path="/paintings/:paintingId/details" element={<PaintingDetails />} />
					<Route path="/paintings/add" element={<PaintingAdd />} /> 
					<Route path="/paintings/:paintingId/delete" element={<PaintingDelete />} />
					<Route path="/paintings/:paintingId/edit" element={<PaintingUpdate />} />
					<Route path="/paintings/filter-year" element={<PaintingFilter />} />

					<Route path="/museums" element={<AllMuseums />} />
					<Route path="/museums/:museumId/details" element={<MuseumDetails />} />
					<Route path="/museums/add" element={<MuseumAdd />} /> 
					<Route path="/museums/:museumId/delete" element={<MuseumDelete />} />
					<Route path="/museums/:museumId/edit" element={<MuseumUpdate />} />
				</Routes>
			</Router>
		</React.Fragment>
	);
}

export default App
