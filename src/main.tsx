import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style/index.css'
import { BrowserRouter } from 'react-router-dom'
import QueryProvider from './lib/react-query/QueryProvider.tsx'
import ContextProvider from './contexts/MainContext.tsx'
import { AuthProvider } from './contexts/AuthContext/AuthContext.tsx'
import { Provider } from 'react-redux';
import { store } from './redux/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryProvider>
      <ContextProvider>
        <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
        </AuthProvider>
      </ContextProvider>
    </QueryProvider>
  </Provider>
)
