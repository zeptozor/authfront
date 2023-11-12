import { wrapper } from '@/store'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

export default function App({ Component, ...rest }: AppProps) {
    const { store, props } = wrapper.useWrappedStore(rest)
    return (
        <Provider store={store}>
            <Component {...props} />
        </Provider>
    )
}
