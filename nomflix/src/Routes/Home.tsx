import { useQuery } from "react-query";
import { getNowPlayingMovies, IGetNowMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { Loader } from "../Components/Moviestyles";
import LatestMovies from "../Components/LatestMovies";
import TopMovies from "../Components/TopMovies";
import UpcomingMovies from "../Components/UpcomingMovies";
import NowMovies from "../Components/NowMovies";
import { Banner, BannerOverview, BannerTitle, Wrapper } from "../Components/BannerStyles";

function Home() {
    const { data:nowPlaying, isLoading:nowPlayingLoad } = useQuery<IGetNowMoviesResult>(
        ["movies", "nowPlaying"],
        getNowPlayingMovies
    );
    return (
        <>
        <Wrapper>
        {nowPlayingLoad ? (
            <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
            >
              <BannerTitle>{nowPlaying?.results[0].title}</BannerTitle>
              <BannerOverview>{nowPlaying?.results[0].overview}</BannerOverview>
            </Banner>
            <div style={{position:"relative", top:-200, paddingTop:50}}>    
                <NowMovies />
                <LatestMovies />
                <TopMovies />
                <UpcomingMovies />
            </div>
          </>
        )}
      </Wrapper>
      
    </>
    );
}

export default Home;