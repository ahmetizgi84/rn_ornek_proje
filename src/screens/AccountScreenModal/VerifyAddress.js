import React, { useContext, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import I18n from '../../lang/_i18n'

import { X, Yukle, Documan1, Documan2, Documan3, Vector, } from '../../components/svg'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/Button';
import InputText from '../../components/InputText'

import { _profilSetNew } from '../../context/AccountDataApi';
import Toast, { callToast } from '../../components/Toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'

const win = Dimensions.get('window');
import { _verifyAddress } from '../../context/AccountDataApi';



export const VerifyAddress = ({ ...props }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);

    const [toastMessage, setToastMessage] = useState(null)
    const [citySelect, setCitySelect] = useState("");
    const [address, setAddress] = useState("");
    const [postCode, setPostCode] = useState("");
    const [responseDocuman1, setresponseDocuman1] = React.useState(null);
    const [countryPickerVisible, setcountryPickerVisible] = useState(false)
    const [countryCode, setCountryCode] = useState('TR')
    const [country, setCountry] = useState(null)
    const [loader, setLoader] = useState(false);

    const createFormData = (photo) => {
        return {
            name: photo.fileName,
            type: photo.type,
            data: "data:" + photo.type + ";base64," + photo.base64,
            uri:
                Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        };
    };


    const setContryHandler = (country) => {
        setCountryCode(country.cca2)
        setCountry(country)
        setcountryPickerVisible(false)
    };

    const setCitySelectHandler = value => {
        setCitySelect(value);
    };

    const setPostCodeHandler = value => {
        setPostCode(value);
    };
    const setAddressHandler = value => {
        setAddress(value);
    };

    const alertCameraOrImage = (setDocuman) => {
        Alert.alert(
            //title
            'Fotoğraf Seçimi',
            //body
            '',
            [
                {
                    text: 'Kamera',
                    onPress: () => launchCamera(
                        {
                            mediaType: 'photo',
                            includeBase64: true,
                            maxHeight: 1920,
                            maxWidth: 1920,
                        },
                        (response) => {
                            setDocuman(response);
                        },
                    )
                },
                {
                    text: 'GALERİ',
                    onPress: () => launchImageLibrary(
                        {
                            mediaType: 'photo',
                            includeBase64: true,
                            maxHeight: 1920,
                            maxWidth: 1920,
                        },
                        (response) => {
                            setDocuman(response);
                        },
                    )

                }, {
                    text: 'İptal',
                    onPress: () => console.log('No Pressed'),
                },
            ],

            { cancelable: true, },
        );
    }

    const sendVerifyIdentity = async () => {

        setLoader(true);

        const request = new FormData();
        request.append('upload[]', createFormData(responseDocuman1));
        request.append('address', address);
        request.append('city', citySelect);
        request.append('country', countryCode);
        request.append('postcode', postCode);

        let messageNew = '';
        try {
            var response = null;
            response = await _verifyAddress(request);

            if (response.errors && response.errors[0]) {
                let messageCode = response.data.errors[0].split('.').join('_');
                messageNew = I18n.t('account.' + messageCode, { locale: language })
                setToastMessage(messageNew);
                if (toastMessage != null)
                    callToast();
                setLoader(false);
            }
            else if (response == "201") {
                messageNew = I18n.t('account.idCardImageSide', { locale: language }) + " " + I18n.t('account.documents_uploaded', { locale: language })

                setToastMessage(messageNew);
                if (toastMessage != null)
                    callToast();
                setTimeout(
                    function () {
                        setLoader(false);
                        props.callback()
                    }
                        .bind(this),
                    1500
                );
            }
            else {
                console.log(response)
            }

        } catch (error) {
            console.log("catch", error)
        }

    }

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
                    <Text style={styles.title}>{I18n.t('account.verifyResidence', { locale: language })}</Text>
                </View>
                <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={props.modalCloseBtn}>
                    <X color={theme[props.mode].textblack} />
                </TouchableOpacity>
            </View>


            <ScrollView keyboardShouldPersistTaps="handled">
                <Toast message={toastMessage} type={toastMessage === I18n.t('account.idCardImageSide', { locale: language }) + " " + I18n.t('account.documents_uploaded', { locale: language }) ? "success" : "danger"} />

                <View style={styles.cekContainer}>
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
                            onChangeText={onChangeText => setCitySelectHandler(onChangeText)}
                            dirty
                            isEmpty={false}
                            amountValue={citySelect}
                        />
                    </View>

                    <View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.adress', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            placeholder={I18n.t('account.adress', { locale: language })}
                            onChangeText={onChangeText => setAddressHandler(onChangeText)}
                            dirty
                            isEmpty={false}
                            amountValue={address}

                        />
                    </View>

                    <View style={{ paddingVertical: 5, }}>
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

                    <Text style={{ color: theme[mode].textblack, paddingVertical: 15, fontSize: 12, textAlign: "center" }}>{I18n.t('account.requredImagesUpload', { locale: language })} </Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>

                        <TouchableOpacity style={styles.image} onPress={() => alertCameraOrImage(setresponseDocuman1)}>
                            <Text style={{ color: theme[mode].textblack, fontSize: 12, textAlign: "center" }}>{I18n.t('account.idCardImageSide', { locale: language })}</Text>
                            {responseDocuman1 == null ? <Documan2
                                height={100}
                                style={{ alignSelf: "center" }}
                                color={theme[mode].lightblue}
                            />
                                :
                                <Image
                                    style={{ width: win.width / 4, height: 100, }}
                                    source={{ uri: responseDocuman1.uri }}
                                    resizeMode={"contain"}
                                />
                            }
                            <Yukle
                                height={15}
                                height={15}
                                style={{ position: "absolute", left: 5, bottom: 5 }}
                                color={theme[mode].green}
                            />
                        </TouchableOpacity>

                    </View>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginVertical: 20,
                    }}>
                        {loader ? <ActivityIndicator style={{ flex: 1 }} size="large" color={theme[mode].lightblue} />
                            : <Button title={I18n.t('account.goOn', { locale: language })} btnLg btnLightBlue
                                disabled={(!address || !responseDocuman1 || !postCode || !citySelect)}
                                callback={sendVerifyIdentity} />}
                    </View>
                </View>
            </ScrollView>
        </View >
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


    button: {
        marginVertical: 24,
        marginHorizontal: 24,
    },
    image: {
        width: win.width / 4,
        marginHorizontal: 5,
        backgroundColor: theme[mode].cardinputdirty,
        padding: 2,
        alignItems: 'center',
        alignSelf: "center",
        height: 140,
        borderStyle: 'dashed',
        borderRadius: 1,
        borderWidth: 1,
        borderColor: theme[mode].green,
    },
    response: {
        marginVertical: 16,
        marginHorizontal: 8,
    },





})


