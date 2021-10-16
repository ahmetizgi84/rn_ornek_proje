import React, { useContext, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import I18n from '../../lang/_i18n'

import InputText from '../../components/InputText'
import { X, Copy, Vector } from '../../components/svg'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/Button';
import { TextInputMask } from 'react-native-masked-text'
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'

import { _profilSetNew } from '../../context/AccountDataApi';
import Toast, { callToast } from '../../components/Toast';


export const CompleteProfileScreen = ({ ...props }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);
    const [name, setName] = useState("");
    const [surName, setSurName] = useState("");
    const [date, setDate] = useState("");
    const [postCode, setPostCode] = useState("");
    const [address, setAdress] = useState("");
    const [city, setCity] = useState("");
    const [countryCode, setCountryCode] = useState('TR')
    const [country, setCountry] = useState(null)
    const [countryPickerVisible, setcountryPickerVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState(null)



    const setProfilApi = async () => {
        let messageNew = '';
        let response = await _profilSetNew({ "address": address, "city": city, "confirm": false, "dob": date, "first_name": name, "last_name": surName, "postcode": postCode, country: countryCode });
        if (response.errors && response.errors[0]) {
            let messageCode = response.errors[0].split('.').join('_');
            messageNew = I18n.t('account.' + messageCode, { locale: language })
            setToastMessage(messageNew);
            callToast();
        }

        if (response.first_name == name) {
            messageNew = I18n.t('account.profileSaved', { locale: language })
            setToastMessage(messageNew);
            callToast();
            setTimeout(
                function () {
                    props.callback()
                }
                    .bind(this),
                1500
            );
        }

    }


    const setNameHandler = value => {
        setName(value);
    };
    const setSurNameHandler = value => {
        setSurName(value);
    };

    const setDateHandler = value => {
        setDate(value);
    };

    const setContryHandler = (country) => {
        setCountryCode(country.cca2)
        setCountry(country)
        setcountryPickerVisible(false)
    };

    const setPostCodeHandler = value => {
        setPostCode(value);
    };

    const setAdressHandler = value => {
        setAdress(value);
    };
    const setCityHandler = value => {
        setCity(value);
    };


    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <View style={{ flexDirection: "row", paddingVertical: 15, justifyContent: "center" }}>
                    <Vector
                        width={20}
                        height={18}
                        style={{ left: 11, alignSelf: "center" }}
                        color={theme[mode].lightblue}
                    />
                    <Text style={styles.title}>{I18n.t('account.completeProfile', { locale: language })}</Text>
                </View>
                <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={props.modalCloseBtn}>
                    <X color={theme[props.mode].textblack} />
                </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
                <Toast message={toastMessage} type={"success"} />

                <View style={styles.cekContainer}>

                    <View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.yourName', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            placeholder={I18n.t('account.yourName', { locale: language })}
                            onChangeText={onChangeText => setNameHandler(onChangeText)}
                            dirty
                            isEmpty={false}
                            amountValue={name}

                        />
                    </View>
                    <View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.yourSurname', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            placeholder={I18n.t('account.yourSurname', { locale: language })}
                            onChangeText={onChangeText => setSurNameHandler(onChangeText)}
                            dirty
                            isEmpty={false}
                            amountValue={surName}

                        />
                    </View>

                    <View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.dateOfBirth', { locale: language })}
                        </Text>
                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'DD/MM/YYYY'
                            }}
                            placeholder="__ /__ /____"
                            placeholderTextColor={theme[mode].buttontextgray}
                            value={date}
                            onChangeText={setDateHandler}
                            style={
                                {
                                    marginBottom: 1, borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: 'transparent',
                                    flex: 1,
                                    padding: 10,
                                    backgroundColor: theme[mode].cardinputdirty,
                                    color: theme[mode].textblack,
                                }
                            }
                        />
                    </View>


                    <View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.countrySelection', { locale: language })}
                        </Text>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => setcountryPickerVisible(true)}>
                            <CountryPicker
                                {...{
                                    countryCode,
                                    onSelect: setContryHandler,
                                }}
                                theme={!mode && DARK_THEME}
                                visible={countryPickerVisible}
                            />
                            <Text style={{
                                marginBottom: 1, borderRadius: 8,
                                borderWidth: 1,
                                borderColor: 'transparent',
                                flex: 1,
                                padding: 10,
                                paddingVertical: 15,
                                backgroundColor: theme[mode].cardinputdirty,
                                color: theme[mode].textblack,
                            }}>{country !== null ? country.name : "Türkiye"}</Text>


                        </TouchableOpacity>
                    </View>


                    <View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.citySelect', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            placeholder={I18n.t('account.citySelect', { locale: language })}
                            onChangeText={onChangeText => setCityHandler(onChangeText)}
                            dirty
                            amountValue={city}

                        />
                    </View><View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.postCode', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            placeholder={I18n.t('account.postCode', { locale: language })}
                            onChangeText={onChangeText => setPostCodeHandler(onChangeText.trim())}
                            dirty
                            isEmpty={false}
                            amountValue={postCode}

                        />
                    </View>

                    <View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.adress', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            placeholder={I18n.t('account.adress', { locale: language })}
                            onChangeText={onChangeText => setAdressHandler(onChangeText)}
                            multiline
                            numberOfLines={3}
                            isEmpty={false}
                            amountValue={address}
                            dirty
                        />
                    </View>

                    {/*  */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginBottom: 20,
                    }}>
                        <Button title={I18n.t('account.goOn', { locale: language })} btnLg btnLightBlue
                            disabled={!(name.length > 4) || !(surName.length > 4) || !(date.length > 4) || !(address.length > 4) || !(city.length > 4)}
                            callback={setProfilApi} />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}



const setStyle = mode => ({
    cekContainer: {
        flex: 1,
        padding: 15,
    },
    title: {
        color: theme[mode].lightblue,
        left: 21,
        fontSize: 18,
        fontWeight: "500",
    },

    inpTitle: {
        color: theme[mode].textblack,
        fontSize: 10,
        marginBottom: 5,
    },

    modalContainer: {
        flex: 1,
        //backgroundColor: theme[mode].bg,
        backgroundColor: theme[mode].white,
        ...theme.shadow,
        padding: 15,
        marginHorizontal: 10,
        borderRadius: 8,
    },

    modalHeader: {
        alignItems: "center",
        marginBottom: 5,
        flexDirection: "row",
        justifyContent: "space-between",

    },

    modalCloseBtn: {
        padding: 2,
        backgroundColor: theme[mode].bg,
        borderRadius: 5
    },







})


