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
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInputMask } from 'react-native-masked-text'

const win = Dimensions.get('window');
import { _verifyIdentity } from '../../context/AccountDataApi';



export const VerifyIdentity = ({ ...props }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);
    const [selectedIdentity, setSelectedIdentity] = useState("Identity card");

    const [toastMessage, setToastMessage] = useState(null)
    const [identityNumber, setidentityNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [expiryDate, setexpiryDate] = useState("");
    const [responseDocuman1, setresponseDocuman1] = React.useState(null);
    const [responseDocuman2, setresponseDocuman2] = React.useState(null);
    const [responseDocuman3, setresponseDocuman3] = React.useState(null);
    const [loader, setLoader] = useState(false);

    const orderTypes = [
        {
            label: I18n.t('account.idCard', { locale: language }),
            value: 'Identity card',
        },
        {
            label: I18n.t('account.passport', { locale: language }),
            value: 'Passport',
        },
        {
            label: I18n.t('account.driversLicense', { locale: language }),
            value: 'Driver license',
        },

    ];
    const createFormData = (photo) => {

        return {
            name: photo.fileName,
            type: photo.type,
            data: "data:" + photo.type + ";base64," + photo.base64,
            uri:
                Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        };
    };


    const setidentityNumberHandler = value => {
        setidentityNumber(value);
    };

    const setDateHandler = value => {
        setDateOfBirth(value);
    };
    const setExpiryDateHandler = value => {
        setexpiryDate(value);
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
            //clicking out side of alert will not cancel
        );
    }
    const getHex = (len) => {
        let result = [];
        let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        for (let n = 0; n < len; n++) {
            result.push(hexRef[Math.floor(Math.random() * 16)]);
        }
        return result.join('');
    };
    const sendVerifyIdentity = async () => {
        setLoader(true);
        var data3 = null
        var identificator = getHex(32);
        //  console.log(responseDocuman1.base64)

        const request1 = new FormData();
        request1.append('doc_issue', dateOfBirth);
        request1.append('doc_type', selectedIdentity);
        request1.append('doc_number', identityNumber);
        request1.append('identificator', identificator);
        request1.append('doc_category', "front_side");
        request1.append('upload[]', createFormData(responseDocuman1));
        if (expiryDate)
            request1.append('doc_expire', expiryDate);

        const request2 = new FormData();
        request2.append('doc_issue', dateOfBirth);
        request2.append('doc_type', selectedIdentity);
        request2.append('doc_number', identityNumber);
        request2.append('identificator', identificator);
        request2.append('doc_category', "selfie");
        request2.append('upload[]', createFormData(responseDocuman2));
        if (expiryDate)
            request2.append('doc_expire', expiryDate);

        const request3 = new FormData();
        if (selectedIdentity != "Passport") {
            request3.append('doc_issue', dateOfBirth);
            request3.append('doc_type', selectedIdentity);
            request3.append('doc_number', identityNumber);
            request3.append('identificator', identificator);
            request3.append('doc_category', "back_side");
            request3.append('upload[]', createFormData(responseDocuman3));
            if (expiryDate)
                request3.append('doc_expire', expiryDate);
        }


        var forDeger = 3;
        if (selectedIdentity === "Passport") {
            forDeger = 2;

        }

        let messageNew = '';
        try {
            for (let index = 0; index < forDeger; index++) {
                var response = null;
                if (index == 0)
                    response = await _verifyIdentity(request1);
                if (index == 1)
                    response = await _verifyIdentity(request2);
                if (index == 2)
                    response = await _verifyIdentity(request3);
                console.log(response);
                if (response == "201") {
                    if (index == 0) {
                        messageNew = I18n.t('account.idCardImageSide', { locale: language }) + " " + I18n.t('account.documents_uploaded', { locale: language })
                        setToastMessage(messageNew);
                        if (toastMessage != null)
                            callToast();
                    }
                    if (index == 1) {
                        messageNew = I18n.t('account.idCardSelfi', { locale: language }) + " " + I18n.t('account.documents_uploaded', { locale: language })
                        setToastMessage(messageNew);
                        if (toastMessage != null)
                            callToast();
                    }
                    if (index == 2) {
                        messageNew = I18n.t('account.idCardImageBack', { locale: language }) + " " + I18n.t('account.documents_uploaded', { locale: language })
                        setToastMessage(messageNew);
                        if (toastMessage != null)
                            callToast();
                    }
                }
                else if (response.data.errors && response.data.errors[0]) {
                    let messageCode = response.data.errors[0].split('.').join('_');
                    messageNew = I18n.t('account.' + messageCode, { locale: language })
                    setToastMessage(messageNew);
                    if (toastMessage != null)
                        callToast();
                }
                else {
                    console.log(response)
                }
                if (selectedIdentity === "Passport") {
                    if (index == 1) {
                        setTimeout(
                            function () {
                                setLoader(false);
                                props.callback()
                            }
                                .bind(this),
                            1500
                        );
                    }
                }
                else if (index == 2) {
                    setTimeout(
                        function () {
                            setLoader(false);
                            props.callback()
                        }
                            .bind(this),
                        1500
                    );

                }

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
                    <Text style={styles.title}>{I18n.t('account.verifyIdentity', { locale: language })}</Text>
                </View>
                <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={props.modalCloseBtn}>
                    <X color={theme[props.mode].textblack} />
                </TouchableOpacity>
            </View>


            <ScrollView keyboardShouldPersistTaps="handled">
                <Toast message={toastMessage} type={"danger"} />

                <View style={styles.cekContainer}>
                    <DropDownPicker
                        items={orderTypes}
                        containerStyle={{ height: 42, borderRadius: 4, marginBottom: 12 }}
                        style={{ backgroundColor: theme[mode].cardinputdirty, borderWidth: 0.5, borderColor: theme[mode].inputbordercolor }}
                        showArrow={false}
                        arrowColor={theme[mode].chartTextBlack}
                        itemStyle={{ justifyContent: 'flex-start' }}
                        labelStyle={{ fontSize: 14, color: theme[mode].chartTextBlack }}
                        activeLabelStyle={{ fontWeight: '700', color: theme[mode].lightblue }}
                        dropDownStyle={{ backgroundColor: theme[mode].cardinputdirty, borderTopWidth: 0, borderColor: theme[mode].inputbordercolor }}
                        defaultValue={orderTypes[0].value}
                        onChangeItem={(item) => setSelectedIdentity(item.value)}
                    />

                    <View style={{ paddingVertical: 5, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.identityNumber', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            placeholder={I18n.t('account.identityNumber', { locale: language })}
                            onChangeText={onChangeText => setidentityNumberHandler(onChangeText.trim())}
                            dirty
                            isEmpty={false}
                            amountValue={identityNumber}

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
                            value={dateOfBirth}
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
                            {I18n.t('account.expiryDate', { locale: language })}
                        </Text>
                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'DD/MM/YYYY'
                            }}
                            placeholder="__ /__ /____"
                            placeholderTextColor={theme[mode].buttontextgray}
                            value={expiryDate}
                            onChangeText={setExpiryDateHandler}
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

                    <Text style={{ color: theme[mode].textblack, paddingVertical: 15, fontSize: 12, textAlign: "center" }}>{I18n.t('account.requredImagesUpload', { locale: language })} </Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                        <TouchableOpacity style={styles.image} onPress={() => alertCameraOrImage(setresponseDocuman1)}>
                            <Text style={{ color: theme[mode].textblack, fontSize: 12, textAlign: "center" }}>{I18n.t('account.idCardImageSide', { locale: language })}</Text>
                            {responseDocuman1 == null ? <Documan1
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

                        {selectedIdentity != "Passport" &&
                            < TouchableOpacity style={styles.image} onPress={() => alertCameraOrImage(setresponseDocuman2)}>

                                <Text style={{ color: theme[mode].textblack, fontSize: 12, textAlign: "center" }}>{I18n.t('account.idCardImageBack', { locale: language })}</Text>

                                {responseDocuman2 == null ? <Documan2

                                    height={100}
                                    style={{ alignSelf: "center" }}
                                    color={theme[mode].lightblue}
                                />
                                    :
                                    <Image
                                        style={{ width: win.width / 4, height: 100, }}
                                        source={{ uri: responseDocuman2.uri }}
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
                        }

                        <TouchableOpacity style={styles.image} onPress={() => alertCameraOrImage(setresponseDocuman3)}>

                            <Text style={{ color: theme[mode].textblack, fontSize: 12, textAlign: "center" }}>{I18n.t('account.idCardSelfi', { locale: language })}</Text>

                            {responseDocuman3 == null ? <Documan3
                                height={100}
                                style={{ alignSelf: "center" }}
                                color={theme[mode].lightblue}
                            />
                                :
                                <Image
                                    style={{ width: win.width / 4, height: 100, }}
                                    source={{ uri: responseDocuman3.uri }}
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
                                disabled={(!identityNumber || !dateOfBirth || !responseDocuman1 || !(selectedIdentity != "Passport" && responseDocuman2) || !(responseDocuman3))}
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


