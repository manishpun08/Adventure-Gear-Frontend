import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { userProfileBackup } from "../constant/general.constant";
import $axios from "../lib/axios.instance";
import {
  openErrorSnackbar,
  openSuccessSnackbar,
} from "../store/slices/snackbarSlice";
import Loader from "./Loader";
import LobbyDetail from "./LobbyDetail";
import NoRecruit from "./NoRecruit";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: "100%",
      height: "100%",
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

// const fullName = getFullName();

const LobbyBody = () => {
  // const [joined, setJoined] = useState(false);
  // Initialize state to keep track of join status for each item
  const [joinedStatus, setJoinedStatus] = useState({});

  // Function to toggle join status for a specific item
  const toggleJoinStatus = (itemId) => {
    setJoinedStatus((prevStatus) => ({
      ...prevStatus,
      [itemId]: !prevStatus[itemId], // Toggle the join status for the item
    }));
  };

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  dayjs.extend(relativeTime);

  // for getting all the lobby list
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["get-recruit-list"],
    queryFn: async () => {
      return await $axios("/recruit/get/list");
    },
  });

  // for adding user to the slot
  const {
    isLoading: addUserLoading,
    isError: addUserError,
    mutate,
  } = useMutation({
    mutationKey: ["add-user-to-lobby"],
    mutationFn: async (_id) => {
      return await $axios.post(`/lobby/addUser/${_id}`);
    },
    onSuccess: (response) => {
      dispatch(openSuccessSnackbar(response?.data?.message));

      queryClient.invalidateQueries("get-recruit-list");
    },
    onError: (error) => {
      dispatch(openErrorSnackbar(error?.response?.data?.message));
    },
  });

  // for removing user to the slot
  const {
    isLoading: removeUserLoading,
    isError: removeUserError,
    mutate: removeUser,
  } = useMutation({
    mutationKey: ["leave-user-from-lobby"],
    mutationFn: async (_id) => {
      return await $axios.post(`/lobby/removeUser/${_id}`);
    },
    onSuccess: (response) => {
      dispatch(openSuccessSnackbar(response?.data?.message));

      queryClient.invalidateQueries("get-recruit-list");
    },
    onError: (error) => {
      dispatch(openErrorSnackbar(error?.response?.data?.message));
    },
  });

  const recruitList = data?.data?.recruitList;

  if (recruitList && recruitList.length < 1) {
    return <NoRecruit />;
  }

  if (isLoading || addUserLoading || removeUserLoading) {
    return <Loader />;
  }
  return (
    <>
      {/* <Stack>
        {recruitList?.map((item, index) => {
          return (
            <>
              <Box key={index}>
                <Stack
                  direction="row"
                  mt={2}
                  mb={2}
                  justifyContent={{ md: "space-between" }}
                >
                  <Typography variant="h5" fontWeight="600">
                    Trip to {item?.destination}{" "}
                    <span
                      style={{ fontSize: "24px", textTransform: "capitalize" }}
                    >
                      ({item?.adventure})
                    </span>
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    paddingRight={{ md: 25 }}
                  >
                    Expires {dayjs(item?.lobbyExpireAt).fromNow()}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  mb={2}
                  key={item._id}
                >
                  {item?.userDetail?.map((user) => {
                    return (
                      <Box
                        key={user._id}
                        height={{ md: 160, xs: 100 }}
                        width={{ md: 160, xs: 100 }}
                        display="flex"
                        alignItems="center"
                        p={2}
                        sx={{ border: "1px solid #ddd" }}
                      >
                        {user.image && (
                          <img
                            width={100}
                            style={{ width: "100%", borderRadius: "50%" }}
                            src={user.image}
                            alt=""
                          />
                        )}

                        {!user.image && (
                          <Avatar
                            {...stringAvatar(
                              `${user.firstName} ${user.lastName}`
                            )}
                          />
                        )}
                      </Box>
                    );
                  })}
                  {Array(item.remainingSpot)
                    .fill()
                    .map((item, index) => {
                      return (
                        <Box
                          key={index}
                          height={160}
                          width={160}
                          display="flex"
                          alignItems="center"
                          p={2}
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <img
                            style={{ width: "100%" }}
                            src={userProfileBackup}
                            alt=""
                          />
                        </Box>
                      );
                    })}
                  <LobbyDetail {...item} />

                  {!joinedStatus[item._id] && (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        mutate(item._id);
                        toggleJoinStatus(item._id); // Toggle join status for this item
                      }}
                    >
                      Join
                    </Button>
                  )}

                  {joinedStatus[item._id] && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        removeUser(item._id);
                        toggleJoinStatus(item._id); // Toggle join status for this item
                      }}
                    >
                      Leave
                    </Button>
                  )}
                </Stack>
              </Box>
            </>
          );
        })}
      </Stack> */}
      <Stack>
        {recruitList?.map((item, index) => {
          return (
            <Box key={index}>
              <Stack
                direction="row"
                mt={2}
                mb={2}
                justifyContent={{ md: "space-between" }}
              >
                <Typography variant="h5" fontWeight="600">
                  Trip to {item?.destination}{" "}
                  <span
                    style={{ fontSize: "24px", textTransform: "capitalize" }}
                  >
                    ({item?.adventure})
                  </span>
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  paddingRight={{ md: 25 }}
                >
                  Expires {dayjs(item?.lobbyExpireAt).fromNow()}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                mb={2}
                key={item._id}
              >
                {/* Add the user who created the lobby at the beginning of the userDetail array */}
                {item?.userDetail?.length > 0 && (
                  <Box
                    key={item?.userDetail[0]._id}
                    height={{ md: 160, xs: 100 }}
                    width={{ md: 160, xs: 100 }}
                    display="flex"
                    alignItems="center"
                    p={2}
                    sx={{ border: "1px solid #ddd" }}
                  >
                    {item.userDetail[0].image && (
                      <img
                        width={100}
                        style={{ width: "100%", borderRadius: "50%" }}
                        src={item.userDetail[0].image}
                        alt=""
                      />
                    )}
                    {!item.userDetail[0].image && (
                      <Avatar
                        {...stringAvatar(
                          `${item.userDetail[0].firstName} ${item.userDetail[0].lastName}`
                        )}
                      />
                    )}
                  </Box>
                )}

                {/* Render other users */}
                {item?.userDetail?.slice(1).map((user) => {
                  return (
                    <Box
                      key={user._id}
                      height={{ md: 160, sm: 140 }}
                      width={{ md: 160, sm: 140 }}
                      display="flex"
                      alignItems="center"
                      p={2}
                      sx={{ border: "1px solid #ddd" }}
                    >
                      {user.image && (
                        <img
                          style={{
                            width: "100%",
                            borderRadius: "50%",
                          }}
                          src={user.image}
                          alt=""
                        />
                      )}

                      {!user.image && (
                        <Avatar
                          {...stringAvatar(
                            `${user.firstName} ${user.lastName}`
                          )}
                        />
                      )}
                    </Box>
                  );
                })}

                {/* Render remaining spot */}
                {Array(item.remainingSpot)
                  .fill()
                  .map((_, index) => {
                    return (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        p={2}
                        sx={{
                          border: "1px solid #ddd",
                          height: { md: "160px", sm: "100px" },
                          width: { md: "160px", sm: "100px" },
                        }}
                      >
                        <img
                          style={{ width: "100%", cursor: "pointer" }}
                          src={userProfileBackup}
                          alt=""
                          onClick={() => {
                            mutate(item._id);
                            toggleJoinStatus(item._id);
                          }}
                        />
                      </Box>
                    );
                  })}

                <LobbyDetail {...item} />

                {!joinedStatus[item._id] && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      mutate(item._id);
                      toggleJoinStatus(item._id); // Toggle join status for this item
                    }}
                  >
                    Join
                  </Button>
                )}

                {joinedStatus[item._id] && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      removeUser(item._id);
                      toggleJoinStatus(item._id); // Toggle join status for this item
                    }}
                  >
                    Leave
                  </Button>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </>
  );
};

export default LobbyBody;
