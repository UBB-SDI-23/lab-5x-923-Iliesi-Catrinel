import {
    Box,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Button,
    TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { User } from "../../models/User";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Gender, MaritalStatus } from "../../models/UserProfile";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken, updatePref } from "../../auth";
import axios, { AxiosError } from "axios";

export const UserDetails = () => {
    const openSnackbar = useContext(SnackbarContext);
    const { userId } = useParams();
    const [user, setUser] = useState<User>();

    const [preferenceText, setPreferenceText] = useState("5");

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get<User>(
                `${BACKEND_API_URL}/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );

            const user = response.data;
            setUser(user);
            setPreferenceText(
                user.userProfile?.pagePreference?.toString() ?? "5"
            );
        };
        fetchUser();
    }, [userId]);

    const savePreference = async (pref: number) => {
        try {
            await axios
                .patch(
                    `${BACKEND_API_URL}/users/${userId}/${pref}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then(() => {
                    openSnackbar("success", "Preference updated successfully!");
                    if (user && user.userProfile) {
                        user.userProfile.pagePreference = pref;
                    }

                    updatePref(pref);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update preference!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update preference due to an unknown error!"
            );
        }
    };

    function parseData() {
        const intValue = parseInt(preferenceText, 10);

        if (intValue > 0 && intValue <= 100) {
            savePreference(intValue);
        } else {
            openSnackbar("error", "Please enter a valid number (0 < n <= 100)");
        }
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value.replace(/[^\d]/g, "");
        setPreferenceText(value);
    }

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            parseData();
        }
    }

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start">
                        <IconButton
                            disabled
                            component={Link}
                            sx={{ mb: 2, mr: 3 }}
                            to={``}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <h1
                            style={{
                                flex: 1,
                                textAlign: "center",
                                marginLeft: -64,
                                marginTop: -4,
                            }}
                        >
                            User Details
                        </h1>
                    </Box>

                    <Box sx={{ ml: 1 }}>
                        <p>Name: {user?.name}</p>
                        <p>Bio: {user?.userProfile?.bio}</p>
                        <p>Location: {user?.userProfile?.location}</p>
                        <p>
                            Birthday: {formatDate(user?.userProfile?.birthday)}
                        </p>
                        <p>
                            Gender:{" "}
                            {user == null || user.userProfile == null
                                ? ""
                                : Gender[user.userProfile.gender]}
                        </p>
                        <p>
                            Marital Status:{" "}
                            {user == null || user.userProfile == null
                                ? ""
                                : MaritalStatus[user.userProfile.gender]}
                        </p>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 16,
                                marginBottom: 16,
                            }}
                        >
                            <p
                                style={{
                                    marginRight: 8,
                                    userSelect: "none",
                                }}
                            >
                                {`Page Preference: `}
                            </p>
                            <TextField
                                value={preferenceText}
                                type="text"
                                inputProps={{
                                    min: 1,
                                    style: { textAlign: "center" },
                                }}
                                onChange={handleInputChange}
                                onKeyPress={handleInputKeyPress}
                                variant="outlined"
                                size="small"
                                style={{
                                    width: 100,
                                    marginRight: 16,
                                }}
                            />
                            <Button variant="contained" onClick={parseData}>
                                Save
                            </Button>
                        </div>

                        <p>User insertion stats:</p>
                        <ul style={{ marginBottom: 0 }}>
                            <li key={0}>Artists: {user?.artistCount}</li>
                            <li key={1}>Paintings: {user?.paintingCount}</li>
                            <li key={2}>Museums: {user?.museumCount}</li>
                            <li key={3}>Exhibitions: {user?.exhibitionCount}</li>
                        </ul>
                    </Box>
                </CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
                    <Button
                        component={Link}
                        to={`/users/${userId}/edit`}
                        disabled={true}
                        variant="text"
                        size="large"
                        sx={{
                            color: "gray",
                            textTransform: "none",
                        }}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>

                    <Button
                        component={Link}
                        to={`/users/${userId}/delete`}
                        disabled={true}
                        variant="text"
                        size="large"
                        sx={{ color: "red", textTransform: "none" }}
                        startIcon={<DeleteForeverIcon />}
                    >
                        Delete
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};