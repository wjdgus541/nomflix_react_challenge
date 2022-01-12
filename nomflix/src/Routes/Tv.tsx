import { useQuery } from "react-query";
import { getAiringTv, IGetTvResult } from "../api";
import { makeImagePath } from "../utils";
import { Loader } from "../Components/Moviestyles";
import { Banner, BannerOverview, BannerTitle, Wrapper } from "../Components/BannerStyles";
import AiringTv from "../Components/AiringTv";
import PopularTv from "../Components/PopularTv";
import TopTv from "../Components/TopTv";
import LatestTv from "../Components/LatestTv";

function Tv() {
    const { data:airing, isLoading:airingLoad } = useQuery<IGetTvResult>(
        ["movies", "airiing"],
        getAiringTv
    );
    return (
        <>
        <Wrapper>
        {airingLoad ? (
            <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              bgPhoto={makeImagePath(airing?.results[0].backdrop_path || "")}
            >
              <BannerTitle>{airing?.results[0].name}</BannerTitle>
              <BannerOverview>{airing?.results[0].overview}</BannerOverview>
            </Banner>
            <div style={{position:"relative", top:-200, paddingTop:50}}>    
                <AiringTv />
                <LatestTv />
                <PopularTv />
                <TopTv />
            </div>
          </>
        )}
      </Wrapper>
      
    </>
    );
}

export default Tv;