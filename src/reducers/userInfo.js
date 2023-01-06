const initialState = null;

const usersInformation = (state = initialState, action) => {
    switch (action.type) {
        case "getUsersInfo":
            return action.data;
        default:
            return state;
    }
}

export default usersInformation;