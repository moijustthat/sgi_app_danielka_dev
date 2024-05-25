import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
export default function FormDialog(props) {

  const {
    open,
    setOpen,
    content,
    title,
    onAccept
  } = props

  const handleClose = () => {
    setOpen(null)
  };

  return (
      <Dialog
        maxWidth='xl'
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }
      }
      >
        <DialogTitle
          sx={{
            paddingTop: 0,
            height: '2.5rem'
          }}
        >{title}</DialogTitle>
        <DialogContent> 
          {content}
        </DialogContent>
      </Dialog>
  );
}