import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ManageForm from "./ManageForm";

const RenderDialogButton = ({params, credentials}) => {
  const [open, setOpen] = React.useState(false);
  const [cred, setCred] = React.useState({});
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
    
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="small"
        style={{ marginLeft: 16 }}
        onClick={() => {
            handleClickOpen();
            for (let c in credentials) {
              if (credentials[c].id === params.row.id) {
                let cd = {}
                cd["ownerId"] = Number(credentials[c].owner.split(":")[1]);
                cd["ownerName"] = credentials[c].owner.split(":")[0];
                cd["filename"] = credentials[c].doc;
                cd["date"] = credentials[c].date;
                cd["link"] = credentials[c].link;
                cd["assetHash"] = credentials[c].assetHash;
                cd["valid"] = credentials[c].valid === "true";
                cd["transfer"] = credentials[c].transfer === "Allowed";
                cd["revoke"] = credentials[c].revoke === "Allowed";
                cd["share"] = credentials[c].share === "Allowed";
                setCred(cd);
              }
            }
            console.log("CREDS ARE", cred)
        }}
    >
        Manage
    </Button>
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Manage Credential</DialogTitle>
        <DialogContent>
            <ManageForm rowInfo={cred}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const ShowCreds = ({ credentials }) => {
  console.log('credentials',credentials)
  const columns = [
    { field: "dialogButton", headerName: "", width: 100, renderCell: (params) => (
      <RenderDialogButton params={params} credentials={credentials} />
    )
  },
    { field: 'id', headerName: '#', width: 5, headerAlign: 'left'},
    {
      field: 'owner',
      headerName: 'Owner',
      width: 150,
      headerAlign: 'left',
      renderCell: (params) => {
        return params.value.split(':')[0]
      }
    },
    {
      field: 'doc',
      headerName: 'Document',
      width: 200,
      headerAlign: 'left'
    },
    {
      field: 'date',
      headerName: 'UNIX Timestamp',
      width: 150,
      headerAlign: 'left'
    },
    {
      field: 'link',
      headerName: 'IPFS Link',
      width: 250,
      headerAlign: 'left'
    },
    {
      field: 'assetHash',
      headerName: 'Asset Hash',
      width: 300,
      headerAlign: 'left'
    },
    {
      field: 'valid',
      headerName: 'Status',
      width: 70,
      headerAlign: 'left'
    },
    {
      field: 'transfer',
      headerName: 'Transfer Permission',
      width: 150,
      headerAlign: 'left'
    },
    {
      field: 'revoke',
      headerName: 'Revoke Permission',
      width: 150,
      headerAlign: 'left'
    },
    {
      field: 'share',
      headerName: 'Share Permission',
      width: 150,
      headerAlign: 'left'
    },
  ];
  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={credentials}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          virtualScroller={{color: "black"}}
        />
      </div>
    </>
  )
}
export default ShowCreds;