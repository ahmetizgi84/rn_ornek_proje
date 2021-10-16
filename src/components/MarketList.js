import React, { useContext } from 'react'
import { View, FlatList } from 'react-native'
import I18n from '../lang/_i18n';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ListCard from './ListCard';
import SkeletonLoader from './SkeletonLoader';
import Button from './Button';

import { Context as ThemeContext } from '../context/ThemeContext';
import { SocketContext } from '../context/SocketContext'
import { DataContext } from '../context/DataContext';

const MarketList = ({ sliced, filtered, listHeaderComponent }) => {
    const { state: { language } } = useContext(ThemeContext);
    const { marketList } = useContext(SocketContext);
    const navigation = useNavigation();
    let itemHeights = [];

    const listItemNavigationHandler = async item => {
        navigation.navigate('ProTrade', { item });
        await AsyncStorage.setItem('CURRENT_MARKET', item.id)
    };

    const renderItem = ({ item }) => (
        <ListCard item={item} callback={() => listItemNavigationHandler(item)} />
    );

    const getItemLayout = (data, index) => {
        const length = itemHeights[index] || 0; // <----- if undefined return 0
        const offset = itemHeights.slice(0, index).reduce((a, c) => a + c, 0)
        return { length, offset, index }
    }

    const btnPressHandler = () => {
        navigation.navigate('TradeTab')
    }

    const listFooterComponent = () => (
        <View style={{ paddingBottom: 10, marginHorizontal: 10 }}>
            <Button
                title={I18n.t('more', { locale: language })}
                btnDark
                btnLg
                callback={btnPressHandler}
            />
        </View>
    );

    const ListEmptyComponent = () => {
        return (
            [1, 2, 3, 4, 5].map(index => (
                <View key={index}>
                    <SkeletonLoader />
                </View>
            ))
        )
    }


    if (sliced) {
        return (
            <View style={{ flex: 1,   }}>
                <FlatList
                    scrollEnabled={true}
                    //data={filtered && filtered.length > 0 ? filtered : marketList?.slice(0, 5)}
                    data={filtered && filtered.length > 0 ? filtered : marketList}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    //ListFooterComponent={listFooterComponent}
                    getItemLayout={getItemLayout}
                    ListEmptyComponent={ListEmptyComponent}
                    removeClippedSubviews={true}
                    ListHeaderComponent={listHeaderComponent}
                />


            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                scrollEnabled={true}
                data={filtered && filtered.length > 0 ? filtered : marketList}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                ListEmptyComponent={ListEmptyComponent}
                removeClippedSubviews={true}
            />
        </View>
    )
}

export default MarketList
