import AsyncStorage from '@react-native-async-storage/async-storage';
import ornekappApi from '../api/ornekappApi'

const MARKET_URL = '/trade/public/markets';
const TICKER_URL = '/platform/public/markets/tickers';
const CURRENCIES_URL = '/platform/public/currencies';
const BALANCE_URL = '/platform/account/balances';

// ___________________________________ GET LOGIN ACTIVITY ______________________________________________________________
// auth needed!
export const _getLoginActivityData = async () => {
    // Login Activity state
    try {
        const response = await ornekappApi.get('/auth/resource/users/activity/all?limit=7&page=1')
        return response.data
    } catch (error) {
        console.log('error _getLoginActivityData : ', error)
        return []
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

const imgNullCheck = data => {
    var source = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/icon/btc.svg';
    try {
        var imgVar = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/icon/' + data + '.svg';
        if (imgVar) {
            source = imgVar;
        }
    } catch { }
    return source;
};

// _________________________________________________ GET WALLET LIST - SOKET GEREKLİ Mİ? ___________________________________________________
// auth needed!
export const _getWalletList = async () => {
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
            deposit_address: '',
        };
        let wallet = []
        let totalTL = []
        let change_24h = [];
        let btc_price = 0
        currenciesResponse.data.map(async (currency, index) => {
            let balance_index = balanceResponse.data.findIndex(x => x.currency === currency.id);
            if (currency.id == 'try') {
                wallet[index] = {
                    id: currency.id,
                    title: currency.id.toUpperCase() + " (" + currency.name + ")",
                    svg: null,
                    price: 1,
                    deposit_enabled: currency.deposit_enabled,
                    withdrawal_enabled: currency.withdrawal_enabled,
                    balance: decimalInt((balanceResponse.data[balance_index] || defaultTicker).balance, 3)
                };
                change_24h[index] = decimalInt((balanceResponse.data[balance_index] || defaultTicker).change_24h, 3)
                totalTL[index] = decimalInt((balanceResponse.data[balance_index] || defaultTicker).balance, 3)
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
                    svg: imgNullCheck(currency.id),
                    price: (tickerResponse.data[market_id].ticker || defaultTicker).last,
                    balance: waletbalanceMin,
                    deposites: (balanceResponse.data[balance_index] || defaultTicker).deposit_address,
                };
                change_24h[index] = decimalInt((balanceResponse.data[balance_index] || defaultTicker).change_24h * (tickerResponse.data[market_id].ticker || defaultTicker).last, marketResponse.data[market_index].price_precision)
                totalTL[index] = decimalInt(waletbalanceMin * (tickerResponse.data[market_id].ticker || defaultTicker).last, marketResponse.data[market_index].price_precision)
            }

        })
        let total = 0
        let total_24h = 0
        let total_24h_percent = 0;
        change_24h.map(async (item) => {
            total_24h += parseFloat(item)
        })

        totalTL.map(async (item) => {
            total += parseFloat(item)
        })


        total_24h_percent = ((total + total_24h) - total) / total * 100;
        return ({ walletTL: total, walletBTC: (total / btc_price), walletList: wallet.sort((a, b) => b.balance - a.balance), total_24h: total_24h, total_24h_percent: total_24h_percent })
    } catch (error) {
        console.log('network hatası _getWalletList: ', error.message);
        return []
    }
}

// ______________________________________________ Two Factor Enable Disablet GetQR ________________________________________________________________
// Two Factor Enable Disablet GetQR!
export const _twoFactorOTPEnabledDisabled = async (enable, code) => {
    var responseData = "";

    const token = await AsyncStorage.getItem('TOKEN');
    var url = "";
    var data = {}
    if (enable == true && code != null) {
        url = "/auth/resource/otp/disable";
        data = { code };
    }
    else if (enable == false && code != null) {
        url = "/auth/resource/otp/enable";
        data = { code };
    } else {
        url = "/auth/resource/otp/generate_qrcode";
        data = null;
    }
    const headers = { 'x-csrf-token': token }
    await ornekappApi.post(url, data != null && JSON.stringify(data), {
        headers: headers
    }).then((response) => {
        responseData = response.data
    })
        .catch(({ response }) => {
            responseData = response.data
        })

    return responseData

}


// ______________________________________________ Phone Pin Code ________________________________________________________________
// Phone Pin Code!
export const _phoneVerify = async (phone_number, verification_code) => {
    var responseData = "";

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


// ______________________________________________ Password  Set ________________________________________________________________
// Password  Set!
export const _passwordSetNew = async (old_password, new_password) => {
    var responseData = "";

    const token = await AsyncStorage.getItem('TOKEN');
    var url = "";
    var data = {}

    url = "/auth/resource/users/password";
    data = { old_password, new_password, confirm_password: new_password };


    const headers = { 'x-csrf-token': token }
    await ornekappApi.put(url, JSON.stringify(data), {
        headers: headers
    }).then((response) => {
        responseData = response.data
    })
        .catch(({ response }) => {
            responseData = response.data
        })

    return responseData

}

// ______________________________________________ Profil Setting  ________________________________________________________________
// Profil Setting!
export const _profilSetNew = async (obje) => {
    var responseData = "";
    const token = await AsyncStorage.getItem("TOKEN");
    var url = "/auth/resource/profiles";
    const headers = { 'x-csrf-token': token }

    await ornekappApi.post(url, obje, {
        headers: headers
    }).then((response) => {
        responseData = response.data
    })
        .catch(({ response }) => {
            responseData = response.data
        })
    return responseData

}

// ______________________________________________ Profil Setting  ________________________________________________________________
// Profil Setting!
export const _verifyIdentity = async (request) => {
    var responseData = "";
    const token = await AsyncStorage.getItem("TOKEN");
    var url = "/auth/resource/documents";
    const headers = { 'x-csrf-token': token, 'Content-Type': 'multipart/form-data;' }
    await ornekappApi.post(url, request, {
        headers: headers,

    }).then((response) => {
        responseData = response.data
    })
        .catch(({ response }) => {
            responseData = response


        })
    return responseData

}

// ______________________________________________ Profil Setting  ________________________________________________________________
// Profil Setting!
export const _verifyAddress = async (request) => {
    var responseData = "";
    const token = await AsyncStorage.getItem("TOKEN");
    var url = "/auth/resource/addresses";
    const headers = { 'x-csrf-token': token, 'Content-Type': 'multipart/form-data;' }
    await ornekappApi.post(url, request, {
        headers: headers,

    }).then((response) => {
        responseData = response.data
    })
        .catch(({ response }) => {
            responseData = response


        })
    return responseData

}