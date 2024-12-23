import React, { useContext } from 'react';
import { SidebarContext } from './SideBarContext.jsx';
import '../App.css'
import {SideBarData} from './SideBarData.jsx'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/med.svg'

function SideBar() {

  const { isSideBarOpen, toggleSidebar } = useContext(SidebarContext);

    return (
    <div className='sideBarExtra'>
      <div className='hamburger' onClick={toggleSidebar}>
        <FontAwesomeIcon 
          icon={isSideBarOpen ? faTimes : faBars} 
          size='2x' 
          className={isSideBarOpen ? 'icon-white' : 'icon-black'} 
        />
      </div>

      <div className={`SideBar ${isSideBarOpen ? 'open' : 'closed'}`}>
        <div className='logo'>
          <img src={logo} alt="logo" />
        </div>
        <ul className='SideBarList'>
          {SideBarData.map((val, key) => {
            return (
              <li key={key}
                className='row'
                id={window.location.pathname === val.link ? 'active' : ''}
                onClick={() => {
                  window.location.pathname = val.link;
                }}>
                <div id='icon'>{val.icon}</div>
                <div id='title'>{val.title}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
