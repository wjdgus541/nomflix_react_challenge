import styled from "styled-components";

export const Wrapper = styled.div`
    background:black;
`;

export const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.bgPhoto});
    background-size:cover;
`;

export const BannerTitle = styled.h2`
    font-size:68px;
    margin-bottom:20px;
`;

export const BannerOverview = styled.p`
    font-size:30px;
    width:50%;
`;