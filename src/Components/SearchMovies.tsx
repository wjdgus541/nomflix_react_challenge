import { Loader, SliderWrapper, SliderTitle, Slider, Row, Box, Info, Overlay, BigMovie, BigCover, BigTitle, BigOverview, offset, rowVariants, boxVariants, infoVariants, SlideLeft, SlideRight } from "../Components/Moviestyles";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { AnimatePresence, useViewportScroll } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { API_KEY, BASE_PATH } from "../api";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";

interface ISearchMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

interface IGetSearchMovie {
    page: number;
    results: ISearchMovie[];
    total_pages: number;
    total_result: number;
}

function SearchMovies({ keyword }: any) {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/search/:searchId");
    const { scrollY } = useViewportScroll();
    function getSearchMovies() {
        return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then(
            (response) => response.json()
        );
    }
    const { data: searchMovie, isLoading: movieLoading } = useQuery<IGetSearchMovie>(
        ["search", "movie"],
        getSearchMovies
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (searchMovie) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = searchMovie.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId: number) => {
        history.push(`/search/${movieId}`);
    };
    console.log(keyword);
    const onOverlayClick = () => history.push(`/search?keyword=${keyword}`);
    const clickedMovie = bigMovieMatch?.params.movieId && searchMovie?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

    return (
        <>
            {movieLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <SliderWrapper>
                        <SliderTitle>Movie</SliderTitle>
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
                                    {searchMovie?.results
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
                                                bgPhoto={makeImagePath(movie.backdrop_path ? movie.backdrop_path : movie.poster_path, "w500")}
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
                                    style={{ top: scrollY.get() - 600 }}
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

export default SearchMovies;