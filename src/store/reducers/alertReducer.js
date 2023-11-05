//actionTypes
export const ALERT = "ALERT";

// reducer
const initialState = {};
export const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALERT:
      return action.payload;
    default:
      return state;
  }
};
