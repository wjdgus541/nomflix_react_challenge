import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getNowPlayingMovies, IGetNowMoviesResult } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState } from "react";

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SliderWrapper = styled.div`
  margin: 20px;
  height: 300px;
`;

export const SliderTitle = styled.h2`
  font-size: 30px;
  position: relative;
  margin-bottom: 10px;
`;

export const Slider = styled.div`
  position: relative;
`;

export const SlideLeft = styled.div`
  position: relative;
  font-size: 20px;
  padding: 0 10px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
  }
  & > * {
    height: 200px;
  }
`;

export const SlideRight = styled.div`
  position: relative;
  font-size: 20px;
  padding: 0 10px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -200px;
  float: right;
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
  }
  & > * {
    height: 200px;
  }
`;

export const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

export const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  border-radius: 8px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

export const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

export const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  background-color: red;
`;

export const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

export const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

export const rowVariants = {
  hidden: {
    x: window.outerWidth - 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 5,
  },
};

export const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

export const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    y: -80,
    transition: {
      delay: 0.3,
      duaration: 0.3,
      type: "tween",
    },
  },
};

export const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duaration: 0.1,
      type: "tween",
    },
  },
};

type PropsType = {
  movieData: IGetNowMoviesResult;
  title: string;
};

export default function Movies({ movieData, title }: PropsType) {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const offset = 6;
  const increaseIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );

  return (
    <>
      <SliderWrapper>
        <SliderTitle>{title}</SliderTitle>
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
              {movieData?.results
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
                    bgPhoto={makeImagePath(
                      movie.backdrop_path
                        ? movie.backdrop_path
                        : movie.poster_path,
                      "w500"
                    )}
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
                  {console.log("Up :", clickedMovie)}
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
