import { Loader, SliderWrapper, SliderTitle, Slider, Row, Box, Info, Overlay, BigMovie, BigCover, BigTitle, BigOverview, offset, rowVariants, boxVariants, infoVariants, SlideLeft, SlideRight } from "../Components/Moviestyles";
import { makeImagePath } from "../utils";
import { useState } from "react";
import {  AnimatePresence, useViewportScroll } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getNowPlayingMovies, IGetNowMoviesResult } from "../api";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";

function NowMovies() {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const { scrollY } = useViewportScroll();
    const { data:nowPlaying, isLoading:nowPlayingLoad } = useQuery<IGetNowMoviesResult>(
        ["movies", "nowPlaying"],
        getNowPlayingMovies
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (nowPlaying) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = nowPlaying.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId: number) => {
        history.push(`/movies/${movieId}`);
    };
    const onOverlayClick = () => history.push("/");
    const clickedMovie = bigMovieMatch?.params.movieId && nowPlaying?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
    
    return(
        <>
        {nowPlayingLoad ? (
            <Loader>Loading...</Loader>
        ) : (
            <>
                <SliderWrapper>
                    <SliderTitle>Now Playing</SliderTitle>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>                
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index}
                            >
                                {nowPlaying?.results
                                .slice(1)
                                .slice(offset * index, offset * index + offset)
                                .map((movie) => (
                                    <Box
                                        layoutId={movie.id + ""}
                                        key={movie.id}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        onClick={() => onBoxClicked(movie.id)}
                                        transition={{ type: "tween" }}
                                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                    >
                                        <Info variants={infoVariants}>
                                        <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                ))}
                            </Row>
                    </AnimatePresence>
                    </Slider>
                    <SlideLeft>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </SlideLeft>
                    <SlideRight>
                        <FontAwesomeIcon icon={faChevronRight} onClick={increaseIndex} />
                    </SlideRight>
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
                                style={{ top: scrollY.get() -600 }}
                                layoutId={bigMovieMatch.params.movieId}
                                >
                                {clickedMovie ? (
                                    <>
                                    <BigCover
                                        style={{
                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                            clickedMovie.backdrop_path
                                        )})`,
                                        }}
                                    />
                                    <BigTitle>{clickedMovie.title}</BigTitle>
                                    <BigOverview>{clickedMovie.overview}</BigOverview>
                                    </>
                                ) : null}
                            </BigMovie>
                        </>
                    ) : null}
                </AnimatePresence>
            </>
        )}
        </>
    )
}

export default NowMovies;