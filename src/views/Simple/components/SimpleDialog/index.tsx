import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { purple } from '@material-ui/core/colors';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: purple[100],
    color: purple[600],
  },
});

export interface SimpleDialogProps {
  open: boolean;
  choices: string[];
  defaultValue: string;
  onClose: (value: string) => void;
}

export function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, defaultValue, open, choices } = props;

  const handleClose = () => {
    onClose(defaultValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Choose Mobile No.</DialogTitle>
      <List>
        {choices.map(choice => (
          <ListItem
            button
            onClick={() => handleListItemClick(choice)}
            key={choice}
          >
            <ListItemText primary={choice} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
