import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import groupReducer from "./group"
import eventReducer from './event'
const rootReducer = combineReducers({
    session: sessionReducer,
    groups: groupReducer,
    events: eventReducer
});

let enhancer;

// in production, only apply thunk
if (process.env.NODE_ENV === 'production')
{
    enhancer = applyMiddleware(thunk);
} else
{
    const logger = require('redux-logger').default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// create the store
const configureStore = (preloadedState) =>
{
    return createStore(rootReducer, preloadedState, enhancer);
};

// export the store
export default configureStore;
