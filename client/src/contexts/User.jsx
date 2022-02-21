import React from 'react';

const initialState = {
  verified: localStorage.getItem('user.verified'),
  username: localStorage.getItem('user.username'),
};

const setLocalStorage = (state) => {
  localStorage.setItem('user.verified', state.verified);
  localStorage.setItem('user.username', state.username);
};

export const UserContext = React.createContext({
  state: initialState,
  dispatch: () => null,
});

export const UserProvider = ({children}) => {
  const reducer = (state, action) => {
    let newState;
    switch (action.type) {
      case 'login':
        newState = {
          ...state,
          verified: true,
          username: action.username,
        };
        break;
      case 'logout':
        newState = {
          ...state,
          verified: false,
          username: null,
        };
        break;
      default:
        newState = state;
    }
    setLocalStorage(newState);
    return newState;
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
    	{ children }
    </UserContext.Provider>
  );
};
