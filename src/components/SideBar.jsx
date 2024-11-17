import React from 'react'
import '../App.css'
import {SideBarData} from './SideBarData.jsx'

function SideBar() {
  return (
    <div className='SideBar'>
      <div className='logo'>
        <img src="/assets/med.svg" alt="logo" />
      </div>
      <ul className='SideBarList'>
      {SideBarData.map((val, key) => {
        return (
          <li key={key}
            className='row'
            id={window.location.pathname === val.link ? 'active' : ''}
            onClick={() => {
            window.location.pathname = val.link;
            }
          }>
            <div id='icon'>{val.icon}</div>
            <div id='title'>{val.title}</div>
          </li>
          );
        })}
      </ul>
    </div>
  )
}

export default SideBar;
