import React, { useState } from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid2 as Grid, Box, CircularProgress, useMediaQuery, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack, BorderColor } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import useStyles from './styles';
import { useGetMovieQuery } from '../../services/TMDB';
import genreIcons from '../../assets/genres';
import { useGetRecommendationsQuery } from '../../services/TMDB';
import { MovieList } from '..';

const MovieInformation = () => {
  const { id } = useParams();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ movie_id: id, list: 'recommendations' });

  const isMovieFavorited = false;
  const isMovieWatchlisted = false;

  const addToFavorites = () => {

  };
  const addToWatchlist = () => {

  };

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
        <Link to="/">Something has gone wrong - Go back</Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround} >
      <Grid size={{ sm: 12, md: 6, lg: 4 }}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid container direction="column" size={{ lg: 7 }}>
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data.release_date.split('-')[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid className={classes.containerSpaceAround} >
          <Box display="flex" alignItems="center" justifyContent="center" >
            <Rating readOnly value={data.vote_average / 2} />
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }} >
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime}min {data?.spoken_languages.length > 0 ? `/ ${data?.spoken_languages[0].name}` : ''}
          </Typography>
        </Grid>
        <Grid className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link key={genre.name} className={classes.links} to="/" onClick={() => { dispatch(selectGenreOrCategory(genre.id)) }} >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                className={classes.genreImage}
                height={30}
              />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }} >
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }} >
          {data?.overview}
        </Typography>
        <Typography variant="h5" gutterBottom >Top Cast</Typography>
        <Grid container spacing={2}>
          {data && data.credits.cast.map((character, i) => (
            character.profile_path && (
              <Grid key={i} size={{ xs: 4, md: 2 }} component={Link} to={`/actors/${character.id}`} style={{ textDecoration: 'none' }}>
                <img
                  className={classes.castImage}
                  src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                  alt={character.name}
                />
                <Typography color="textPrimary">{character?.name}</Typography>
                <Typography color="textSecondary">
                  {character.character.split('/')[0]}
                </Typography>
              </Grid>
            )
          )).slice(0, 6)}
        </Grid>
        <Grid container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid size={{ xs: 12, sm: 6 }} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button target="blank" rel="noopener noreferrer" href={data?.homepage} endIcon={<Language />}>Website</Button>
                <Button target="blank" rel="noopener noreferrer" href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />}>IMDB</Button>
                <Button onClick={() => setOpen(true)} href="#" endIcon={<Theaters />}>Trailer</Button>
              </ButtonGroup>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button onClick={addToFavorites} endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}>
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button onClick={addToWatchlist} endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}>
                  Watchlist
                </Button>
                <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary-main' }}>
                  <Typography component={Link} to="/" color="inherit" variant='subtitle2' style={{ textDecoration: 'none' }}>
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom="true" align="center">
          You might also like
        </Typography>
        {recommendations
          ? <MovieList movies={recommendations} numberOfMovies={12} />
          : <Box>Sorry, nothing was found.</Box>
        }
      </Box>
      {data?.videos?.results?.length > 0 && (
        <Modal
          closeAfterTransition
          className={classes.modal}
          open={open}
          onClose={() => setOpen(false)}
        >
          <iframe
            autoPlay
            className={classes.video}
            title="Trailer"
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow="autoplay"
          />
        </Modal>
      )}
    </Grid>
  )
}

export default MovieInformation