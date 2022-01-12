import { Loader, SliderWrapper, SliderTitle, Slider, Row, Box, Info, Overlay, BigMovie, BigCover, BigTitle, BigOverview, offset, rowVariants, boxVariants, infoVariants, SlideLeft, SlideRight } from "../Components/Moviestyles";
import { makeImagePath } from "../utils";
import { useState } from "react";
import {  AnimatePresence, useViewportScroll } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { API_KEY, BASE_PATH } from "../api";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";

interface ISearchTv {
    id:number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
}
  
interface IGetSearchTv {
    page: number;
    results: ISearchTv[];
    total_pages: number;
    total_result: number;
}

function SearchTv({keyword}:any) {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ tvId: string }>("/search/:searchId");
    console.log(bigMovieMatch);
    const { scrollY } = useViewportScroll();
    function getSearchTv() {
        return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`).then(
          (response) => response.json()
        );
    }
    const { data:searchTv, isLoading:tvLoading } = useQuery<IGetSearchTv>(
        ["search", "tv"],
        getSearchTv
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (searchTv) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = searchTv.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (tvId: number) => {
        history.push(`/search/${tvId}`);
    };
    const onOverlayClick = () => history.push(`/search?keyword=${keyword}`);
    const clickedMovie = bigMovieMatch?.params.tvId && searchTv?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId);
    
    return(
        <>
        {tvLoading ? (
            <Loader>Loading...</Loader>
        ) : (
            <>
                <SliderWrapper>
                    <SliderTitle>TV</SliderTitle>
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
                                {searchTv?.results
                                .slice(1)
                                .slice(offset * index, offset * index + offset)
                                .map((tv) => (
                                    <Box
                                        layoutId={tv.id + ""}
                                        key={tv.id}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        onClick={() => onBoxClicked(tv.id)}
                                        transition={{ type: "tween" }}
                                        bgPhoto={makeImagePath(tv.backdrop_path ? tv.backdrop_path : tv.poster_path , "w500")}
                                    >
                                        <Info variants={infoVariants}>
                                        <h4>{tv.name}</h4>
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
                                layoutId={bigMovieMatch.params.tvId}
                                >
                                {clickedMovie ? (
                                    <>
                                    <BigCover
                                        style={{
                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                            clickedMovie.backdrop_path ? clickedMovie.backdrop_path : clickedMovie.poster_path
                                        )})`,
                                        }}
                                    />
                                    <BigTitle>{clickedMovie.name}</BigTitle>
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

export default SearchTv;