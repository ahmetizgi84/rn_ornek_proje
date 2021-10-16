import React, { useState, useContext } from 'react'
import { View, Text } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { Down } from '../components/svg';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';


const Picker = () => {
    const { state: { mode } } = useContext(ThemeContext);
    const styles = setStyle(mode);

    const [pickerValue, setPickerValue] = useState('')
    const [items, setItems] = useState([
        {
            label: "Yatırma Geçmişi",
            value: "Yatırma Geçmişi",
        },
        {
            label: "Çekme Geçmişi",
            value: "Çekme Geçmişi",
        },
    ])

    return (
        <View style={{ marginHorizontal: 10 }}>
            <DropDownPicker
                items={items}
                //controller={(instance) => (controller = instance)}
                containerStyle={{ height: 36 }}
                style={{ backgroundColor: theme[mode].white, borderWidth: 1, borderColor: theme[mode].inputbordercolor, borderRadius: 8 }}
                itemStyle={{ justifyContent: 'flex-start' }}
                showArrow={false}
                placeholder="Tüm İşlemler"
                placeholderStyle={{ color: theme[mode].buttontextgray }}
                labelStyle={{ fontSize: 14, color: '#1a202e' }}
                activeLabelStyle={{ fontWeight: '700' }}
                dropDownStyle={{ backgroundColor: theme[mode].white, borderWidth: 1 }}
                defaultValue={pickerValue}
                onChangeItem={(item) => setPickerValue(item.value)}

            />
            <View style={{ position: "absolute", top: 7, right: 7, bottom: 0 }}>
                <Down width={24} color={theme[mode].buttontextgray} />
            </View>
        </View>
    )
}

export default Picker

const setStyle = mode => ({

})



