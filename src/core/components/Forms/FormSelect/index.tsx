import React, { ChangeEvent, ReactNode } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  TextFieldProps,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      width: '100%',
    },
    select: {
      width: '100%',
    },
  })
);

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  name,
  label,
  type = 'text',
  placeholder = label,
  errorText,
  choices = [],
  error = !!errorText,
  onChange,
  autoComplete = name,
  helperText,
  value,
  variant,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormControl
        variant="filled"
        className={classes.select}
        error={!!errorText}
      >
        <InputLabel id={id + '-label'}>{name}</InputLabel>
        <Select
          labelId={id + '-label'}
          id={id}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
        >
          {choices.map((choice, idx) => (
            <MenuItem value={choice.value} key={id + '-' + idx}>
              {choice.label}
            </MenuItem>
          ))}
        </Select>
        {errorText && <FormHelperText>Error</FormHelperText>}
      </FormControl>
    </div>
  );
};

export type FormSelectProps = TextFieldProps & {
  id?: string;
  name?: string;
  type?: string;
  helperText?: string | ReactNode;
  label?: string | ReactNode;
  choices?: { label: string; value: string }[];
  placeholder?: string;
  autoComplete?: string;
  error?: boolean;
  errorText?: string;
  onChange?: (
    e: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => void;
  value?: string | number | unknown;
};
