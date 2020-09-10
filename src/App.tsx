import React, { useState } from 'react';
import { Router, Route, Switch, matchPath, Link } from 'react-router-dom';
import { createHashHistory } from 'history';
import { observer } from 'mobx-react-lite';
import Header from './components/Header';
import Nav from './components/Nav';
import { routers, RouterValue } from './routers';
import { Layout, Breadcrumb} from 'antd';

const { Content, Sider } = Layout;
const history = createHashHistory();

function App() {
  const [pathname, setPathname] = useState(window.location.hash.split('#')[1]);


  const createBreadcrumb = () => {
    const _routers = routers.filter(router => matchPath(pathname, { path: router.path }) && router.path !== '/')
    return <Breadcrumb style={{ padding: '16px 24px', borderBottom: '1px solid #e1e1e1', fontSize: '20px' }}>
      {_routers.map((router, index) => <Breadcrumb.Item>{index === _routers.length - 1 ? router.title : <Link to={router.path}>{router.title}</Link>}</Breadcrumb.Item>)}
    </Breadcrumb>
  }

  return (
      <Router history={history}>
        <Switch>
            <Layout>
              <Header />
              <Layout style={{ margin: '50px auto' }}>
                <Sider width={180} theme="light" style={{ height: 'fit-content', border: '1px solid #e1e1e1' }} >
                  <Nav />
                </Sider>
                <Layout style={{ width: '1150px', margin: '0 24px 24px', background: '#ffffff', border: '1px solid #e1e1e1' }}>
                  {createBreadcrumb()}
                  <Content
                    style={{
                      padding: 24,
                      margin: 0,
                      minHeight: 600,
                      background: '#ffffff'
                    }}
                  >
                    {routers.map((router: RouterValue) => <Route exact path={router.path} component={router.component} key={router.path} />)}
                  </Content>
                </Layout>
              </Layout>
            </Layout>
        </Switch>
      </Router>
  );
}

export default observer(App);
