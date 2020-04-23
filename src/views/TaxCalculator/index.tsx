import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
// import { useStores } from '../../core/hooks/use-stores';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
  Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import { RoomSearchForm } from '../../core/components/RoomSearchForm';
import { RoomSearchFormInput } from '../../core/models/search';
import moment from 'moment';
import { useLocalStorage } from '../../core/hooks/use-localStorage';
import { FormText } from '../../core/components/Forms/FormText';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
    },
    expansionPanel: {
      margin: 0,
    },
    text: {
      color: theme.palette.text.primary,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    menu: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    panel: {
      paddingBottom: theme.spacing(1),
    },
  })
);

interface TaxCalculatorModel {
  amount: number;
  charge: number;
}

const taxCalcSchema = Yup.object<TaxCalculatorModel>({
  amount: Yup.number()
    .min(0)
    .required('Please enter number'),
  charge: Yup.number()
    .min(0)
    .required('Please enter tax'),
});

export const TaxCalculator: React.FC = observer(() => {
  const classes = useStyles();
  const [charge, setCharge] = useLocalStorage<number>('charge', 10);
  const [total, setTotal] = useState<number>();
  const history = useHistory();
  //   const { testStore, authStore } = useStores();

  const form = useFormik<TaxCalculatorModel>({
    validationSchema: taxCalcSchema,
    initialValues: {
      charge: charge ? charge : 10,
      amount: 100,
    },
    onSubmit: async values => {
      try {
      } catch (error) {}
    },
  });

  useEffect(() => {
    if (form.isValid) {
      const { charge, amount } = form.values;
      setTotal(amount + (amount * charge) / 100);
      setCharge(charge);
    }
  }, [form, setTotal, setCharge]);

  return (
    <>
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h3" gutterBottom className={classes.text}>
          Tax Calculator (คิดเปอร์เซนต์)
        </Typography>
        <FormText
          id="amount"
          label="Payment Amount"
          name="amount"
          type="number"
          errorText={form.touched && form.errors['amount']}
          onChange={form.handleChange}
          value={form.values.amount}
        ></FormText>
        <FormText
          id="charge"
          label="% Charge"
          name="charge"
          type="number"
          errorText={form.touched && form.errors['charge']}
          onChange={form.handleChange}
          value={form.values.charge}
        />
        <Typography variant="h3" gutterBottom className={classes.text}>
          Total : {total} THB
        </Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={() => history.push('/simple?amount=' + total)}
        >
          Pay Simply
        </Button>
      </Container>
    </>
  );
});
