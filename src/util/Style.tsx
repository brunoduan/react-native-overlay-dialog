import { Dimensions} from 'react-native';

interface actionAlign {
  [key: string]: string;
}

export const DialogActionAlign: actionAlign = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
};

export const ScreenWidth = Dimensions.get('window').width;
export const ScreenHeight = Dimensions.get('window').height;
