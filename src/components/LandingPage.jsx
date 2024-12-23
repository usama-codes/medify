import React, { useContext } from 'react'
import SideBar from './SideBar'
import SearchBar from './SearchBar'
import ProfilePic from './ProfilePic'
import '../App.css'
import { SidebarContext } from './SideBarContext';

function LandingPage() {
  const { isSideBarOpen, toggleSidebar } = useContext(SidebarContext);

  return (
    <div>
        <SideBar />
        <SearchBar />
        <ProfilePic />
    </div>
  );
}

export default LandingPage;
