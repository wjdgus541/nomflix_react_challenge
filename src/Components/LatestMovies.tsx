import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getLatestMovies, IGetLatestMoviesResult } from "../api";
import {
  Loader,
  SliderWrapper,
  SliderTitle,
  Slider,
  Row,
  Box,
  Info,
  Overlay,
  BigMovie,
  BigCover,
  BigTitle,
  BigOverview,
  rowVariants,
  boxVariants,
  infoVariants,
  SlideLeft,
  SlideRight,
} from "../Components/Moviestyles";
import { makeImagePath } from "../utils";

function LatestMovies() {
  const { data: latest, isLoading: latestLoad } =
    useQuery<IGetLatestMoviesResult>(["movies", "latest"], getLatestMovies);
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    latest?.id === +bigMovieMatch.params.movieId
      ? latest
      : null;

  return (
    <>
      {latestLoad ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SliderWrapper>
            <SliderTitle>Latest</SliderTitle>
            <Slider>
              <AnimatePresence>
                <Row>
                  {latest ? (
                    <Box
                      layoutId={latest.id + ""}
                      key={latest.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(latest.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(
                        latest.backdrop_path
                          ? latest.backdrop_path
                          : latest.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{latest.title}</h4>
                      </Info>
                    </Box>
                  ) : null}
                </Row>
              </AnimatePresence>
            </Slider>
          </SliderWrapper>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() - 600 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path
                              ? clickedMovie.backdrop_path
                              : clickedMovie.poster_path
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default LatestMovies;
