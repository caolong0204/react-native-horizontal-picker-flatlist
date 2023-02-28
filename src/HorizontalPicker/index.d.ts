import { ViewProps } from 'react-native';

export interface HorizontalPickerProps extends ViewProps {
  totalSize?: number;
  rowItems?: number;
  title?: string;
  initIndex?: number;
  onChangeSelected?: (value: number) => void;
}
declare const HorizontalPicker: any;
export default HorizontalPicker;
