import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/layout/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes.tsx';
// import { configureTheStore } from './app/store/store.ts';
import { Provider } from 'react-redux';
import { store } from './app/store/store.ts';

// const store = configureTheStore();

// console.log(store.getState());//get state from redux store

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    {/* <RouterProvider router={router} future={{ v7_startTransition: true}}/> */}
    <RouterProvider router={router}/>
    </Provider>

  </StrictMode>,
)

