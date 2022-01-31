import { useQuery } from "react-query";
import {
  getLatestMovies,
  getNowPlayingMovies,
  getTopMovies,
  getUpComingMovies,
  IGetLatestMoviesResult,
  IGetNowMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { Loader } from "../Components/Moviestyles";
import LatestMovies from "../Components/LatestMovies";
import {
  Banner,
  BannerOverview,
  BannerTitle,
  Wrapper,
} from "../Components/BannerStyles";
import Movies from "../Components/Movies";

function Home() {
  const { data: latest, isLoading: latestLoad } =
    useQuery<IGetLatestMoviesResult>(["movies", "latest"], getLatestMovies);
  const { data: nowPlaying, isLoading: nowPlayingLoad } =
    useQuery<IGetNowMoviesResult>(
      ["movies", "nowPlaying"],
      getNowPlayingMovies
    );
  const { data: upcoming, isLoading: upcomingLoad } =
    useQuery<IGetNowMoviesResult>(["movies", "upcoming"], getUpComingMovies);
  const { data: top, isLoading: topLoad } = useQuery<IGetNowMoviesResult>(
    ["movies", "top"],
    getTopMovies
  );

  return (
    <>
      <Wrapper>
        {nowPlayingLoad ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              bgPhoto={makeImagePath(
                nowPlaying?.results[0].backdrop_path || ""
              )}
            >
              <BannerTitle>{nowPlaying?.results[0].title}</BannerTitle>
              <BannerOverview>{nowPlaying?.results[0].overview}</BannerOverview>
            </Banner>
            <div style={{ position: "relative", top: -200, paddingTop: 50 }}>
              <LatestMovies />
              {!nowPlayingLoad && nowPlaying ? (
                <Movies movieData={nowPlaying} title={"Now Playing"} />
              ) : null}
              {!upcomingLoad && upcoming ? (
                <Movies movieData={upcoming} title={"Upcoming"} />
              ) : null}
              {!topLoad && top ? (
                <Movies movieData={top} title={"Top Rated"} />
              ) : null}
            </div>
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Home;
