import React from 'react'
import '../resources/layout.css'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function DefaultLayout({ children }) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = React.useState(false); // id collapsed is true then only show icons
    const { user } = useSelector(state => state.users);

    const userMenu = [
        {
            name: 'Home',
            icon: 'ri-home-8-line',
            path: '/'
        },
        {
            name: 'Bookings',
            icon: 'ri-file-list-line',
            path: '/bookings'
        },
        //{
           // name: 'Profile',
           // icon: 'ri-user-3-fill',
           // path: '/profile'
       // },
        {
            name: 'Logout',
            icon: 'ri-logout-box-r-line',
            path: '/logout'
        }
    ];
    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-8-line',
        },
        {
            name: 'Buses',
            path: '/admin/buses',
            icon: 'ri-bus-fill',
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: 'ri-user-3-fill',
        },
        {
            name: 'Bookings',
            path: '/admin/bookings',
            icon: 'ri-file-list-line',
        },
        {
            name: 'Logout',
            path: '/logout',
            icon: 'ri-logout-box-r-line',
        },

    ];
    const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;
    let activeRoute = window.location.pathname;
    if(window.location.pathname.includes('book-now')){
        activeRoute = "/";  // highlights home
    }
    return (
        <div className='layout-parent'>
            <div className="sidebar">
                <div className='sidebar-header'>
                    <h1 className='logo'>CB</h1>
                    <h1 className='role'>{user?.name}<br />Role: {user?.isAdmin ? 'Admin' : 'User'}</h1>
                </div>
                <div className='d-flex flex-column gap-3 justify-content-start menu'>
                    {menuToBeRendered.map((item, index) => {
                        return (
                            <div className={`${activeRoute === item.path && 'active-menu-item'} menu-item`}>
                                <i className={item.icon}></i>
                                {!collapsed && (
                                    <span
                                        onClick={() => {
                                            if (item.path === "/logout") {
                                                localStorage.removeItem("token");
                                                navigate("/login");
                                            } else {
                                                navigate(item.path);
                                            }
                                        }
                                        }>
                                        {item.name}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="body">
                <div className="header">
                    {collapsed ? (
                        <i class="ri-menu-2-line"
                            onClick={() => setCollapsed(!collapsed)}>

                        </i>) : (
                        <i class="ri-close-circle-line"
                            onClick={() => setCollapsed(!collapsed)}>
                        </i>
                    )}
                </div>
                <div className="content">{children}</div>
            </div>


        </div>
    );
}

export default DefaultLayout
