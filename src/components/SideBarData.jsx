import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faFlaskVial } from '@fortawesome/free-solid-svg-icons';
import { faBriefcaseMedical } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const SideBarData = [
    {
        title: 'Home',
        icon: <FontAwesomeIcon icon={faHouse} />,
        link: '/home'
    },
    {
        title: 'Orders',
        icon: <FontAwesomeIcon icon={faDollarSign} />,
        link: '/orders'
    },
    {
        title: 'Medicines',
        icon: <FontAwesomeIcon icon={faBriefcaseMedical} />,
        link: '/medicines'
    },
    {
        title: 'Notifications',
        icon: <FontAwesomeIcon icon={faBell} />,
        link: '/notifications'
    },
    {
        title: 'Logout',
        icon: <FontAwesomeIcon icon={faRightFromBracket} />,
        link: '/logout'
    }
];