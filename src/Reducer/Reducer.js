export const initialState = {
    isAuthenticated: false, // Default state structure
    userInfo: null,  // Track user data here
     };
  
  export const reducer = (state, action) => {
    switch (action.type) {
      case "USER":
        return {
          ...state,
          isAuthenticated: action.payload.isAuthenticated,
          userInfo: action.payload.userInfo || null,  // Update userInfo with fetched data
        
        };
     
      default:
        return state;
    }
  };
  
  