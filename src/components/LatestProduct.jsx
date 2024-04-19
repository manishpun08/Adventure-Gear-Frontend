import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { fallbackImage } from "../constant/general.constant";
import $axios from "../lib/axios.instance";
import Loader from "./Loader";

const LatestProduct = (props) => {
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ["latest-product"],
    queryFn: async () => {
      return await $axios.get("/product/list/latest");
    },
  });

  // data fetching
  const latestProducts = data?.data?.latestProducts;

  //  if loading show loader
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight="800"
        sx={{ marginTop: "2rem" }}
      >
        LATEST PRODUCT
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        {latestProducts?.map((item) => {
          return (
            <Card
              key={item._id}
              sx={{
                width: { xs: "100%", md: "22.9%", sm: "40%" },
                boxShadow:
                  "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              }}
            >
              <img
                onClick={() => {
                  navigate(`/productDetails/${item._id}`);
                }}
                alt={item.name}
                src={item.image || fallbackImage}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  marginTop: "7px",
                  cursor: "pointer",
                }}
              />

              <CardContent>
                <Typography
                  gutterBottom
                  variant="body"
                  alignItems="center"
                  sx={{
                    fontWeight: "700",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {item.name}
                  <Chip color="secondary" label={item.brand} />
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign={"justify"}
                  sx={{ minHeight: "100px" }}
                >
                  {item.description.trim()}....
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight="600">Rs.{item.price}</Typography>
                  <Chip label="5% OFF" />
                </Stack>
              </CardContent>

              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  color="success"
                  onClick={() => {
                    navigate(`/productDetails/${item._id}`);
                  }}
                >
                  Explore
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

export default LatestProduct;
