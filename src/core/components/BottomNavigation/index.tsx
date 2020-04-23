import React from 'react';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import HomeIcon from '@material-ui/icons/Home';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import GroupIcon from '@material-ui/icons/Group';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../hooks/use-stores';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      bottom: '0',
      width: '100vw',
    },
  })
);

export const BottomNav: React.FC<BottomNavProps> = observer(() => {
  const classes = useStyles();
  const history = useHistory();
  const { authStore } = useStores();

  return (
    <BottomNavigation
      value={history.location.pathname}
      className={classes.root}
    >
      <BottomNavigationAction
        value="/"
        onClick={() => history.push('/')}
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        value="/simple"
        onClick={() => history.push('/simple')}
        icon={<MoneyIcon />}
      />
      <BottomNavigationAction
        value="/tax-calc"
        onClick={() => history.push('/tax-calc')}
        icon={<ThumbUpIcon />}
      />
      <BottomNavigationAction
        value="/share"
        onClick={() => history.push('/share')}
        icon={<GroupIcon />}
      />
      {/* {authStore.isAuthenticated ? (
        <BottomNavigationAction
          value="/profile"
          onClick={() => history.push('/profile')}
          icon={<PersonIcon />}
        />
      ) : (
        <BottomNavigationAction
          value="/login"
          onClick={() => history.push('/login')}
          icon={<LoginIcon />}
        />
      )} */}
    </BottomNavigation>
  );
});

export interface BottomNavProps {}
