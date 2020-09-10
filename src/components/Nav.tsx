import React, { useContext } from 'react';
import { Menu } from 'antd';
import { Link, useLocation, matchPath } from 'react-router-dom'
import { routers, navs, RouterValue } from '../routers';
import './nav.scss';

const { SubMenu } = Menu;

export default function Nav() {
    const location = useLocation();
    const matchRouters = routers.filter(router => matchPath(location.pathname, { path: router.path }) && router.path !== '/')

    const getMenu = (navs: any[]) => (
        navs.map((nav) => {
            let router: RouterValue | undefined = routers.find(router => router.name === nav.name)
            if (!nav.children) {
                if (router) {
                    return <Menu.Item key={router.path}>{<Link to={router.path}>{router.title}</Link>}</Menu.Item>
                }
            } else {
                const navChildren = getMenu(nav.children);
                const hasNavChildren = navChildren.some(value => value !== null)
                if (hasNavChildren) {
                    return <SubMenu key={nav.title} title={nav.title}>
                        {navChildren}
                    </SubMenu>
                }
            }
        })
    )

    return (
        <Menu
            mode="inline"
            selectedKeys={[matchRouters[0]?.path]}
            inlineCollapsed={false}
        >
            {getMenu(navs)}
        </Menu>
    )
} 