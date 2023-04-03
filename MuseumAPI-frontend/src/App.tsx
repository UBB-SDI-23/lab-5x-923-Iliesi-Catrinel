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

function App() {

  return (
		<React.Fragment>
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
				</Routes>
			</Router>
		</React.Fragment>
	);
}

export default App
