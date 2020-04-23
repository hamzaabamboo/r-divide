import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import * as generatePayload from 'promptpay-qr';
import * as qrcode from 'qrcode';
import { useLocation } from 'react-router-dom';
import { blobToFile, dataURItoBlob } from '../../core/utils';
import { useFormik } from 'formik';
import { SimpleDialog } from './components/SimpleDialog';
// import { useStores } from '../../core/hooks/use-stores';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
  Button,
} from '@material-ui/core';
import { FormText } from '../../core/components/Forms/FormText';
import { useLocalStorage } from '../../core/hooks/use-localStorage';

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
      marginRight: theme.spacing(1),
    },
  })
);

interface SimplePayModel {
  mobile: string;
  amount: number;
}

const simplePaySchema = Yup.object<SimplePayModel>({
  mobile: Yup.string()
    .required('Please enter mobile number')
    .matches(/^[0-9]{10}$/, 'Phone number should be 10 numbers'),
  amount: Yup.number().min(0),
});

export const Simple: React.FC = observer(() => {
  const classes = useStyles();
  const [mobile, setMobile] = useLocalStorage('mobile', '');
  const [image, setImage] = useState<string>();
  const query = useQuery();
  //   const { testStore, authStore } = useStores();
  const contactPickerSupported =
    'contacts' in navigator && 'ContactsManager' in window;
  const webShareSupported = 'share' in navigator;

  const [dialog, setDialog] = useState<boolean>(false);
  const [dialogChoices, setDialogChoices] = useState<string[]>([]);

  const formatMobile = (no: string) => {
    let tmp = no;
    tmp = tmp.replace(/\+66/g, '0');
    tmp = tmp.replace(/\s+/g, '');
    return tmp;
  };

  const pickContact = async () => {
    try {
      const contact = await (navigator as any).contacts.select(['tel'], {
        multiple: false,
      });
      console.log(contact);
      if (contact.length > 0) {
        if (contact[0].tel.length > 1) {
          setDialogChoices(contact[0].tel.map(formatMobile));
          setDialog(true);
        } else if (contact[0].tel.length === 1) {
          form.setFieldValue('mobile', formatMobile(contact[0].tel[0]));
        }
      }
    } catch (err) {}
  };

  const share = (data: any) => {
    const n = navigator as any;
    if (n.share) {
      n.share({
        files: [blobToFile(dataURItoBlob(data), 'payment.png')],
        title: 'Payment Request',
        text: `Please pay ${form.values.amount} PromptPay to ${form.values.mobile}`,
      });
    }
    console.log(
      blobToFile(dataURItoBlob(data), 'payment.png'),
      new File([], 'ha')
    );
  };

  const form = useFormik<SimplePayModel>({
    validationSchema: simplePaySchema,
    initialValues: {
      mobile: mobile !== null ? mobile : '',
      amount: parseInt(query.get('amount') || '100') || 100,
    },
    onSubmit: async values => {
      try {
      } catch (error) {}
    },
  });

  useEffect(() => {
    if (form.isValid) {
      const { mobile, amount } = form.values;
      const payload = generatePayload(mobile, { amount: amount || 0 }); //First parameter : mobileNumber || IDCardNumber
      // Convert to SVG QR Code
      const options = { type: 'svg', color: { dark: '#000', light: '#fff' } };
      qrcode.toDataURL(payload).then(img => setImage(img));
      setMobile(mobile);
    }
  }, [form, setMobile]);

  return (
    <>
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h3" gutterBottom className={classes.text}>
          Simple Payment (ทวงเงินแบบง่ายๆ)
        </Typography>
        <Typography variant="h5" gutterBottom className={classes.text}>
          Leave amount to 0 for entering custom value in bank app. <br /> Trick
          : Use share to share to preferred banking app to enter payment right
          away !
        </Typography>
        <FormText
          id="mobile"
          label="Prompt Pay Mobile Number"
          name="mobile"
          errorText={form.touched && form.errors['mobile']}
          onChange={form.handleChange}
          value={form.values.mobile}
        ></FormText>
        <FormText
          id="amount"
          label="Payment Amount"
          name="amount"
          type="number"
          errorText={form.touched && form.errors['amount']}
          onChange={form.handleChange}
          value={form.values.amount}
        />
        {image && <img src={image} />}
        <br />
        <Button
          color="primary"
          variant="contained"
          onClick={() => share(image)}
          disabled={!webShareSupported}
          className={classes.button}
        >
          Share
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => pickContact()}
          disabled={!contactPickerSupported}
          className={classes.button}
        >
          Choose Contact
        </Button>
      </Container>
      <SimpleDialog
        open={dialog}
        defaultValue={form.values.mobile}
        choices={dialogChoices}
        onClose={tel => {
          form.setFieldValue('mobile', tel);
          setDialog(false);
        }}
      />
    </>
  );
});
