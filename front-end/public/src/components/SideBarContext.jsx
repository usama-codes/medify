import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSideBarOpen((prev) => !prev);
    console.log(isSideBarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSideBarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
