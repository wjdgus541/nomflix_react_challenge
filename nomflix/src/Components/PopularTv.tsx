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
  offset,
  rowVariants,
  boxVariants,
  infoVariants,
  SlideLeft,
  SlideRight,
} from "../Components/Moviestyles";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { AnimatePresence, useViewportScroll } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getPopularTv, IGetTvResult } from "../api";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";

function PopularTv() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const { data: popular, isLoading: popularLoad } = useQuery<IGetTvResult>(
    ["tv", "popular"],
    getPopularTv
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (popular) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = popular.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    popular?.results.find((movie) => movie.id === +bigMovieMatch.params.tvId);

  return (
    <>
      {popularLoad ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SliderWrapper>
            <SliderTitle>Popular</SliderTitle>
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
                  {popular?.results
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
                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
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
                  style={{ top: scrollY.get() - 600 }}
                  layoutId={bigMovieMatch.params.tvId}
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
  );
}

export default PopularTv;
