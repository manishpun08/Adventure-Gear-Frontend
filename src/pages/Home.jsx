import React, { Suspense } from "react";
// import SliderHome from "../components/SliderHome";
const SliderHome = React.lazy(() => import("../components/SliderHome"));
const ProductSlider = React.lazy(() => import("../components/LatestProduct"));
const Category = React.lazy(() => import("../components/Category"));
const Banner = React.lazy(() => import("../components/Banner"));

const Home = () => {
  return (
    <>
      <Suspense>
        <SliderHome />
        <ProductSlider />
        <Banner />
        <Category />
      </Suspense>
    </>
  );
};

export default Home;
