import { useLocation } from "react-router";
import SearchMovies from "../Components/SearchMovies";
import SearchTv from "../Components/SearchTv";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top:100px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  return (
    <Wrapper>
      <SearchTv keyword={keyword} />
      <SearchMovies keyword={keyword} />
    </Wrapper>
  );
}
export default Search;