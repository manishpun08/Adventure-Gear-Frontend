import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { productCategories } from "../constant/general.constant";
import $axios from "../lib/axios.instance";
import {
  openErrorSnackbar,
  openSuccessSnackbar,
} from "../store/slices/snackbarSlice";
import Loader from "../components/Loader";
import dayjs from "dayjs";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Profile = () => {
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [localUrl, setLocalUrl] = useState(null);

  const [imageLoading, setImageLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  // get profile details
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["get-profile-details"],
    queryFn: async () => {
      return await $axios.get(`/userProfile/get/${params.id}`);
    },
  });

  const user = data?.data?.user;

  // mutate api
  const { isLoading: editLoading, mutate } = useMutation({
    mutationKey: ["edit-profile"],
    mutationFn: async (values) => {
      return await $axios.post(`/userProfile/edit/${params?.id}`, values);
    },
    onSuccess: (res) => {
      dispatch(openSuccessSnackbar(res?.data?.message));
      navigate("/home");
    },
    onError: (error) => {
      dispatch(openErrorSnackbar(error?.response?.data?.message));
    },
  });

  if (isLoading || imageLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          // flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Formik
          //re initialize garna milne
          enableReinitialize
          initialValues={{
            image: user?.image || null,
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",

            gender: user?.gender || "",
            // dob: user?.dob || null,
          }}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .required("First Name is required.")
              .trim()
              .max(25, "First Name must be at max of 25 character."),
            lastName: Yup.string()
              .required("Last Name is required")
              .trim()
              .max(25, "First Name must be at max of 25 character."),
            email: Yup.string()
              .email("Email must be valid.")
              .required("Email is required.")
              .trim()
              .lowercase()
              .max(55, "Email must be at max of 55 character"),

            gender: Yup.string()
              .nullable()
              .oneOf(["male", "female", "other"])
              .trim(),

            image: Yup.string().trim().nullable(),
          })}
          onSubmit={async (values) => {
            let imageUrl;

            if (profileImage) {
              const cloudname = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
              const uploadPreset = import.meta.env
                .VITE_CLOUDINARY_UPLOAD_PRESET;
              const data = new FormData();
              data.append("file", profileImage);
              data.append("upload_preset", uploadPreset);
              data.append("cloud_name", cloudname);
              try {
                setImageLoading(true);
                const res = await axios.post(
                  `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
                  data
                );
                setImageLoading(false);
                imageUrl = res?.data?.secure_url;
                console.log(imageUrl);
              } catch (error) {
                setImageLoading(false);
                console.log("File upload failed");
              }
            }
            values.image = imageUrl;
            console.log(values);
            mutate(values);
          }}
        >
          {({ handleSubmit, getFieldProps, errors, touched }) => (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "2rem",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                width: "450px",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h5" textAlign="center">
                Edit Product
              </Typography>

              {/* cloudniary image  */}
              <Stack sx={{ height: "300px" }}>
                {(localUrl || user?.image) && (
                  <img
                    src={localUrl || user?.image}
                    style={{ height: "100%" }}
                    alt={user?.name}
                  />
                )}
              </Stack>
              <FormControl>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => {
                      const file = event?.target?.files[0];
                      setProfileImage(file);
                      setLocalUrl(URL.createObjectURL(file));
                    }}
                  />
                </Button>
              </FormControl>

              <Stack direction="row" spacing={2}>
                <FormControl>
                  <TextField
                    label="First Name"
                    {...getFieldProps("firstName")}
                  />
                  {touched.firstName && errors.firstName ? (
                    <FormHelperText error>{errors.firstName}</FormHelperText>
                  ) : null}
                </FormControl>

                <FormControl>
                  <TextField label="Last Name" {...getFieldProps("lastName")} />
                  {touched.lastName && errors.lastName ? (
                    <FormHelperText error>{errors.lastName}</FormHelperText>
                  ) : null}
                </FormControl>
              </Stack>

              <FormControl>
                <TextField
                  required
                  label="Email"
                  type="email"
                  {...getFieldProps("email")}
                />
                {touched.email && errors.email ? (
                  <FormHelperText error>{errors.email}</FormHelperText>
                ) : null}
              </FormControl>

              <FormControl>
                <InputLabel>Gender</InputLabel>
                <Select label="Gender" {...getFieldProps("gender")}>
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"other"}>Prefer Not To Say</MenuItem>
                </Select>
                {touched.gender && errors.gender ? (
                  <FormHelperText error>{errors.gender}</FormHelperText>
                ) : null}
              </FormControl>

              {/* dob */}
              {/* <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="DOB"
                    disableFuture
                    minDate={minDate} // Set minimum date
                    value={values.dob ? dayjs(values.dob, "DD/MM/YYYY") : null} // Convert dob value to Date object
                    onChange={(date) => {
                      setFieldValue("dob", dayjs(date).format("DD/MM/YYYY"));
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                {touched.dob && errors.dob ? (
                  <FormHelperText error>{errors.dob}</FormHelperText>
                ) : null}
              </FormControl> */}

              <Button
                type="submit"
                variant="contained"
                color="success"
                // disabled={isLoading}
              >
                Submit
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </div>
  );
};

export default Profile;
