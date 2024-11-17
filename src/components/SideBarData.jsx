import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
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
        title: 'Transactions',
        icon: <FontAwesomeIcon icon={faDollarSign} />,
        link: '/transactions'
    },
    {
        title: 'Dashboard',
        icon: <FontAwesomeIcon icon={faFlaskVial} />,
        link: '/dashboard'
    },
    {
        title: 'Drugs',
        icon: <FontAwesomeIcon icon={faBriefcaseMedical} />,
        link: '/drugs'
    },
    {
        title: 'Activity',
        icon: <FontAwesomeIcon icon={faArrowTrendUp} />,
        link: '/activity'
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