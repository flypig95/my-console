import { ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PageA from './my-console-pageA';
import PageB from './my-console-pageB'

export interface NavRouterValue {
    name: string,
    path: string,
    component?: ReactNode,
    children?: []
}

export interface RouterValue {
    title: string,
    path: string,
    name: string,
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
    permission: string
}

export const routers = [
    {
        title: 'pageA',
        path: '/my-console-pageA',
        name: 'pageA',
        component: PageA,
        permission: ''
    },
    {
        title: 'PageB',
        path: '/my-console-pageB',
        name: 'pageB',
        component: PageB,
        permission: ''
    }
]

export const navs = [
    {
        name: 'pageA'
    },
    {
        name: 'pageB'
    }
]
