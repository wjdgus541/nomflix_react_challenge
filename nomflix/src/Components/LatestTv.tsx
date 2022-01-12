import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getLatestTv, IGetLatestTvResult } from "../api";
import { Loader, SliderWrapper, SliderTitle, Slider, Row, Box, Info, Overlay, BigMovie, BigCover, BigTitle, BigOverview, rowVariants, boxVariants, infoVariants, SlideLeft, SlideRight } from "../Components/Moviestyles";
import { makeImagePath } from "../utils";


function LatestTv() {
    const { data:latest, isLoading:latestLoad } = useQuery<IGetLatestTvResult>(
        ["tv", "latest"],
        getLatestTv
    );
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
    const { scrollY } = useViewportScroll();
    const onBoxClicked = (tvId: number) => {
        history.push(`/tv/${tvId}`);
    };
    const onOverlayClick = () => history.push("/");
    const clickedMovie = bigMovieMatch?.params.tvId && latest?.id === +bigMovieMatch.params.tvId ? latest : null;
    
    return(
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
                                {latest?
                                    <Box
                                    layoutId={latest.id + ""}
                                    key={latest.id}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    onClick={() => onBoxClicked(latest.id)}
                                    transition={{ type: "tween" }}
                                    bgPhoto={makeImagePath(latest.backdrop_path ? latest.backdrop_path : latest.poster_path, "w500")}
                                    >
                                        <Info variants={infoVariants}>
                                        <h4>{latest.name}</h4>
                                        </Info>
                                    </Box>
                                : null}
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
                            style={{ top: scrollY.get() -600 }}
                            layoutId={bigMovieMatch.params.tvId}
                            >
                            {clickedMovie && (
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
                            )}
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
        </>
        )}
        </>
    )
}

export default LatestTv;