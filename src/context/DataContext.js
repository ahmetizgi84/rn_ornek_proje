import React, { useState } from 'react';
import * as RootNavigation from '../RootNavigation';
import ornekappApi from '../api/ornekappApi'

import { callToast } from '../components/Toast';

import useSessionConfirm from '../middlewares/useSessionConfirm'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DEPOSIT_URL = `/platform/account/deposits?page=1&limit=25`
const WITHDRAW_URL = `/platform/account/withdraws?page=1&limit=25`

const MARKET_URL = '/trade/public/markets';
const ORDER_URL = '/platform/market/orders?page=1&limit=25&state=wait';

const TICKER_URL = '/platform/public/markets/tickers';
const CURRENCIES_URL = '/platform/public/currencies';
const BALANCE_URL = '/platform/account/balances';
const DEPOSITE_OLUSTURMA_URL = '/platform/account/deposit_address';


export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
    const [checkForSession] = useSessionConfirm();

    // Login Activity state
    const [activityData, setActivityData] = useState([])

    //Trade History states...
    const [trades, setTrades] = useState([])

    // Transaction History States...
    const [deposits, setDeposits] = useState([])
    const [withdraws, setWithdraws] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    // Orders states
    const [orders, setOrders] = useState([])
    const [orderList, setOrderList] = useState([])
    const [filtered, setFiltered] = useState([])

    // wallet states
    const [walletTL, setWalletTL] = useState(0)
    const [walletBTC, setWalletBTC] = useState(0)
    const [walletList, setWalletList] = useState([])

    //balance
    const [balance, setBalance] = useState([])

    // Toast Message...
    const [toastMessage, setToastMessage] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [cancelIsProcessing, setCancelIsProcessing] = useState(false)


    //________________________________________________ LOGOUT SONRASI WALLET BİLGİLERİNİ TEMİZLE _______________________________________________________________
    const _clearWalletData = () => {
        setWalletTL(0)
        setWalletBTC(0);
        setWalletList([])
        setBalance([])
        setActivityData([])
        setTrades([])
        setDeposits([])
        setWithdraws([])
        setOrders([])
        setOrderList([])
        setFiltered([])
    }

    // ______________________________________________ KOLAY AL SAT EKRANI - SOKET GEREKİYOR _________________________________________________________________________
    // auth needed!
    const _easyTradeHandler = async (amount, pair, tradeState, choosed) => {
        if (amount > 0) {
            const session = await checkForSession()
            if (!session) {
                RootNavigation.navigate('LoginScreen');
            } else {
                let balanceMount = 0;
                let total_amount = 0;
                var index;
                let side = '';
                let send_order = false;
                try {
                    const { data } = await ornekappApi.get(BALANCE_URL)
                    // data gelmeyince balance yetersiz olduğu anlamına mı geliyor?
                    if (data.length > 0) {
                        //if (balance.length > 0) {
                        if (tradeState == 1) {
                            //index = balance.findIndex(x => x.currency === 'try');
                            index = data.findIndex(x => x.currency === 'try');
                            //balanceMount = parseInt(balance[index].balance, 10);
                            balanceMount = parseFloat(data[index].balance, 10);
                            total_amount = amount * choosed.price
                            if (total_amount <= balanceMount) {
                                send_order = true
                            }
                            side = 'buy';
                        } else {
                            //index = balance.findIndex(x => x.currency === choosed.subtitle);
                            index = data.findIndex(x => x.currency === choosed.subtitle);
                            //balanceMount = parseInt(balance[index].balance, 10);
                            balanceMount = parseFloat(data[index].balance, 10);
                            if (amount <= balanceMount) {
                                send_order = true
                            }
                            side = 'sell';
                        }
                        if (send_order === true) {
                            const order = {
                                amount: amount,
                                market: pair,
                                side: side,
                                type: "market",
                            }
                            _createOrder(order);
                        } else {
                            toastMessageHandler('order_balance_zero')
                            setIsProcessing(false)
                        }
                    } else {
                        toastMessageHandler('order_balance_zero')
                        setIsProcessing(false)
                    }

                } catch (error) {
                    console.log("cannot get balance in _easyTradeHandler ", error)
                    setIsProcessing(false)
                }
            }
        } else {
            toastMessageHandler('order_amount_zero')
            setIsProcessing(false)
        }
    }

    // auth needed!
    const _createOrder = async (order) => {
        const session = await checkForSession()
        if (!session) {
            RootNavigation.navigate('LoginScreen');
        } else {
            const token = await AsyncStorage.getItem('TOKEN');
            const CREATE_ORDER_URL = '/trade/market/orders';
            //const CREATE_ORDER_URL = 'https://ornekapp.com/api/v2/trade/market/orders';
            const headers = { 'x-csrf-token': token }
            let tryout = 5
            while (true) {
                try {
                    const { data } = await ornekappApi.post(CREATE_ORDER_URL, order, { headers })
                    if (data) {
                        _getBalance();
                        toastMessageHandler('order_success')
                        setIsProcessing(false)
                    }
                    break

                } catch (error) {
                    console.log("tryout: ", tryout)
                    console.log('error', error.response)
                    if (tryout == 0) {
                        setBalance([])
                        setIsProcessing(false)
                        console.log("create order network error: ", error.response)
                        toastMessageHandler('order_network_error')
                        break
                    }
                    tryout--
                    continue
                }
            }
        }

    }

    const toastMessageHandler = (message) => {
        setToastMessage(message);
        callToast();
        setTimeout(() => {
            setToastMessage(null)
        }, 5000)
    }

    // __________________________________________________ PRO TRADE EKRANI - SOKET GEREKİYOR _____________________________________________________________________
    // auth needed!
    const _proTradeHandler = async (amount, price, pair, isActive, choosed) => {
        if (amount > 0) {
            const session = await checkForSession()
            if (!session) {
                RootNavigation.navigate('LoginScreen');
            } else {
                let balanceMount = 0;
                let total_amount = 0;
                var index;
                let side = '';
                let send_order = false;
                try {
                    const { data } = await ornekappApi.get(BALANCE_URL)
                    if (data.length > 0) {
                        if (isActive) {
                            index = data.findIndex(x => x.currency === 'try');
                            amount = decimalInt(amount, 2)
                            balanceMount = decimalInt(data[index].balance, 3);
                            total_amount = amount * price
                            if (parseFloat(total_amount) <= parseFloat(balanceMount)) {
                                send_order = true
                            }
                            side = 'buy';
                        } else {
                            index = data.findIndex(x => x.currency === choosed.subtitle);
                            amount = decimalInt(amount, choosed.amount_precision);
                            balanceMount = decimalInt(data[index].balance, choosed.amount_precision);
                            if (parseFloat(amount) <= parseFloat(balanceMount)) {
                                send_order = true
                            }
                            side = 'sell';
                        }
                        if (send_order === true) {
                            const order = {
                                amount: amount,
                                market: pair,
                                price: price,
                                side: side,
                                type: "limit",
                            }
                            _createOrder(order);
                        } else {
                            toastMessageHandler('order_balance_zero')
                            setIsProcessing(false)
                        }
                    } else {
                        toastMessageHandler('order_balance_zero')
                        setIsProcessing(false)
                    }
                } catch (error) {
                    console.log("cannot get balance in _proTradeHandler ", error)
                    setIsProcessing(false)
                }
            }
        } else {
            toastMessageHandler('order_amount_zero')
            setIsProcessing(false)
        }
    }

    // __________________________________________________ BALANCE - Kalacak  ___________________________________________________________________________________________
    // auth needed!
    const _getBalance = async () => {
        const session = await checkForSession()
        if (session) { // token varsa session hala geçerli
            let counter = 5;
            while (true) {
                try {
                    const balanceResponse = await ornekappApi.get(BALANCE_URL)
                    setBalance([...balanceResponse.data])
                    break

                } catch (error) {
                    console.log("counter: ", counter)
                    if (counter == 0) {
                        setBalance([])
                        console.log("balance load network error: ", error)
                        break
                    }
                    counter--
                    continue
                }
            }
        }
    }

    // _______________________________________________________________________________________________________________________________________________

    const _adresCryptoOlustur = async (data) => {
        //  while (true) {
        try {
            const adresResponse = await ornekappApi.get(DEPOSITE_OLUSTURMA_URL + "/" + data);
            let tempAdres = adresResponse.data;
            // break
        } catch (error) {
            console.log('fn _adresOlustur: ', error.message);
            // continue
        }
        //  }
    }


    // ___________________________________ GET LOGIN ACTIVITY ______________________________________________________________
    // auth needed!
    const _getLoginActivityData = async () => {
        setIsProcessing(true)
        const session = await checkForSession()
        if (session) { // session varsa giriş-çıkış hareketlerini getir
            let counter = 5;
            while (true) {
                try {
                    const response = await ornekappApi.get('/auth/resource/users/activity/all?limit=7&page=1')
                    setActivityData(response.data)
                    setIsProcessing(false)
                    break
                } catch (error) {
                    if (counter == 0) {
                        console.log('error _getLoginActivityData : ', error)
                        toastMessageHandler('cannot_get_loginactivitydata')
                        setIsProcessing(false)
                        break
                    }
                    counter--
                    continue
                }
            }
        } else {
            // Giriş sayfasına yönlendirme yapılabilir veya toast göster
        }
    }


    // ___________________________________________________ TRADE HISTORY ________________________________________________________________________

    const _getTradeHistory = async () => {
        if (trades.length <= 0) {
            setIsProcessing(true)
            const session = await checkForSession()
            if (session) {
                let counter = 5
                while (true) {
                    try {
                        const TRADE_HISTORY_URL = `/platform/market/trades?page=1&limit=25`
                        const tradeResponse = await ornekappApi.get(TRADE_HISTORY_URL)
                        setTrades([...tradeResponse.data])
                        setIsProcessing(false)
                        break

                    } catch (error) {
                        if (counter == 0) {
                            if (error.response.data.errors[0] == 'market.trade.not_permitted') {
                                // Herhangi bir trade geçmişi yok
                                setIsProcessing(false)
                            } else {
                                console.log("trade history screen network error: ", error.response.data.errors[0])
                                toastMessageHandler('cannot_get_tradehistory')
                                setIsProcessing(false)
                            }
                            break
                        }
                        counter--
                        continue
                    }
                }
            }
        }
    }

    // auth needed!
    const _loadMoreTradeHistory = async () => {
        const session = await checkForSession()
        if (session) { // session geçerli daha fazla yükle
            try {
                setPage((page) => page + 1)
                const TRADE_HISTORY_URL = `/platform/market/trades?page=${page}&limit=25`
                const tradeResponse = await ornekappApi.get(TRADE_HISTORY_URL)
                setTrades([...trades, ...tradeResponse.data])
                if (tradeResponse.data.length < 25) {
                    setLoading(false)
                }

            } catch (error) {
                console.log("network error while loading more trade data :", error)
                setLoading(false)

            }

        }
    }


    // ___________________________________________________ TRANSACTION HISTORY ___________________________________________________________________
    const _getTransactionsHistory = async () => {
        if (deposits.length <= 0 && withdraws.length <= 0) {
            setIsProcessing(true)
            const session = await checkForSession()
            if (session) {
                let counter = 5;
                while (true) {
                    try {
                        const withdrawResponse = await ornekappApi.get(WITHDRAW_URL)
                        const depositResponse = await ornekappApi.get(DEPOSIT_URL)
                        //setWithdraws(withdrawResponse.data)
                        //setDeposits(depositResponse.data)
                        setWithdraws([...withdrawResponse.data])
                        setDeposits([...depositResponse.data])
                        setIsProcessing(false)
                        break
                    } catch (error) {
                        if (counter == 0) {
                            if (error.response.data.errors[0] == 'account.withdraw.not_permitted') {
                                setIsProcessing(false)
                            } else {
                                console.log("transaction history screen network error: ", error.response.data.errors[0])
                                toastMessageHandler('cannot_get_transactionhistory')
                            }
                            setIsProcessing(false)
                            break
                        }
                        counter--
                        continue
                    }
                }
            } else {
                RootNavigation.navigate('LoginScreen')
            }
        }
    }

    const _loadMoreTransactionHistory = async (sort) => {
        const session = await checkForSession()
        if (session) { // session geçerli daha fazla yükle
            while (true) {
                try {
                    setLoading(true)
                    setPage((prevPage) => prevPage + 1)
                    const TRANSACTION_HISTORY_URL = `/platform/account/${sort}?page=${page}&limit=25`
                    const response = await ornekappApi.get(TRANSACTION_HISTORY_URL)
                    if (sort === 'deposits') {
                        setDeposits([...deposits, ...response.data])
                        setLoading(false)
                    } else {
                        setWithdraws([...withdraws, response.data])
                        setLoading(false)
                    }
                    if (response.data.length < 25) {
                        setLoading(false)
                    }
                    break

                } catch (error) {
                    console.log("network error while loading more transaction data :", error)
                    setLoading(false)
                    continue
                }
            }
        } else {
            RootNavigation.navigate('LoginScreen')
        }
    }


    //________________________________________________________ TÜM EMİRLERİ GETİR _________________________________________________________________________________________________
    // auth needed!
    const _getOrders = async () => {
        const session = await checkForSession()
        if (session) { // token varsa session hala geçerli
            let counter = 5;
            while (true) {
                try {
                    const marketResponse = await ornekappApi.get(MARKET_URL);
                    const orderResponse = await ornekappApi.get(ORDER_URL);
                    let tempOrder = orderResponse.data;
                    let tempMarket = marketResponse.data;
                    tempOrder?.map((item) => {
                        let index = tempMarket.findIndex(x => x.id === item.market);
                        item.name = tempMarket[index].name;
                        item.amount_precision = tempMarket[index].amount_precision;
                    });
                    setOrders(tempOrder)
                    setOrderList(tempOrder)
                    break
                } catch (error) {
                    if (counter == 5) {
                        if (error.response.data.errors[0] == 'market.trade.not_permitted') {
                            // Herhangi bir order yok
                        } else {
                            console.log('no valid token in fn _getOrders: ', error.message);
                        }
                        break
                    }
                    counter--
                    continue
                }
            }
        } else {
            setOrders([])
            setOrderList([])
        }
    };

    // ______________________________________________ EMİR İPTALİ _________________________________________________________________________________________
    // auth needed!
    const _cancelOrder = async (id) => {
        setCancelIsProcessing(true)
        const session = await checkForSession()
        if (session) { // session varsa ancak o zaman siparişi iptal edebilirsin
            try {
                const response = await ornekappApi.post(`/trade/market/orders/cancel/${id}`)
                if (response.data.uuid) {
                    let filteredArray = orders.filter((order) => order.uuid !== id)
                    setOrders(filteredArray)
                    setOrderList(filteredArray)
                    toastMessageHandler('cancel_order_success')
                    await _getBalance()
                    await _getOrders();
                    setCancelIsProcessing(false)
                } else {
                    toastMessageHandler('cancel_order_failed')
                    setCancelIsProcessing(false)
                }
            } catch (error) {
                console.log("an error occured while cancel an order: ", error.response)
                toastMessageHandler('cancel_order_error')
                setCancelIsProcessing(false)
            }
        } else {
            toastMessageHandler('cancel_order_session_error')
            setCancelIsProcessing(false)
        }
    }

    const _getPairTradeHistory = async (currentMarket) => {
        const session = await checkForSession()
        if (session) {
            let counter = 5
            while (true) {
                try {
                    const TRADE_HISTORY_URL = `/platform/public/markets/` + currentMarket + `/trades`
                    const tradeResponse = await ornekappApi.get(TRADE_HISTORY_URL)
                    let newTrades = []
                    tradeResponse.data.map(async (item, index) => {
                        newTrades[index] = {
                            id: item.id,
                            created_at: item.created_at,
                            amount: item.amount,
                            price: item.price,
                            taker_type: item.taker_type,
                        }
                    })
                    setPairTrades(newTrades)
                    break

                } catch (error) {
                    if (counter == 0) {
                        console.log("trade history screen network error: ", error)
                        break
                    }
                    counter--
                    continue
                }
            }
        }
    }

    const _getYourTradeHistory = async (currentMarket) => {
        const session = await checkForSession()
        if (session) {
            let counter = 5;
            while (true) {
                try {
                    let yesterday = Math.round((new Date()).getTime() / 1000) - 86400;
                    const TRADE_HISTORY_URL = `/platform/market/trades?page=1&time_from=` + yesterday + `&market=` + currentMarket
                    const tradeResponse = await ornekappApi.get(TRADE_HISTORY_URL)
                    let newTrades = []
                    tradeResponse.data.map(async (item, index) => {
                        newTrades[index] = {
                            id: item.id,
                            created_at: item.created_at,
                            amount: item.amount,
                            price: item.price,
                            taker_type: item.taker_type,
                        }
                    })
                    setYourTrades(newTrades)
                    break

                } catch (error) {
                    if (counter == 0) {
                        console.log("trade your history screen network error: ", error)
                        break
                    }
                    counter--
                    continue
                }
            }
        }
    }


    // ______________________________________________ TABLODA EMİR ARA _________________________________________________________________________
    // search in a table
    const _searchOnOpenOrders = (searchText) => {
        let txt = searchText.toLowerCase();
        let filteredData = orders.filter(function (item) {
            return item.market.toLowerCase().includes(txt);
        });
        setFiltered(filteredData)
    }

    const _getTotalList = () => {
        setOrderList(orders)
    }

    const _getBuyList = () => {
        const buyorders = orders.filter(order => order.side === "buy")
        setOrderList(buyorders)
    }

    const _getSellList = () => {
        const sellorders = orders.filter(order => order.side === "sell")
        setOrderList(sellorders)
    }

    // ______________________________________________ Phone Pin Code ________________________________________________________________
    // Phone Pin Code!
    const _phoneVerify = async (phone_number, verification_code) => {
        const session = await checkForSession()
        var responseData = "";
        if (!session) {
            RootNavigation.navigate('LoginScreen');
        } else {
            const token = await AsyncStorage.getItem('TOKEN');
            var url = "";
            var data = {}
            if (verification_code == null) {
                url = "/auth/resource/phones";
                data = { phone_number };
            }
            else {
                url = "/auth/resource/phones/verify";
                data = { phone_number, verification_code };

            };
            const headers = { 'x-csrf-token': token }
            await ornekappApi.post(url, JSON.stringify(data), {
                headers: headers
            }).then((response) => {
                responseData = response.data.message
            })
                .catch(({ response }) => {
                    responseData = response.data.errors[0]
                })

            return responseData
        }
    }
    // ______________________________________________ Password Security Check  ________________________________________________________________
    // Password Security Check  !
    const _passwordSecurity = async (password) => {
        const session = await checkForSession()
        var responseData = "";
        if (!session) {
            RootNavigation.navigate('LoginScreen');
        } else {
            const token = await AsyncStorage.getItem('TOKEN');
            var url = "";
            var data = {}
            url = "/auth/identity/password/validate";
            data = { password };
            const headers = { 'x-csrf-token': token }
            await ornekappApi.post(url, JSON.stringify(data), {
                headers: headers
            }).then((response) => {
                responseData = response.data.entropy
            })
                .catch(({ response }) => {
                    responseData = response.data.errors[0]
                })

            return responseData
        }
    }

    // ______________________________________________ Password  Set ________________________________________________________________
    // Password  Set!
    const _passwordSetNew = async (old_password, new_password) => {
        const session = await checkForSession()
        var responseData = "";
        if (!session) {
            RootNavigation.navigate('LoginScreen');
        } else {
            const token = await AsyncStorage.getItem('TOKEN');
            var url = "";
            var data = {}

            url = "/auth/resource/users/password";
            data = { old_password, new_password, confirm_password: new_password };


            const headers = { 'x-csrf-token': token }
            console.log(JSON.stringify(data))
            await ornekappApi.post(url, JSON.stringify(data), {
                headers: headers
            }).then((response) => {
                responseData = response.data
            })
                .catch(({ response }) => {
                    responseData = response.data
                })

            return responseData
        }
    }

    // _________________________________________________ GET WALLET LIST - SOKET GEREKLİ Mİ? ___________________________________________________
    // auth needed!
    const _getWalletList = async () => {
        const session = await checkForSession()
        if (session) { // token varsa session hala geçerli işleme devam et
            let counter = 5
            while (true) {
                try {
                    const marketResponse = await ornekappApi.get(MARKET_URL);
                    const currenciesResponse = await ornekappApi.get(CURRENCIES_URL);
                    const balanceResponse = await ornekappApi.get(BALANCE_URL);
                    const tickerResponse = await ornekappApi.get(TICKER_URL);

                    const defaultTicker = {
                        id: 0,
                        name: '',
                        svg: '',
                        last: 1,
                        amount: 0,
                        balance: 0,
                        locked: 0,
                        deposit_address: '',
                    };
                    let wallet = []
                    let totalTL = []
                    let btc_price = 0
                    currenciesResponse.data.map(async (currency, index) => {
                        let balance_index = balanceResponse.data.findIndex(x => x.currency === currency.id);
                        if (currency.id == 'try') {
                            wallet[index] = {
                                id: currency.id,
                                title: currency.id.toUpperCase() + " (" + currency.name + ")",
                                svg: null,
                                price: 1,
                                withdraw_fee: currency.withdraw_fee,
                                type: currency.type,
                                min_withdraw_amount: currency.min_withdraw_amount,
                                deposit_enabled: currency.deposit_enabled,
                                withdrawal_enabled: currency.withdrawal_enabled,
                                balance: decimalInt((balanceResponse.data[balance_index] || defaultTicker).balance, 3),
                                locked: decimalInt((balanceResponse.data[balance_index] || defaultTicker).locked, 3)
                            };
                            totalTL[index] = decimalInt(parseFloat((balanceResponse.data[balance_index] || defaultTicker).balance) + parseFloat((balanceResponse.data[balance_index] || defaultTicker).locked), 3)
                        } else {
                            let market_index = marketResponse.data.findIndex(x => x.base_unit === currency.id);
                            let market_id = marketResponse.data[market_index].id
                            if (market_id == 'btctry') {
                                btc_price = tickerResponse.data[market_id].ticker.last
                            }
                            var waletbalanceMin = (balanceResponse.data[balance_index] || defaultTicker).balance >= marketResponse.data[market_index].min_amount ? (balanceResponse.data[balance_index] || defaultTicker).balance
                                : parseFloat(0).toFixed(marketResponse.data[market_index].price_precision);
                            wallet[index] = {
                                id: currency.id,
                                title: currency.id.toUpperCase() + " (" + currency.name + ")",
                                svg: currency.id,
                                price: (tickerResponse.data[market_id].ticker || defaultTicker).last,
                                balance: waletbalanceMin,
                                locked: (balanceResponse.data[balance_index] || defaultTicker).locked,
                                deposites: (balanceResponse.data[balance_index] || defaultTicker).deposit_address,
                            };
                            totalTL[index] = decimalInt((waletbalanceMin + parseFloat((balanceResponse.data[balance_index] || defaultTicker).locked)) * (tickerResponse.data[market_id].ticker || defaultTicker).last, marketResponse.data[market_index].price_precision)

                        }
                    })
                    setWalletList(wallet.sort((a, b) => b.balance - a.balance))
                    let total = 0
                    totalTL.map(async (item) => {
                        total += parseFloat(item)
                    })
                    setWalletTL(total)
                    setWalletBTC(total / btc_price)
                    break
                } catch (error) {
                    if (counter == 0) {
                        console.log('network hatası _getWalletList: ', error.message);
                        break
                    }
                    counter--
                    continue
                }
            }

        }
    }

    const decimalInt = (value, decimals) => {
        if (!value) {
            return '0'
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

    //________________________________________________________ SLIDER _________________________________________________________________________________________________
    const _imagesData = async () => {
        var respons = [];
        try {
            const instance = axios.create({
                timeout: 5000,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const sliderItems = await instance.get("https://ornekapp.com/sliderpanel/api/images");
            respons = sliderItems.data;
        } catch (error) {
            console.log("error : ", sliderItems)
            respons = []
        }
        return respons
    };


    //___________________________________________________________________________________________________________________________________________________________

    return (
        <DataContext.Provider
            value={{
                _imagesData,
                toastMessage,
                deposits,
                withdraws,
                loading,
                trades,
                activityData,
                balance,
                orders: orderList,
                filtered,
                walletTL,
                walletBTC,
                walletList,
                isProcessing,
                cancelIsProcessing,
                setIsProcessing,
                _clearWalletData,
                toastMessageHandler,
                _adresCryptoOlustur,
                _getBalance,
                _proTradeHandler,
                _easyTradeHandler,
                _getWalletList,
                setFiltered,
                _phoneVerify,
                _getTotalList,
                _getBuyList,
                _getSellList,
                _getOrders,
                _searchOnOpenOrders,
                _getLoginActivityData,
                _loadMoreTransactionHistory,
                _getTransactionsHistory,
                _getTradeHistory,
                _loadMoreTradeHistory,
                _cancelOrder,
                _getPairTradeHistory,
                _getYourTradeHistory,
                _passwordSetNew,
                _passwordSecurity
            }}>
            {children}
        </DataContext.Provider>
    );
};

