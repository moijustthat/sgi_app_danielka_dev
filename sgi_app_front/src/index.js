import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { ContextProvider } from './Contexts/ContextProvider';
import NotificationProvider from './components/Notifications/NotificationProvider';

import router from './router';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
    <React.StrictMode>
        <ContextProvider>
            <NotificationProvider>
                <RouterProvider router={router} />
            </NotificationProvider>
        </ContextProvider>
    </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
