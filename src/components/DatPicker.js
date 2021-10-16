import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import DatePicker from 'react-native-date-picker'
import Modal from 'react-native-modal';

import { Down, Calendar, X } from './svg';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

const DatPicker = ({ setDate }) => {
    const { state: { mode } } = useContext(ThemeContext);
    const styles = setStyle(mode);

    const [currentDate, setCurrentDate] = useState(new Date())
    const [isModalVisible, setModalVisible] = useState(false);

    const setDateHandler = (date) => {
        setCurrentDate(date)
        setDate(date)
    }


    return (
        <>
            <Pressable
                onPress={() => setModalVisible(true)}
                style={{
                    backgroundColor: theme[mode].white,
                    flexDirection: "row",
                    alignItems: 'center',
                    marginHorizontal: 10,
                    height: 36,
                    marginBottom: 5,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme[mode].inputbordercolor
                }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Calendar width={18} height={18} color={theme[mode].buttontextgray} />
                </View>
                <Text style={{ color: theme[mode].buttontextgray, flex: 8 }}>
                    {
                        currentDate === "" ? "Başlangıç Tarihi" : currentDate.toDateString()
                    }
                </Text>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Down color={theme[mode].buttontextgray} />
                </View>
            </Pressable>

            <Modal
                isVisible={isModalVisible}
                backdropOpacity={0.20}
                hasBackdrop={true}
                //animationIn="slideInRight"
                //animationOut="slideOutLeft"
                useNativeDriver={true}
                style={{ alignItems: 'center', margin: 10 }}
            >
                <View style={{ backgroundColor: "white", padding: 10 }}>
                    <View style={{ alignItems: "flex-end", borderBottomWidth: 1, borderColor: theme[mode].inputbordercolor, paddingBottom: 5 }}>
                        <TouchableOpacity style={{ padding: 5 }} onPress={() => setModalVisible(false)}>
                            <X width={24} height={24} color={theme[mode].textblack} />
                        </TouchableOpacity>
                    </View>
                    <DatePicker
                        date={currentDate}
                        mode="date"
                        //onDateChange={setDate}
                        onDateChange={(date) => setDateHandler(date)}
                        textColor={theme[mode].textblack}
                    />
                </View>
            </Modal>
        </>

    )
}

export default DatPicker





const setStyle = mode => ({

})