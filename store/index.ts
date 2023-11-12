import { Action, AnyAction, combineReducers, configureStore, ThunkAction, ThunkMiddleware } from '@reduxjs/toolkit'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { authReducer } from './reducers/auth'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { Persistor } from 'redux-persist'

const combinedReducer = combineReducers({
    auth: authReducer
})

const reducer: typeof combinedReducer = (state, action: AnyAction) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state,
            ...action.payload,
        }
        return nextState
    } else {
        return combinedReducer(state, action)
    }
}

export const makeStore = () => {
    const isServer = typeof window == 'undefined'
    if (isServer) {
        return configureStore({ reducer })
    } else {
        const { persistStore, persistReducer } = require('redux-persist/es')
        const storage = require('redux-persist/lib/storage').default
        const { FLUSH, REHYDRATE,  PAUSE,  PERSIST, PURGE, REGISTER } = require('redux-persist')
        const persistConfig = {
            key: 'nextjs',
            whitelist: ['auth'],
            storage,
        }
        const persistedReducer = persistReducer(persistConfig, reducer)
        interface Store extends ToolkitStore<any, AnyAction, [ThunkMiddleware<any, AnyAction>]> {
            __persistor?: Persistor
        }
        const store: Store = configureStore({
            reducer: persistedReducer,
            middleware: (getDefaultMiddleware) => getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE,  PAUSE,  PERSIST, PURGE, REGISTER]
                }
            }),
        })
        store.__persistor = persistStore(store)
        return store
    }
}

type AppStore = ReturnType<typeof makeStore>

export type AppDispatch = AppStore['dispatch']
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export const wrapper = createWrapper(makeStore)
