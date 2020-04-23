import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from '../views/Home';
import { Login } from '../views/Login';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { BottomNav } from './components/BottomNavigation';
import { Search } from '../views/Search';
import { Navigation } from './components/Navigation';
import { Simple } from '../views/Simple';
import { TaxCalculator } from '../views/TaxCalculator';
import { Share } from '../views/Share';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flexGrow: 1,
      height: '100%',
      marginBottom: '64px',
    },
  })
);

export const AppRouter: React.FC = () => {
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.root}>
        <Navigation />
        <div className={classes.content}>
          <Switch>
            <Route path="/simple">
              <Simple />
            </Route>
            <Route path="/tax-calc">
              <TaxCalculator />
            </Route>
            <Route path="/share">
              <Share />
            </Route>
            <Route path="/search">
              <Search />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route>
              <Home />
            </Route>
          </Switch>
        </div>
        <BottomNav />
        {/* <Footer /> */}
      </div>
    </Router>
  );
};
