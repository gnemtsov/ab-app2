import React, { Component } from 'react';

import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import ErrorBoundary from '../errorBoundary/errorBoundary';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false });
    }

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    }

    render() {
        return (
            <React.Fragment>
                <Toolbar
                    isAuth={this.props.isAuth}
                    drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    isAuth={this.props.isAuth}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler} />
                <ErrorBoundary>
                    <main className={classes.Content}>
                        {this.props.children}
                    </main>
                </ErrorBoundary>
            </React.Fragment>
        )
    }
}

export default Layout;