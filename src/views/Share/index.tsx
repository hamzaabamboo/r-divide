import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../core/hooks/use-localStorage';
// import { useStores } from '../../core/hooks/use-stores';
import { useHistory } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
  Box,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormText } from '../../core/components/Forms/FormText';
import { FormSelect } from '../../core/components/Forms/FormSelect';
import { useFormik } from 'formik';
import ClearIcon from '@material-ui/icons/Clear';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
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
    button: {
      marginBottom: theme.spacing(1),
    },
    box: {
      marginBottom: theme.spacing(1),
    },
  })
);

interface Person {
  id: number;
  name: string;
  pay?: number;
}

interface IndividualPayItem {
  name: string;
  amount: number;
  payers: Person[];
}

interface SharePayModel {
  total: number;
  charge: number;
  individual: IndividualPayItem[];
}

const sharePayModel = Yup.object<SharePayModel>({
  total: Yup.number().required('Please enter number'),
  charge: Yup.number()
    .min(0)
    .required('Please enter tax'),
  individual: Yup.array(
    Yup.object<IndividualPayItem>({
      name: Yup.string().required('Please enter string'),
      amount: Yup.number()
        .min(0)
        .required('Please enter number'),
      payers: Yup.array(
        Yup.object<Person>({
          id: Yup.number(),
          name: Yup.string(),
        })
      ),
    })
  ),
});

export const Share: React.FC = observer(() => {
  const classes = useStyles();
  const history = useHistory();
  //   const { testStore, authStore } = useStores();
  const [newPerson, setNewPerson] = useState<string>('');
  const [expanded, setExpanded] = useState<any>();
  const [share, setShare] = useLocalStorage<SharePayModel>('share', {
    total: 100,
    charge: 10,
    individual: [],
  });
  const [charge, setCharge] = useLocalStorage<number>('charge', 0);
  const [peopleStorage, setPeopleStorage] = useLocalStorage<Person[]>(
    'people',
    []
  );
  const [people, setPeople] = useState<Person[]>(peopleStorage || []);
  const [id, setId] = useState<number>(
    people.reduce((p, c) => (c.id > p ? c.id : p), 0) + 1
  );

  const handleChange = (panel: number) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const form = useFormik<SharePayModel>({
    validationSchema: sharePayModel,
    initialValues: share || {
      total: 100,
      charge: 10,
      individual: [],
    },
    onSubmit: async values => {
      try {
      } catch (error) {}
    },
  });

  useEffect(() => {
    setShare(form.values);
  }, [form, setShare]);

  useEffect(() => {
    setPeopleStorage(people);
  }, [people, setPeopleStorage]);

  const calculatePay = (p: Person): number => {
    if (form.isValid) {
      const { total, charge, individual } = form.values;
      const shared =
        total * (1 + charge / 100) -
        individual
          .filter(i => i.payers.length > 0)
          .reduce((p, c) => p + c.amount, 0);
      const perperson = shared / people.length;
      let totalP = perperson;
      individual.forEach(item => {
        const peritem = item.amount / item.payers.length;
        if (item.payers.find(pay => pay.id === p.id)) {
          totalP = totalP + peritem * (1 + charge / 100);
        }
      });
      return totalP;
    } else {
      return 0;
    }
  };
  const addIndividualItem = () => {
    const { individual } = form.values;
    form.setFieldValue('individual', [
      ...individual,
      { name: 'Item ' + (individual.length + 1), amount: 0, payers: [] },
    ]);
  };

  const removeIndividualItem = (n: number) => {
    const { individual } = form.values;
    if (individual) {
      form.setFieldValue(
        'individual',
        individual.filter((e, i) => i !== n)
      );
    }
  };

  const removePeople = (p: Person) => {
    setPeople(people => people.filter(people => p.id !== people.id));
    const { individual } = form.values;
    if (individual) {
      form.setFieldValue(
        'individual',
        individual.map(i => ({
          ...i,
          payers: i.payers.filter(people => p.id !== people.id),
        }))
      );
    }
  };

  const addPerson = () => {
    if (newPerson) {
      setPeople(people => [...people, { id: id, name: newPerson }]);
      setId(id + 1);
      setNewPerson('');
    }
  };

  const addPayer = (n: number, pi: Person) => {
    const item = form.values.individual[n];
    if (!item.payers.find(p => p.id === pi.id)) {
      form.setFieldValue(
        'individual',
        form.values.individual.map((e, i) =>
          i === n ? { ...e, payers: [...e.payers, pi] } : e
        )
      );
    }
  };

  const removePayer = (n: number, pi: Person) => {
    const item = form.values.individual[n];
    if (item.payers.find(p => p.id === pi.id)) {
      form.setFieldValue(
        'individual',
        form.values.individual.map((e, i) =>
          i === n
            ? { ...e, payers: e.payers.filter((p, j) => p.id !== pi.id) }
            : e
        )
      );
    }
  };
  return (
    <>
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h3" gutterBottom className={classes.text}>
          Share (อ่ะหาร)
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.text}>
          Charge will be added to total and individual items. If you don't want
          to deal with any charge, just use zero
        </Typography>
        <FormText
          id="total"
          label="Total"
          name="total"
          errorText={form.touched && form.errors['total']}
          onChange={form.handleChange}
          value={form.values.total}
        ></FormText>
        <FormText
          id="charge"
          label="Charge"
          name="charge"
          type="number"
          errorText={form.touched && form.errors['charge']}
          onChange={form.handleChange}
          value={form.values.charge}
        />
        <Box>
          <form
            onSubmit={e => {
              e.preventDefault();
              addPerson();
            }}
          >
            <Typography variant="h4" gutterBottom className={classes.text}>
              Payer (คนหาร)
            </Typography>
            <FormText
              id="new-person"
              label="Name"
              name="person"
              onChange={(e: any) => setNewPerson(e.target.value)}
              value={newPerson}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={() => addPerson()}
            >
              Add Person
            </Button>
            <List aria-label="contacts">
              {people.map(p => (
                <ListItem
                  button
                  onClick={() =>
                    history.push('/simple?amount=' + calculatePay(p))
                  }
                  key={'person-' + p.id}
                  className={classes.text}
                >
                  <ListItemText primary={p.name + ' : ' + calculatePay(p)} />
                  <Button
                    onClick={e => {
                      removePeople(p);
                      e.stopPropagation();
                    }}
                  >
                    <ClearIcon />
                  </Button>
                </ListItem>
              ))}
            </List>
          </form>
        </Box>
        <Typography variant="h4" gutterBottom className={classes.text}>
          Non-Shared Items (อันนี้ไม่หาร)
        </Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={() => addIndividualItem()}
          className={classes.button}
        >
          Add Individual Item
        </Button>
        {form.values.individual &&
          form.values.individual.map((item, i) => {
            const { name, amount, payers } = item;
            return (
              <ExpansionPanel
                key={'individual-' + i}
                expanded={expanded === i}
                onChange={handleChange(i)}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id={i + '-header'}
                >
                  <Typography>
                    {name} - {amount} THB ; Payers :{' '}
                    {payers.map(p => p.name).join(', ')}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Box
                    display="flex"
                    key={'individual-' + i}
                    alignItems="flex-start"
                    flexDirection="column"
                    width="100%"
                    className={classes.box}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <FormText
                          id={'individual-name' + i}
                          label="Name"
                          name={'individual[' + i + '].name'}
                          errorText={
                            form.touched &&
                            form.errors['individual'] &&
                            form.errors.individual[i] &&
                            (form.errors.individual[i] as any).name
                          }
                          onChange={form.handleChange}
                          value={name}
                        ></FormText>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormText
                          id={'individual-amount' + i}
                          label="Amount"
                          type="number"
                          name={'individual[' + i + '].amount'}
                          errorText={
                            form.touched &&
                            form.errors['individual'] &&
                            form.errors.individual[i] &&
                            (form.errors.individual[i] as any).amount
                          }
                          onChange={form.handleChange}
                          value={amount}
                        ></FormText>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button onClick={() => removeIndividualItem(i)}>
                          Remove Item
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.text}
                        >
                          People
                        </Typography>
                        <List component="nav" aria-label="contacts">
                          {people
                            .filter(
                              e => !payers.find(payer => payer.id === e.id)
                            )
                            .map((p, pi) => (
                              <ListItem
                                button
                                key={'indiviudal-' + i + '-selection-' + pi}
                                onClick={() => addPayer(i, p)}
                              >
                                <ListItemText primary={p.name} />
                              </ListItem>
                            ))}
                        </List>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.text}
                        >
                          Payers
                        </Typography>
                        <List>
                          {payers.map((p, pi) => (
                            <ListItem
                              button
                              key={'indiviudal-' + i + '-selected-' + pi}
                            >
                              <ListItemText primary={p.name} />
                              <Button onClick={() => removePayer(i, p)}>
                                <ClearIcon />
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    </Grid>
                  </Box>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
      </Container>
    </>
  );
});
