import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Grid2 as Grid, Box, CircularProgress, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { useGetActorDetailsQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import useStyles from './styles';
import { MovieList, Pagination } from '..';

const Actors = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isFetching, error } = useGetActorDetailsQuery(id);
  const { data: movies } = useGetMoviesByActorIdQuery({ id, page })

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} color="primary">
          Go back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ lg: 5, xl: 4 }}>
          <img
            className={classes.image}
            src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
            alt={data?.name}
          />
        </Grid>
        <Grid size={{ lg: 7, xl: 8 }} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <Typography variant="h2" gutterBottom>
            {data?.name}
          </Typography>
          <Typography variant="h5" gutterBottom >
            Born: {new Date(data?.birthday).toDateString()}
          </Typography>
          <Typography variant="body1" gutterBottom align="justify" sx={{ mb: 2 }}>
            {data?.biography || 'Sorry, no biography yet..'}
          </Typography>
          <Box marginTop="2rem" display="flex" justifyContent="space-around">
            <Button variant="contained" color="primary" target="_blank" href={`https://www.imdb.com/name/${data?.imdb_id}`}>
              IMDB
            </Button>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} color="primary">
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box margin="2rem 0">
        <Typography variant="h3" gutterBottom align="center">Movies</Typography>
        {movies && <MovieList movies={movies} numberOfMovies={12} />}
        <Pagination currentPage={page} setPage={setPage} totalPages={movies?.total_pages} />
      </Box>
    </>
  )
}

export default Actors