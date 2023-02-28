import _ from 'lodash';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from 'react-native';
import { isNullOrEmpty } from '../utils';

interface HorizontalPickerFlatListProps {
  totalSize?: number;
  rowItems?: number;
  title?: string;
  initIndex?: number;
  onChangeSelected?: (value: number) => void;
}
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HorizontalPicker = (props: HorizontalPickerFlatListProps) => {
  const {
    totalSize = 42,
    rowItems = 7,
    title = 'WEEK',
    initIndex = 0,
    onChangeSelected,
  } = props;
  const flatListRef = React.useRef<FlatList>(null);
  const contentOffsetRef = React.useRef(0);
  const emptySize = (rowItems - 1) / 2;
  const [selectedItem, setSelectedItem] = React.useState(initIndex + emptySize);
  const ITEM_WIDTH = SCREEN_WIDTH / rowItems;
  const listData = React.useMemo(() => {
    return createNewArray(totalSize, rowItems);
  }, [totalSize, rowItems]);
  const handleMeasureOffsetX = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const { contentOffset } = event.nativeEvent;
    contentOffsetRef.current = contentOffset.x;
  };

  const renderItem = (data: any) => {
    if (isNullOrEmpty(data.item)) {
      return <View style={[styles.containerItem, { width: ITEM_WIDTH }]} />;
    }

    return (
      <View
        style={[
          styles.containerItem,
          {
            width: ITEM_WIDTH,
          },
        ]}
      >
        <View style={styles.viewItem}>
          <Text
            style={[
              styles.txtValue,
              data.index === selectedItem && styles.itemSelected,
            ]}
          >
            {data.item.value}
          </Text>
        </View>
      </View>
    );
  };
  const getItemLayout = (
    _data: any,
    index: number
  ): { length: number; offset: number; index: number } => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });
  const calculateLayout = () => {
    flatListRef.current?.scrollToOffset({
      offset: initIndex * ITEM_WIDTH,
      animated: false,
    });
  };

  /**
   * handle pick item
   */
  const handlePicker = _.debounce(() => {
    const index =
      contentOffsetRef.current < 0
        ? 0
        : Math.abs(Math.round(contentOffsetRef.current / ITEM_WIDTH));
    const selected = index >= totalSize ? totalSize - 1 : index;
    setSelectedItem(selected + emptySize);
    flatListRef.current?.scrollToIndex({
      index: selected,
      animated: true,
    });
    onChangeSelected && onChangeSelected(index + 1);
  }, 300);
  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        onScroll={handleMeasureOffsetX}
        onLayout={calculateLayout}
        data={listData}
        pagingEnabled={true}
        renderItem={renderItem}
        snapToAlignment="center"
        snapToInterval={0}
        onMomentumScrollEnd={handlePicker}
        onScrollEndDrag={handlePicker}
        getItemLayout={getItemLayout}
        updateCellsBatchingPeriod={20}
        maxToRenderPerBatch={60}
      />
      <View style={styles.labelView}>
        <View style={styles.lineDivice} />
        <Text style={styles.weekTxt}>{title}</Text>
        <View style={styles.lineDivice} />
      </View>
    </View>
  );
};

export default HorizontalPicker;
const createNewArray = (totalSize: number, rowSize: number) => {
  const emptySize = (rowSize - 1) / 2;
  const result = Array.from({ length: emptySize });

  for (let i = 1; i <= totalSize; i++) {
    result.push({ label: i, value: i });
  }
  result.push(...Array.from({ length: emptySize }));
  return result;
};
const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 10,
  },
  viewItem: {
    borderRadius: 5,
    alignItems: 'center',
  },
  containerItem: { height: 30, padding: 5 },
  weekTxt: { fontWeight: '700', color: '#3A85DC' },
  lineDivice: {
    width: SCREEN_WIDTH / 2 - 50,
    height: 4,
    backgroundColor: '#DADADA',
  },
  labelView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  txtValue: {
    fontWeight: '500',
  },
  itemSelected: { color: '#3A85DC', fontWeight: '800' },
});
