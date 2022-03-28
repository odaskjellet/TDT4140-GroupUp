import React from 'react';

const initialState = {
  verified: sessionStorage.getItem('user.verified'),
  username: sessionStorage.getItem('user.username'),
};

const setLocalStorage = (state) => {
  sessionStorage.setItem('user.verified', state.verified);
  sessionStorage.setItem('user.username', state.username);
};

export const UserContext = React.createContext({
  state: initialState,
  dispatch: () => null,
});

// eslint-disable-next-line react/prop-types
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
      {children}
    </UserContext.Provider>
  );
};
