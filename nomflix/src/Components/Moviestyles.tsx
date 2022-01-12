import styled from "styled-components";
import { motion } from "framer-motion";

export const Loader = styled.div`
height: 20vh;
display:flex;
justify-content:center;
align-items:center;
`;

export const SliderWrapper = styled.div`
    margin: 20px;
    height:300px;
`;

export const SliderTitle = styled.h2`
    font-size:30px;
    position: relative;
    margin-bottom:10px;
`;

export const Slider = styled.div`
    position: relative;
`;

export const SlideLeft = styled.div`
    position:relative;
    font-size:20px;
    padding: 0 10px;
    width:20px;
    display:flex;
    justify-content:center;
    align-items:center;
    :hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
    }
    & > * {
        height:200px;
    }
`

export const SlideRight = styled.div`
    position:relative;
    font-size:20px;
    padding: 0 10px;
    width:20px;
    display:flex;
    justify-content:center;
    align-items:center;
    top:-200px;
    float:right;
    :hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
    }
    & > * {
        height:200px;
    }
`;


export const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

export const Box = styled(motion.div)<{ bgPhoto: string}>`
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 66px;
    cursor: pointer;
    border-radius:8px;
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
    background-color:red;
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
        x: window.outerWidth -5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth +5,
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

export const offset = 6;
