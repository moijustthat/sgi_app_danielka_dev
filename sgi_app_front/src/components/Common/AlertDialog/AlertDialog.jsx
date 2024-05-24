import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

const AlertDialog = ({
  open=false,
  contentText,
  cancelText='Cancelar',
  acceptText = 'Aceptar',
  cancelAction=()=>null,
  acceptAction=()=>null
}) => {

  return <Dialog
    open={open}
    onClose={cancelAction}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
  <DialogTitle id="alert-dialog-title">
    {"Cerrar Sesion?"}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      {contentText}
   </DialogContentText>
  </DialogContent>
  <DialogActions>
   <Button onClick={cancelAction}>{cancelText}</Button>
   <Button onClick={acceptAction} autoFocus>
       {acceptText}
  </Button>
  </DialogActions>
</Dialog>
}

export default AlertDialog
