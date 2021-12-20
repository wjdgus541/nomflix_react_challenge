const API_KEY = "cc1f78b6700d413b0a8c908e50c48e48";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id:number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximun:string;
        minimun:string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_result: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}