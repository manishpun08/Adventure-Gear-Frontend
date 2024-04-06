import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Chip, Container, Stack } from "@mui/material";
import { fallbackImage } from "../constant/general.constant";
import { useNavigate } from "react-router-dom";

const ProductCard = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <Card
        sx={{
          width: { xs: "100%", md: "23.9%", sm: "40%" },
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}
      >
        <CardMedia
          onClick={() => {
            navigate(`/productDetails/${props._id}`);
          }}
          sx={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            marginTop: "7px",
            cursor: "pointer",
          }}
          // if image, image if not fallBackimage function hit
          image={props.image || fallbackImage}
          title={props.name}
        />
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Typography
              gutterBottom
              sx={{ fontWeight: "bold", fontSize: "14px" }}
              component="div"
            >
              {props.name}
            </Typography>
            <Chip label={props.brand} variant="outlined" color="secondary" />
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign={"justify"}
            sx={{ minHeight: "100px" }}
          >
            {props.description.trim()}....
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() => {
              navigate(`/productDetails/${props._id}`);
            }}
          >
            Explore
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ProductCard;
