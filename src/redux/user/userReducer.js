import {
  LOG_IN_USER,
  UPDATE_AUTH_USER,
  UPDATE_USER_FROM_DB,
} from "./userTypes";

const initialState = {
  authUser: null,
  userFromDb: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_USER: {
      return {
        ...state,
        authUser: action.payload.authUser,
        userFromDb: action.payload.userFromDb,
      };
    }

    case UPDATE_AUTH_USER: {
      return {
        ...state,
        authUser: action.payload.authUser,
      };
    }

    case UPDATE_USER_FROM_DB: {
      console.log("Updating the user from DB");
      console.log(action.payload.userFromDb);
      return {
        ...state,
        userFromDb: action.payload.userFromDb,
      };
    }

    default: {
      return state;
    }
  }
};

export default userReducer;
