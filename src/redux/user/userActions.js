import {
  LOG_IN_USER,
  UPDATE_AUTH_USER,
  UPDATE_USER_FROM_DB,
} from "./userTypes";

export const logInUser = (authUser, userFromDb) => {
  return {
    type: LOG_IN_USER,
    payload: {
      authUser: authUser,
      userFromDb: userFromDb,
    },
  };
};

export const updateAuthUser = (authUser) => {
  return {
    type: UPDATE_AUTH_USER,
    payload: {
      authUser: authUser,
    },
  };
};

export const updateUserFromDb = (userFromDb) => {
  return {
    type: UPDATE_USER_FROM_DB,
    payload: {
      userFromDb: userFromDb,
    },
  };
};
