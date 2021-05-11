import { createStore } from 'redux';

const initialUserState = {
	currentState:[ ],
	currentStateId: 0,
	previousStates: [],
}


function reducer(state = initialUserState, action) {
    switch(action.type) {
        case "ADD_NEW_STATE":
        	
        	let previousStates = [...state.currentState, ...state.previousStates]

        	if ( previousStates.length > 9) { previousStates.pop() }

		    return { 
		        ...state,
		        currentState: [...action.value],
		        previousStates: [...previousStates]
		    }

		case 'DELETE_STATE':
			return {
				...state,
		        currentState: [],
		        previousStates: []
			}

		case 'MOVE_STATE':

			if (action.value == 'back') {

				console.log(state.previousStates)
				return {
					...state,
				    currentState: state.previousStates,
				    previousStates: [...state.previousStates],
				    currentStateId: state.currentStateId + 1
				}
			} else if (action.value == 'next') {
				return {
					...state,
				    currentState: state.previousStates,
				    previousStates: [...state.previousStates],
				    currentStateId: state.currentStateId + 1
				}
			}


        default: return state;
    }
}

const store = createStore(reducer);

export default store;