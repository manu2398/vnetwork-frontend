//types
export const SOCKET = "SOCKET";

//reducer

export const socketReducer = (state = [], action) => {
  switch (action.type) {
    case SOCKET:
      return action.payload;
    default:
      return state;
  }
};
