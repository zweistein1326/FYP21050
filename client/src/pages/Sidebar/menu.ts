import { DrawerItem } from './Drawer';
import { ROUTES } from './routes';
import DashboardIcon from '@material-ui/icons/Dashboard';
import UploadIcon from '@material-ui/icons/CloudUpload';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

// import UploadIcon from '@mui/icons-material/Upload';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

export const DRAWER_LIST: DrawerItem[] = [
  {
    route: ROUTES.home,
    literal: 'Home',
    Icon: DashboardIcon,
  },
  {
    route: ROUTES.upload,
    literal: 'Upload and Transfer',
    Icon: UploadIcon,
  },
  {
    route: ROUTES.revoke,
    literal: 'Revoke',
    Icon: CancelPresentationIcon,
  },
];