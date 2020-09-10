import React, { useContext } from 'react';
import { Layout } from 'antd';
import './header.scss';

export default function Header() {
    return (
        <Layout.Header className="header-container">
            <div className="header-left"><div className="logo" /></div>
            <div className="header-right">
                您好！<span>陈聪</span><a href="javascript:;">安全退出</a>
            </div>
        </Layout.Header>
    )
}