//actionTypes
export const STATUS = "STATUS";

// reducer

export const statusReducer = (state = false, action) => {
  switch (action.type) {
    case STATUS:
      return action.payload;
    default:
      return state;
  }
};
