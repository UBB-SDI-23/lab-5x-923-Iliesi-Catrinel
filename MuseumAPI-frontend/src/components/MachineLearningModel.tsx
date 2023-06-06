import React, { useState } from 'react';
import {
    Button,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { BACKEND_API_URL } from '../constants';

export const MachineLearningModel: React.FC = () => {
    const [creationYear, setCreationYear] = useState('');
    const [height, setHeight] = useState('');
    const [price, setPrice] = useState('');

    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreationYear(event.target.value);
    };

    const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (/^\d*\.?\d*$/.test(value)) {
            setHeight(value);
        }
      };

      const handlePredictButtonClick = () => {
        fetch(`${BACKEND_API_URL}/MachineLearningModel/${creationYear}/${height}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => setPrice(data))
          .catch((error) => console.error(error));
      };
      

    return (
        <Container>
            <h1>Price Prediction for a Painting</h1>
            <Grid container justifyContent="flex-start">
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        The Machine Learning Model was trained on a dataset with 1 million rows.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Algorithm: Fast Forest Regression
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Training time: 600 seconds (10 minutes)
                    </Typography>
                </Grid>
            </Grid>

            <br />
            <Grid container justifyContent="left" alignItems="left">
                <Grid item>
                <TextField
                    value={creationYear}
                    onChange={handleYearChange}
                    label="creationYear"
                    type="number"
                    />
                <TextField
                    value={height}
                    onChange={handleHeightChange}
                    label="height"
                    type="text"
                    />
                </Grid>
            </Grid>
            <br />
            <Grid container justifyContent="left" alignItems="left">
                <Grid item>
                    <Button variant="contained" onClick={handlePredictButtonClick}>
                        Predict
                    </Button>
                </Grid>
            </Grid>
            <br />
            <Grid container justifyContent="left" alignItems="left">
                <Grid item>
                    {price && (
                        <Typography variant="h4" gutterBottom>
                            Predicted Price: {price} €
                        </Typography>
                    )}
                </Grid>
            </Grid>             
        </Container>
  );
};

