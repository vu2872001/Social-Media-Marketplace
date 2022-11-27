import React from "react";
import ThreeColumns from "../../components/Layout/ThreeColumns";
import { Tooltip, Pagination, Typography, Fab } from "@mui/material";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { ShoppingBag } from "@mui/icons-material";
import SellIcon from "@mui/icons-material/Sell";
import ProductCard from "./ProductCard";
import styled from "styled-components";
import MarketPlaceLeftBar from "./MarketPlaceLeftBar";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllShoppingProduct } from "../../redux/apiRequest";
import { getProductDetail } from "../../redux/product/productSlice";
import { useState } from "react";

//#region media responsive
const ResponSiveDiv = styled.div`
  .btn-product-action {
    display: flex;
    justify-content: space-evenly;
    gap: 1rem;
    font-size: 1.5rem;
  }
  .fab-btn-check-out,
  .fab-btn-selling {
    display: none;
  }
  .product-container {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    display: grid;
    gap: 10px;
  }
  .productCartDetailModal {
    display: none;
  }
  @media only screen and (max-width: 1780px) {
    .product-container {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
  @media only screen and (max-width: 1510px) {
    .product-container {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media only screen and (max-width: 1402px) {
    .btn-product-action {
      flex-direction: column;
    }
  }
  @media only screen and (max-height: 600px) {
  }
  @media only screen and (max-width: 1252px) {
    .product-container {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      justify-content: center;
    }
  }
  @media only screen and (max-width: 958px) {
    .product-container {
      grid-template-columns: repeat(1, minmax(0, 0.8fr));
      justify-content: center;
    }
  }
  @media only screen and (max-width: 820px) {
    .product-container {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      justify-content: center;
    }
    .marketPlaceHomeLeftBar {
      display: none;
    }
    .fab-btn-check-out,
    .fab-btn-selling {
      display: block;
    }
    .ThreeColumns {
      padding-left: 1%;
      padding-right: 1%;
    }
  }
  @media only screen and (max-width: 508px) {
    .product-container {
      grid-template-columns: repeat(1, minmax(0, 0.8fr));
      justify-content: center;
    }
  }
`;
function Shopping() {
  //#region declare variables
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.auth.login.currentUser.access
  );
  const refreshToken = useSelector(
    (state) => state.auth.login.currentUser.refresh
  );
  const productList = useSelector(
    (state) => state.product?.getShopping?.data,
    shallowEqual
  );
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 750,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };
  const [page, setPage] = React.useState(1);
  const [productDetail,setProductDetail] = useState()
  const handleChange = (event, value) => {
    setPage(value);
  };
  const navigate = useNavigate();

  // #endregion
  //#region declare function
  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //#endregion
  let randomNum = randomNumberInRange(1400, 1050);
  const handleViewDetail = (productObj) => {
    setProductDetail(productObj)
  };
  const handleAddToCart = () => {
    console.log("add to cart");
  };
  const handleNavigateToCheckOut = () => {
    navigate("/marketplace/checkout");
  };
  const handleNavigateToSelling = () => {
    navigate("/marketplace/selling");
  };
  useEffect(() => {
    getAllShoppingProduct(accessToken, refreshToken, dispatch);
  },[]);
  return (
    <>
      <ResponSiveDiv>
        <ThreeColumns className="ThreeColumns pr-[2%] pl-[430px] pt-6">
          <MarketPlaceLeftBar productDetail={productDetail} />
          <div className="main-market-place mb-[2rem] rounded-xl h-full p-[1.5rem] shadow-2xl ">
            <Fab
              onClick={handleNavigateToCheckOut}
              className="fab-btn-check-out"
              color="primary"
              aria-label="add"
              style={{
                background: "var(--primary-color)",
                top: "50%",
                position: "fixed",
              }}
            >
              <ShoppingCartCheckoutIcon style={{ fontSize: "2.5rem" }} />
            </Fab>
            <Fab
              onClick={handleNavigateToSelling}
              className="fab-btn-selling"
              color="primary"
              aria-label="add"
              style={{
                background: "var(--primary-color)",
                top: "57%",
                position: "fixed",
              }}
            >
              <SellIcon style={{ fontSize: "2.5rem" }} />
            </Fab>
            <div className="slide-show">
              <Slider {...settings}>
                {[
                  ...Array.from({ length: 5 }, () =>
                    randomNumberInRange(1400, 1050)
                  ),
                ].map((index) => (
                  <div key={index}>
                    <img
                      className="h-[300px] w-full object-cover rounded-xl"
                      src={`https://source.unsplash.com/random/1000x${
                        randomNum * index
                      }/?3D Renders`}
                      alt=""
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="product-container mb-[1rem]">
              {productList &&
                productList.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    productObj={product}
                    arrayBtn={[
                      {
                        pos: 0,
                        text: "view details",
                        handle: handleViewDetail,
                      },
                      { pos: 1, text: "add to cart", handle: handleAddToCart },
                    ]}
                  />
                ))}
            </div>
            <div className="Pagination float-right">
              <Typography>Page: {page}</Typography>
              <Pagination
                page={page}
                onChange={handleChange}
                count={11}
                defaultPage={1}
                siblingCount={0}
                variant="outlined"
                size="large"
              />
            </div>
          </div>
        </ThreeColumns>
      </ResponSiveDiv>
      <Outlet />
    </>
  );
}

export default Shopping;
