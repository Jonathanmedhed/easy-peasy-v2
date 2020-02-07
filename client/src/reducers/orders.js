import {
  GET_FAVS
} from '../actions/types';

const initialState = {
  favourites: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_FAVS:
      return {
        ...state,
        loading: false,
        favourites: payload
      };
    default:
      return state;
  }
}
