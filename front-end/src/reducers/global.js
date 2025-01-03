import { TOGGLE_LOADING,IS_SUBMITED,IS_ERROR } from "../constants/actions"

const defaultState = {
    loading:false,
    issubmited:false,
    iserror:''
}

export default (state = defaultState, action) => {
    const { type, payload = {} } = action

    switch (type) {
        case TOGGLE_LOADING:
            return {...state, loading:payload}
        case IS_SUBMITED:
            return {...state, issubmited:payload} 
        case IS_ERROR:
            return {...state, iserror:payload}      
        default:
            return state
    }
}
