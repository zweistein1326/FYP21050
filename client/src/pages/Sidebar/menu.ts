import { DrawerItem } from './Drawer';
import { ROUTES } from './routes';
import DashboardIcon from '@material-ui/icons/Dashboard';
import UploadIcon from '@material-ui/icons/CloudUpload';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

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