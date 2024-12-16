  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  import { SidebarProvider } from './components/SideBarContext';

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <SidebarProvider>
      <App />
    </SidebarProvider>
      
  );

