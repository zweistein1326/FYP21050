import {useState} from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import Button from '@mui/material/Button';

interface Props {
    title: string,
    data: string,
    error: (arg: any) => void
}

export const DialogBox =({title, data, error}: Props)=>{
    const [open, setOpen] = useState<any>(true)
    const handleClickClose =()=>{
        setOpen(false)
        error(open)
    }

    return(
        <Dialog
        open={open}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {data}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    )
    
}