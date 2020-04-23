import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../core/hooks/use-stores';
import {
  Container,
  Paper,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Hero } from './components/Hero';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(3),
    },
    button: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

export const Home: React.FC = observer(() => {
  const { testStore, themeStore, authStore } = useStores();
  const history = useHistory();
  const classes = useStyles();
  const [message, setMessage] = useState();

  return (
    <>
      <Container maxWidth="lg" className={classes.root}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h3" gutterBottom>
            Welcome to R-Divide
          </Typography>
          <Typography variant="h5" gutterBottom>
            Fully integrated money sharing platform !
          </Typography>
          <Typography variant="h6" gutterBottom>
            Feel free to add to home screen
          </Typography>
          <Typography variant="h4" gutterBottom>
            What you can do ?
          </Typography>
          <Typography variant="h5" gutterBottom>
            Generate promptpay QRCode
          </Typography>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => history.push('/simple')}
            color="primary"
          >
            Simple Pay
          </Button>
          <Typography variant="h5" gutterBottom>
            Calculate Tax
          </Typography>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => history.push('/tax-calc')}
            color="primary"
          >
            Calculate Tax
          </Button>
          <Typography variant="h5" gutterBottom>
            Share complex payments
          </Typography>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => history.push('/share')}
            color="primary"
          >
            Share Payments
          </Button>
          <Typography variant="h5" gutterBottom>
            Dark Mode also supported !
          </Typography>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => themeStore.setDarkMode(!themeStore.dark)}
            color="primary"
          >
            Toggle dark mode
          </Button>
        </Paper>
      </Container>
    </>
  );
});
