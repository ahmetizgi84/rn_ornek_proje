import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Pressable, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import I18n from '../../lang/_i18n'
import { useFocusEffect } from "@react-navigation/native";

import { Plus, Minus } from '../svg'

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext'
import { Context as ProTradeContext } from '../../context/ProTradeContext';
import { DataContext } from '../../context/DataContext';

const orderTypes = [
    {
        label: 'Limit',
        value: 'Limit',
    },
    {
        label: 'Market',
        value: 'Market',
    },
];

const decimalInt = (value, decimals) => {
    if (!value) {
        return ''
    }
    if (value === '.') {
        return value = '0.'
    }

    var regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`)
    const decimalsNumber = value.toString().match(regex)[0]
    const parsed = parseFloat(decimalsNumber).toFixed(decimals)
    if (isNaN(parsed)) {
        return '0'
    }
    return parsed
}


function SiparisOlustur({ relatedMarket }) {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { marketList } = useContext(SocketContext)
    const { state: { isLoggedIn } } = useContext(AuthContext);
    const { isProcessing, setIsProcessing, balance, _getBalance, _proTradeHandler, _easyTradeHandler, toastMessageHandler, _getOrders } = useContext(DataContext)
    const { state: { asks, bids } } = useContext(ProTradeContext)
    const styles = setStyle(mode);
    const [tradeState, setTradeState] = useState(1)
    const [dropdownValue, setDropdownValue] = useState('Limit')
    const [total, setTotal] = useState(0)
    const [price, setPrice] = useState(0)
    const [amount, setAmount] = useState(0)

    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////
    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////
    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////
    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////
    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////

    const _proTradeHandlerWillMove = async () => {
        if (amount !== 0) {
            if (isLoggedIn) {
                setIsProcessing(true)
                const pair = customFilter().id;
                const choosed = customFilter();
                let isActive = true
                if (tradeState == 2) {
                    isActive = false
                }
                if (dropdownValue == 'Limit') {
                    await _proTradeHandler(amount, price, pair, isActive, choosed)
                    await _getBalance()
                    await _getOrders();
                } else if (dropdownValue == 'Market') {
                    await _easyTradeHandler(amount, pair, isActive, choosed)
                    await _getBalance()
                    await _getOrders();
                }
            } else {
                toastMessageHandler("no_valid_session")
            }
        } else {
            toastMessageHandler("amount_zero")
        }

    }


    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////
    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////
    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////
    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////
    //////////////////////////////////////// TO DATACONTEXT SOON /////////////////////////////////////////////////

    /************************************************************************************************* */
    useFocusEffect(
        React.useCallback(() => {
            _getBalance();
        }, [])
    );

    useEffect(() => {
        let marketPrice = parseFloat(customFilter().last)
        let precision = parseFloat(customFilter().price_precision)
        let pr = decimalInt(marketPrice, precision)
        let prc = parseFloat(pr).toFixed(precision)
        setPrice(prc)
    }, [dropdownValue === 'Market' && marketList])

    const priceHandler = (way) => {
        let precision = parseFloat(customFilter().price_precision)
        let val = Math.pow(10, precision)
        let newVal = 1 / val

        if (way === 'plus') {
            let newState = parseFloat(price) + parseFloat(newVal)
            let fixed = newState.toFixed(precision)
            setPrice(fixed)
        } else {
            let newState = parseFloat(price) - parseFloat(newVal)
            let fixed = newState.toFixed(precision)
            setPrice(fixed)
        }

    }
    /************************************************************************************************* */
    const amountHandler = (type) => {
        let currentMarketLastPrice = parseFloat(price == 0 ? customFilter().last : price).toFixed(customFilter().price_precision)
        let precision = parseFloat(customFilter().amount_precision)
        let val = Math.pow(10, precision)
        let newVal = 1 / val
        if (type == 'plus') {
            setAmount(a => (parseFloat(a) + parseFloat(newVal)).toFixed(precision))
            let calculated = (parseFloat(amount) + parseFloat(newVal)) * currentMarketLastPrice
            setTotal(calculated.toFixed(2))
        } else if (type == 'minus') {
            if (amount > 0) {
                setAmount(a => (parseFloat(a) - parseFloat(newVal)).toFixed(precision))
                let calculated = (parseFloat(amount) - parseFloat(newVal)) * currentMarketLastPrice
                setTotal(calculated.toFixed(2))
            } else {
                setAmount(0)
                setTotal(0)
            }
        }
    }

    const priceInput = (text) => {
        setPrice(text)
        let calculated = text * amount
        setTotal(calculated.toFixed(2))

    }

    const amountInput = (text) => {
        setAmount(text)
        let calculated = text * price
        setTotal(calculated.toFixed(2))

    }

    /************************************************************************************************* */


    const currencyFormat = (numStr) => {
        var price_precision = relatedMarket.price_precision === 0 ? 8 :relatedMarket.price_precision
         var formatter = new Intl.NumberFormat('en-US', { minimumSignificantDigits: relatedMarket.price_precision === 0 ? 3 : relatedMarket.price_precision, maximumSignificantDigits: 8 }).format(numStr);
          if (parseInt(formatter) < 1)
             formatter = parseFloat(formatter).toFixed(price_precision)
         
        return formatter;
    }

    const renderItemAsks = ({ item }) => {
        let deger = item.yuzde + '%'
        return (
            <Pressable onPress={() => setCurrentPrice(item.price)} style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", height: 22, alignItems: "center" }}>
                <View style={{ alignItems: "flex-end", width: deger, backgroundColor: theme[mode].redbgc, position: "absolute", top: 0, right: 0, bottom: 0 }} />
                <Text style={{ color: theme[mode].red, fontSize: 12 }}>{currencyFormat(item.price)}</Text>
                <Text style={{ color: theme[mode].chartTextBlack, fontSize: 12 }}>{currencyFormat(item.amount)}</Text>
            </Pressable>
        )
    }

    const renderItemBids = ({ item }) => {
        let deger = item.yuzde + '%'
        return (
            <Pressable onPress={() => setCurrentPrice(item.price)} style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", height: 22, alignItems: "center" }}>
                <View style={{ alignItems: "flex-end", width: deger, backgroundColor: theme[mode].inpbgc, position: "absolute", top: 0, right: 0, bottom: 0 }} />
                <Text style={{ color: theme[mode].green, fontSize: 12 }}>{currencyFormat(item.price)}</Text>
                <Text style={{ color: theme[mode].chartTextBlack, fontSize: 12 }}>{currencyFormat(item.amount)}</Text>
            </Pressable>
        )
    }

    const customFilter = () => {
        const filtered = marketList.filter(item => item.id == relatedMarket.id)
        return filtered[0]
    }

    const setDropdownValueHandler = (val) => {
        setDropdownValue(val)
        setTotal(0)
        setAmount(0)
    }

    const setCurrentPrice = (currPrice) => {
        if (dropdownValue === 'Limit') {
            setPrice(currPrice)
        }
    }

    const calculateRates = (rate) => {
        if (isLoggedIn) {
            var balanceAvilable = balance.filter(x => x.currency == "try")[0]
            let availableBalance = 0
            let ratedAmount = 0
            let totalFixed = 0
            let currentMarketLastPrice = 0
            if (dropdownValue === 'Limit') {
                currentMarketLastPrice = parseFloat(price == 0 ? customFilter().last : price).toFixed(customFilter().price_precision)
            } else {
                if (tradeState == 1) {
                    let tempAsks = [...asks];
                    console.log(tempAsks.reverse()[0].price)
                    currentMarketLastPrice = parseFloat(tempAsks.reverse()[0].price)
                } else {
                    let tempBids = [...bids];
                    console.log(tempBids.reverse()[0].price)
                    currentMarketLastPrice = parseFloat(tempBids.reverse()[0].price)
                }
            }
            if (tradeState == 1) {
                availableBalance = parseFloat(balanceAvilable?.balance)
                ratedAmount = ((availableBalance / currentMarketLastPrice) * rate).toFixed(relatedMarket?.amount_precision)
                totalFixed = (ratedAmount * currentMarketLastPrice).toFixed(3)
                if (totalFixed > availableBalance) {
                    let precision = parseFloat(customFilter().amount_precision)
                    let val = Math.pow(10, precision)
                    let newVal = 1 / val
                    ratedAmount = (parseFloat(ratedAmount) - parseFloat(newVal)).toFixed(precision)
                    totalFixed = (ratedAmount * currentMarketLastPrice).toFixed(2)
                }
            } else {
                index = balance.findIndex(x => x.currency === customFilter().subtitle);
                availableBalance = balance[index].balance
                ratedAmount = (availableBalance * rate).toFixed(relatedMarket?.amount_precision)
                totalFixed = (ratedAmount * currentMarketLastPrice).toFixed(2)
            }

            /// tradeState 1 ise alış 2 ise satış total ve amount hesaplanacak
            //let calculatedAmount = ratedBalance / currentMarketLastPrice
            setAmount(ratedAmount)
            setTotal(totalFixed)
        }
    }

    const stateHandler = (id) => {
        setTradeState(id)
        setTotal(0)
        setAmount(0)
    }

    let subtitle = customFilter().subtitle.toUpperCase()

    let balance_try = 0;
    let balance_pair = 0;

    if (isLoggedIn) {
        var balanceAvilable = balance.filter(x => x.currency == "try")[0]
        balance_try = decimalInt(balanceAvilable?.balance, 3) + " " + balanceAvilable?.currency.toUpperCase()
        index = balance.findIndex(x => x.currency === customFilter().subtitle);
        balance_pair = balance[index] ? balance[index].balance + " " + balance[index].currency.toUpperCase() : 0
    }


    const _yuzde = (deger) => {
        const data = deger.map(d => d.amount);
        let maxVal = Math.max(...data)
        const newArray = []
         deger.map((b, index) => {
            let yuzde = ((b.amount * 100) / maxVal).toFixed(2)
            newArray[index] = {
                'price': b.price,
                'amount': b.amount,
                'yuzde': yuzde
            }
        })
        return newArray
    }


    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 5 }}>
                    <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('protrade.makeanorder.price', { locale: language })} (TRY)</Text>
                    <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('protrade.makeanorder.amount', { locale: language })} ({subtitle})</Text>
                </View>

                <FlatList
                    contentContainerStyle={{ flex: 1, flexDirection: "column" }}
                    horizontal={true}
                    scrollEnabled={false}
                    windowSize={5}
                    initialListSize={6}
                    initialNumToRender={6}
                    maxToRenderPerBatch={6}
                    //data={asks.slice(0, 6).reverse()}
                    data={_yuzde(asks.slice(0, 6).reverse())}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItemAsks}
                />

                <Pressable onPress={() => setCurrentPrice(customFilter().last)}>
                    <Text style={{ color: theme[mode].chartTextBlack, fontSize: 18, textAlign: 'center' }}>{currencyFormat(customFilter().last)}</Text>
                </Pressable>

                <FlatList
                    contentContainerStyle={{ flex: 1, flexDirection: "column" }}
                    horizontal={true}
                    scrollEnabled={false}
                    windowSize={5}
                    initialListSize={6}
                    initialNumToRender={6}
                    maxToRenderPerBatch={6}
                    //data={bids.slice(0, 6)}
                    data={_yuzde(bids.slice(0, 6))}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItemBids}
                />

            </View>

            <View style={{ flex: 1, paddingLeft: 10 }}>

                <View style={[styles.buttonGroup, { marginBottom: 12 }]}>
                    <Pressable
                        style={[styles.tradeBtns, tradeState === 1 ? styles.tradeActive : styles.tradePassive]}
                        onPress={() => stateHandler(1)} >
                        <Text style={[styles.btnText, tradeState === 1 ? styles.tradeactiveText : styles.tradepassiveText]}>{I18n.t('protrade.makeanorder.buy', { locale: language })}</Text>
                    </Pressable>
                    <Pressable style={[styles.tradeBtns, tradeState === 2 ? styles.tradeActive : styles.tradePassive]}
                        onPress={() => stateHandler(2)}>
                        <Text style={[styles.btnText, tradeState === 2 ? styles.tradeactiveText : styles.tradepassiveText]}>{I18n.t('protrade.makeanorder.sell', { locale: language })}</Text>
                    </Pressable>
                </View>

                <DropDownPicker
                    items={orderTypes}
                    containerStyle={{ height: 34, borderRadius: 4, marginBottom: 12 }}
                    style={{ backgroundColor: theme[mode].cardbg, borderWidth: 0.5, borderColor: theme[mode].inputbordercolor }}
                    showArrow={false}
                    arrowColor={theme[mode].chartTextBlack}
                    itemStyle={{ justifyContent: 'flex-start' }}
                    labelStyle={{ fontSize: 14, color: theme[mode].chartTextBlack }}
                    activeLabelStyle={{ fontWeight: '700', color: theme[mode].lightblue }}
                    dropDownStyle={{ backgroundColor: theme[mode].cardbg, borderTopWidth: 0 }}
                    defaultValue={dropdownValue ? dropdownValue : orderTypes[0].value}
                    onChangeItem={(item) => setDropdownValueHandler(item.value)}
                />

                <PriceSetter
                    dropdownValue={dropdownValue}
                    price={price}
                    priceHandler={priceHandler}
                    priceInput={priceInput}
                />

                <AmountSetter amountHandler={amountHandler} amountInput={amountInput} amount={amount} myplaceholder={relatedMarket.subtitle} />

                <RateButtons calculator={calculateRates} />


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ color: theme[mode].chartTextBlack, fontSize: 13 }}>{I18n.t('protrade.makeanorder.total', { locale: language })} ≌</Text>
                    <Text style={{ color: theme[mode].chartTextBlack, fontWeight: '700' }}>{total} TRY</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ color: theme[mode].chartTextBlack, fontSize: 13 }}>{I18n.t('protrade.makeanorder.available', { locale: language })}</Text>
                    <Text style={{ color: theme[mode].chartTextBlack, fontWeight: '700' }}>{tradeState === 1 ? balance_try : balance_pair}</Text>

                </View>

                <TouchableOpacity
                    onPress={_proTradeHandlerWillMove}
                    disabled={isProcessing && true}
                    style={{
                        height: 32,
                        borderRadius: 4,
                        backgroundColor: tradeState === 1 ? theme[mode].green : theme[mode].red,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    {
                        isProcessing ? <ActivityIndicator size="small" color={theme[mode].indicatorColor} /> :
                            <Text style={{ color: theme[mode].white, fontWeight: '700' }}>
                                {customFilter().subtitle.toUpperCase()} {tradeState === 1 ? I18n.t('protrade.makeanorder.buy', { locale: language }).toUpperCase() : I18n.t('protrade.makeanorder.sell', { locale: language }).toUpperCase()}
                            </Text>
                    }

                </TouchableOpacity>
            </View>

        </View>
    )
}

export default SiparisOlustur


export function PriceSetter({ price, priceHandler, dropdownValue, priceInput }) {
    const { state: { mode } } = useContext(ThemeContext);


    return (
        <View style={{ flexDirection: "row", height: 36, borderWidth: 0.5, borderColor: theme[mode].inputbordercolor, borderRadius: 4, marginBottom: 12 }}>
            <TouchableOpacity disabled={dropdownValue === 'Market' ? true : false} style={{ width: 36, backgroundColor: theme[mode].cancelBtnbgcolor, alignItems: "center", justifyContent: "center", borderRadius: 4 }}
                onPress={() => priceHandler('minus')}
            >
                <Minus width={20} color={theme[mode].chartTextBlack} />
            </TouchableOpacity>

            <View style={[{ alignItems: 'center', justifyContent: 'center', flex: 1 }, dropdownValue === 'Market' && { backgroundColor: theme[mode].cancelBtnbgcolor }]}>
                <TextInput
                    style={{
                        width: '100%',
                        paddingTop: 0,
                        paddingBottom: 0,
                        textAlign: "center",
                        color: theme[mode].textblack,
                        fontWeight: '700',
                    }}
                    editable={dropdownValue === 'Market' ? false : true}
                    autoCorrect={false}
                    keyboardType={Platform.OS === "android" ? "number-pad" : "numbers-and-punctuation"}
                    autoCompleteType='off'
                    value={price.toString()}
                    //onChangeText={text => priceInput(text)}
                    onChangeText={text => priceInput(text.replace(/[^0-9.]/g, ''))}
                />
            </View>

            <TouchableOpacity disabled={dropdownValue === 'Market' ? true : false} style={{ width: 36, backgroundColor: theme[mode].cancelBtnbgcolor, alignItems: "center", justifyContent: "center", borderRadius: 4 }}
                onPress={() => priceHandler('plus')}
            >
                <Plus width={20} color={theme[mode].chartTextBlack} />
            </TouchableOpacity>
        </View>
    )
}

export function AmountSetter({ amountHandler, amountInput, amount, myplaceholder }) {
    const { state: { mode, language } } = useContext(ThemeContext);
    const [placeholder, setPlaceHolder] = useState('')

    useEffect(() => {
        setPlaceHolder(I18n.t('protrade.makeanorder.amount', { locale: language }) + ' (' + myplaceholder.toUpperCase() + ')')
    }, [])


    return (
        <View style={{ flexDirection: "row", height: 36, borderWidth: 0.5, borderColor: theme[mode].inputbordercolor, borderRadius: 4, marginBottom: 12 }}>
            <TouchableOpacity
                onPress={() => amountHandler('minus')}
                style={{ width: 36, backgroundColor: theme[mode].cancelBtnbgcolor, alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
                <Minus width={20} color={theme[mode].chartTextBlack} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <TextInput
                    style={{
                        width: '100%',
                        paddingTop: 0,
                        paddingBottom: 0,
                        textAlign: "center",
                        color: theme[mode].textblack,
                        fontSize: 12
                    }}
                    textAlign="center"
                    placeholder={placeholder}
                    placeholderTextColor={theme[mode].theadgray}
                    autoCorrect={false}
                    keyboardType={Platform.OS === "android" ? "number-pad" : "numbers-and-punctuation"}
                    autoCompleteType='off'
                    value={amount.toString()}
                    onChangeText={text => amountInput(text.replace(/[^0-9.]/g, ''))}
                    onFocus={() => setPlaceHolder('')}
                    onBlur={() => setPlaceHolder(I18n.t('protrade.makeanorder.amount', { locale: language }) + ' (' + myplaceholder.toUpperCase() + ')')} />
            </View>
            <TouchableOpacity
                onPress={() => amountHandler('plus')}
                style={{ width: 36, backgroundColor: theme[mode].cancelBtnbgcolor, alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
                <Plus width={20} color={theme[mode].chartTextBlack} />
            </TouchableOpacity>
        </View>
    )
}

export function RateButtons({ calculator }) {
    const { state: { mode } } = useContext(ThemeContext);
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <TouchableOpacity
                onPress={() => calculator(0.25)}
                style={{
                    width: 36,
                    height: 24,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0.5,
                    borderColor: theme[mode].inputbordercolor
                    //...theme.littleBtnshadow
                }}>
                <Text style={{ color: theme[mode].textblack, fontSize: 10 }}>25%</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => calculator(0.50)}
                style={{
                    width: 36,
                    height: 24,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0.5,
                    borderColor: theme[mode].inputbordercolor
                    //...theme.littleBtnshadow
                }}>
                <Text style={{ color: theme[mode].textblack, fontSize: 10 }}>50%</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => calculator(0.75)}
                style={{
                    width: 36,
                    height: 24,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0.5,
                    borderColor: theme[mode].inputbordercolor
                    //...theme.littleBtnshadow
                }}>
                <Text style={{ color: theme[mode].textblack, fontSize: 10 }}>75%</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => calculator(1)}
                style={{
                    width: 36,
                    height: 24,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0.5,
                    borderColor: theme[mode].inputbordercolor
                    //...theme.littleBtnshadow
                }}>
                <Text style={{ color: theme[mode].textblack, fontSize: 10 }}>100%</Text>
            </TouchableOpacity>
        </View>
    )
}


const setStyle = mode => ({
    tradeBtns: {
        flex: 1,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 3
    },
    tradeActive: {
        backgroundColor: theme[mode].lightblue,
    },
    tradePassive: {
        backgroundColor: theme[mode].btnActiveColor,
        borderWidth: 0.5,
        borderColor: theme[mode].inputbordercolor
    },
    tradeactiveText: {
        color: theme[mode].white
    },
    tradepassiveText: {
        color: theme[mode].chartTextBlack
    },

    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 3
    },
    tradeBtns: {
        flex: 1,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 3
    },

    tradeActive: {
        backgroundColor: theme[mode].lightblue,
    },
    tradePassive: {
        backgroundColor: theme[mode].btnActiveColor,
        borderWidth: 0.5,
        borderColor: theme[mode].inputbordercolor
    },

    btnText: {
        fontSize: 12,
    },


})
