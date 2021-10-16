
import createContext from './createContext';
import ornekappApi from '../api/ornekappApi'
import AsyncStorage from '@react-native-async-storage/async-storage';

let ws;
// let newMarketList = []
// let newasks = []
// let newbids = []

const proTradeReducer = (state, action) => {
    switch (action.type) {
        case 'MARKET_DETAIL':
            return { ...state, marketDetails: action.payload };
        case 'SET_ASKS':
            return { ...state, asks: action.payload };
        case 'SET_BIDS':
            return { ...state, bids: action.payload };
        case 'TRADES':
            return { ...state, pairTrades: action.payload };
        case 'CLEAR':
            return { ...state, marketDetails: action.payload };
        case 'CLEARDATA':
            return { ...state, asks: [], bids: [] };
        default:
            return state;
    }
};


const _startWebSocket = dispatch => async () => {
    let newMarketList = []
    let newasks = []
    let newbids = []
    const currentMarket = await AsyncStorage.getItem('CURRENT_MARKET')
    //console.log("currentMarket: ", currentMarket)
    //console.log("connecting...")
    let askcounter = 0;
    let bidcounter = 0;
    const SOCKET_URL = 'wss://ornekapp.com/api/v2/ws/public/?stream=balances&stream=deposit_address&stream=global.tickers&stream=order&stream=trade&stream=' + currentMarket + '.kline-15m&stream=' + currentMarket + '.ob-inc&stream=' + currentMarket + '.trades';
    //const SOCKET_URL = 'wss://ornekapp.com/api/v2/ws/public/?stream=balances&stream=deposit_address&stream=global.tickers&stream=order&stream=trade&stream=usdttry.kline-15m&stream=usdttry.ob-inc&stream=usdttry.trades';
    ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
        //console.log("opening...")
        while (ws.readyState == 0) return
        ws.send(
            JSON.stringify({
                type: 'subscribe',
                product_ids: ['ETH-USD', 'ETH-EUR'],
                channels: ['ticker'],
            }),
        );
    }

    ws.onmessage = e => {
        const response = JSON.parse(e.data);
        //console.log("socket data:", response)

        // DATA DEĞİŞMİŞSE _________________________________________________________________________________
        if (response['global.tickers']) {
            //console.log("currentMarket: ", currentMarket)
            newMarketList = {
                'id': currentMarket,
                'last': response['global.tickers'][currentMarket]['last'],
                'high': response['global.tickers'][currentMarket]['high'],
                'low': response['global.tickers'][currentMarket]['low'],
                'percentage': response['global.tickers'][currentMarket]['price_change_percent'],
                'volume': response['global.tickers'][currentMarket]['volume']
            }
            //console.log('ws: ', item.id, " : ", response['global.tickers'][currentMarket]['last'])
            dispatch({ type: 'MARKET_DETAIL', payload: newMarketList })
        }
        //_____________________________________________________________________________________________________
        if (response[currentMarket + ".ob-snap"]) {
            response[currentMarket + ".ob-snap"]["asks"].map((item, index) => {
                newasks[index] = {
                    id: item[0],
                    price: item[0],
                    amount: item[1]
                }
            })

            newasks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
            dispatch({ type: 'SET_ASKS', payload: newasks.slice(0, 15) })

            response[currentMarket + ".ob-snap"]["bids"].map((item, index) => {
                newbids[index] = {
                    id: item[0],
                    price: item[0],
                    amount: item[1]
                }
            })
            newbids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
            dispatch({ type: 'SET_BIDS', payload: newbids.slice(0, 15) })
        }
        //______________________________________________________________________________________________________________________
        if (response[currentMarket + '.trades']) {
            _getPairTradeHistory()
        }
        //______________________________________________________________________________________________________________________
        if (response[currentMarket + '.ob-inc']) {

            if (response[currentMarket + '.ob-inc']['asks']) { //asks*****

                askcounter++;
                //console.log("askcounter:", askcounter)
                //console.log("asks: ", response[currentMarket + '.ob-inc']['asks'])
                const data = response[currentMarket + '.ob-inc']['asks']
                if (newasks.length > 0) {

                    //console.log('asks loaded:', data)
                    let tempAsks = newasks
                    let index = tempAsks.findIndex(x => x.price === data[0]);
                    if (index === -1) {
                        //console.log('push', data[0])
                        tempAsks.push({
                            id: data[0],
                            price: data[0],
                            amount: data[1]
                        })
                        //console.log('Asks: ',tempAsks)
                    } else {
                        if (data[1].length > 1) {
                            tempAsks[index]['amount'] = data[1]
                        } else {
                            tempAsks.splice(index, 1);
                        }
                    }
                    tempAsks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                    //console.log('asks: ', tempAsks.slice(0, 15))
                    if (askcounter == 10) {
                        dispatch({ type: 'SET_ASKS', payload: tempAsks.slice(0, 15) })
                        //console.log("asks güncellendi...")
                    }
                    // console.log('index: ',index)
                } else {
                    //console.log("newask giremedi")
                }
            }

            if (response[currentMarket + '.ob-inc']['bids']) { //bids *****
                const data = response[currentMarket + '.ob-inc']['bids']
                bidcounter++
                //console.log("bidcounter: ", bidcounter)
                if (newbids.length > 0) {
                    //console.log('bids loaded: ', data)
                    let tempBids = newbids
                    let index = tempBids.findIndex(x => x.price === data[0]);
                    if (index === -1) {
                        //console.log('push', data[0])
                        tempBids.push({
                            id: data[0],
                            price: data[0],
                            amount: data[1]
                        })
                        //console.log('Bids: ',bids)
                    } else {
                        if (JSON.stringify(data[1]).length > 2) {
                            tempBids[index]['amount'] = data[1]
                        } else {
                            tempBids.splice(index, 1);
                        }
                    }
                    tempBids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                    //console.log('bids: ', tempBids.slice(0, 15))
                    if (bidcounter == 10) {
                        dispatch({ type: 'SET_BIDS', payload: tempBids.slice(0, 15) })
                        //console.log("bids güncellendi...")
                    }
                    // console.log('index: ',index)
                } else {
                    //console.log("newbid boş")
                }
            }
        }
        if (askcounter == 10) { askcounter = 0 }
        if (bidcounter == 10) { bidcounter = 0 }
    };

    ws.onclose = e => {
        console.log('protradesocket closed and moved to the trash...');
        if (ws) {
            ws.close()
            ws = null
        }
        askcounter = 0;
        bidcounter = 0;
    };

    ws.onerror = (e) => {
        console.log(`ProtradeContext Socket Error: ${e} - ${e.message}`);
        askcounter = 0;
        bidcounter = 0;
    };
};

const _closeSocket = dispatch => () => {
    console.log("closing protrade socket on ProTradeContext...")
    if (ws) {
        ws.close()
        ws = null
    }
    //dispatch({ type: 'CLEARDATA', payload: true })
}



const _getPairTradeHistory = dispatch => async () => {
    while (true) {
        try {
            const TRADE_HISTORY_URL = `/platform/public/markets/usdttry/trades`
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
            dispatch({ type: 'TRADES', payload: newTrades })
            break

        } catch (error) {
            console.log("_getPairTradeHistory network error: ", error)
            continue
        }
    }

}





// __________________________________________________________________________________________________
export const { Provider, Context } = createContext(
    proTradeReducer,
    { _startWebSocket, _getPairTradeHistory, _closeSocket },
    { marketDetails: [], asks: [], bids: [], pairTrades: [], },
);





/*
import React, { useState } from 'react';
import ornekappApi from '../api/ornekappApi'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProTradeContext = React.createContext();

export const ProTradeProvider = ({ children }) => {
    const [marketDetails, setMarketDetails] = useState([])
    const [asks, setAsks] = useState([])
    const [bids, setBids] = useState([])
    const [pairTrades, setPairTrades] = useState([])

    const _startWebSocket = async () => {
        let newMarketList = []
        let newasks = []
        let newbids = []
        let askcounter = 0;
        let bidcounter = 0;

        const currentMarket = await AsyncStorage.getItem('CURRENT_MARKET')
        console.log("currentMarket: ", currentMarket)

        const SOCKET_URL = 'wss://ornekapp.com/api/v2/ws/public/?stream=balances&stream=deposit_address&stream=global.tickers&stream=order&stream=trade&stream=' + currentMarket + '.kline-15m&stream=' + currentMarket + '.ob-inc&stream=' + currentMarket + '.trades';
        let ws = new WebSocket(SOCKET_URL);

        ws.onopen = () => {
            console.log("protrade socket state", ws.readyState)
            while (ws.readyState == 0) return
            ws.send(
                JSON.stringify({
                    type: 'subscribe',
                    product_ids: ['ETH-USD', 'ETH-EUR'],
                    channels: ['ticker'],
                }),
            );
        }

        ws.onmessage = e => {
            const response = JSON.parse(e.data);
            //console.log("socket data:", response)

            // DATA DEĞİŞMİŞSE _________________________________________________________________________________
            if (response['global.tickers']) {
                //console.log("currentMarket: ", currentMarket)
                newMarketList = {
                    'id': currentMarket,
                    'last': response['global.tickers'][currentMarket]['last'],
                    'high': response['global.tickers'][currentMarket]['high'],
                    'low': response['global.tickers'][currentMarket]['low'],
                    'percentage': response['global.tickers'][currentMarket]['price_change_percent'],
                    'volume': response['global.tickers'][currentMarket]['volume']
                }
                //console.log('ws: ', item.id, " : ", response['global.tickers'][currentMarket]['last'])
                console.log("MarketList: ", newMarketList)
                setMarketDetails(newMarketList)
            }
            //_____________________________________________________________________________________________________
            if (response[currentMarket + ".ob-snap"]) {
                response[currentMarket + ".ob-snap"]["asks"].map((item, index) => {
                    newasks[index] = {
                        id: item[0],
                        price: item[0],
                        amount: item[1]
                    }
                })

                newasks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                setAsks(newasks.slice(0, 15))

                response[currentMarket + ".ob-snap"]["bids"].map((item, index) => {
                    newbids[index] = {
                        id: item[0],
                        price: item[0],
                        amount: item[1]
                    }
                })
                newbids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                setBids(newbids.slice(0, 15))
            }
            //______________________________________________________________________________________________________________________
            if (response[currentMarket + '.trades']) {
                _getPairTradeHistory()
            }
            //______________________________________________________________________________________________________________________
            if (response[currentMarket + '.ob-inc']) {

                if (response[currentMarket + '.ob-inc']['asks']) { //asks*****
                    askcounter++;
                    //console.log("askcounter: ", askcounter)
                    const data = response[currentMarket + '.ob-inc']['asks']
                    if (newasks.length > 0) {

                        //console.log('asks loaded:', data)
                        let tempAsks = newasks
                        let index = tempAsks.findIndex(x => x.price === data[0]);
                        if (index === -1) {
                            //console.log('push', data[0])
                            tempAsks.push({
                                id: data[0],
                                price: data[0],
                                amount: data[1]
                            })
                            //console.log('Asks: ',tempAsks)
                        } else {
                            if (data[1].length > 1) {
                                tempAsks[index]['amount'] = data[1]
                            } else {
                                tempAsks.splice(index, 1);
                            }
                        }
                        tempAsks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                        // console.log('data: ',data)
                        if (askcounter == 10) {
                            setAsks(tempAsks.slice(0, 15))
                            //console.log("asks güncellendi...")
                        }
                        // console.log('index: ',index)
                    } else {
                        //console.log("newask giremedi")
                    }
                }

                if (response[currentMarket + '.ob-inc']['bids']) { //bids *****
                    const data = response[currentMarket + '.ob-inc']['bids']
                    bidcounter++
                    //console.log("bidcounter: ", bidcounter)
                    if (newbids.length > 0) {
                        //console.log('bids loaded: ', data)
                        let tempBids = newbids
                        let index = tempBids.findIndex(x => x.price === data[0]);
                        if (index === -1) {
                            //console.log('push', data[0])
                            tempBids.push({
                                id: data[0],
                                price: data[0],
                                amount: data[1]
                            })
                            //console.log('Bids: ',bids)
                        } else {
                            if (JSON.stringify(data[1]).length > 2) {
                                tempBids[index]['amount'] = data[1]
                            } else {
                                tempBids.splice(index, 1);
                            }
                        }
                        tempBids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                        //console.log('bids: ',tempBids)
                        if (bidcounter == 10) {
                            setBids(tempBids.slice(0, 15))
                            //console.log("bids güncellendi...")
                        }
                        // console.log('index: ',index)
                    } else {
                        //console.log("newbid boş")
                    }
                }
            }
            if (askcounter == 10) { askcounter = 0 }
            if (bidcounter == 10) { bidcounter = 0 }
        };

        ws.onclose = e => {
            console.log('socket closed and moved to the trash...');
            if (ws) {
                ws.close()
                ws = null
            }
            askcounter = 0;
            bidcounter = 0;
        };

        ws.onerror = (e) => {
            console.log(`ProtradeContext Socket Error: ${e} - ${e.message}`);
            askcounter = 0;
            bidcounter = 0;
            setTimeout(_startWebSocket(), 5000)
        };
    };

    const _closeSocket = () => {
        console.log("closing protrade socket on ProTradeContext...")
        if (ws) {
            ws.close()
            ws = null
        }
        setAsks([])
        setBids([])
    }

    const _getPairTradeHistory = async () => {
        while (true) {
            try {
                const TRADE_HISTORY_URL = `/platform/public/markets/usdttry/trades`
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
                console.log("_getPairTradeHistory network error: ", error)
                continue
            }
        }

    }


    return (
        <ProTradeContext.Provider
            value={{
                marketDetails,
                asks,
                bids,
                pairTrades,
                _startWebSocket,
                _closeSocket,
                _getPairTradeHistory
            }}>
            {children}
        </ProTradeContext.Provider>
    );
};


*/