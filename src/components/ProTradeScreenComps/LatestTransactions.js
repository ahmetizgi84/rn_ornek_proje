import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";

// Pure Components, shouldComponentUpdate => Class based components
// React.memo, useMemo, useCallback => Functional components

/**
 * Memoization:
 * İhtiyaç duyulan bir değerin sürekli olarak hesaplanması
 * yerine bir kere hesaplanıp ihtiyaç duyulduğunda 
 * bu değerin yeniden kullanılması kullanılmasına verilen addır
 */

import { TabButtons, TransactionsTable } from '../ProTradeScreenComps';

import { Context as ProTradeContext } from '../../context/ProTradeContext';
import useSessionConfirm from '../../middlewares/useSessionConfirm'
import ornekappApi from '../../api/ornekappApi'

function LatestTransactions({ item }) {
    const { state: { pairTrades }, _getPairTradeHistory } = useContext(ProTradeContext)
    const [durum, setDurum] = useState(1)
    const [yourTrades, setYourTrades] = useState([])
    const [checkForSession] = useSessionConfirm();

    const getYourTradeHistory = async () => {
        const session = await checkForSession()
        if (session) {
            let counter = 5
            while (true) {
                try {
                    let yesterday = Math.round((new Date()).getTime() / 1000) - 86400;
                    const TRADE_HISTORY_URL = `platform/market/trades?page=1&time_from=${yesterday}&market=${item.id}`
                    const tradeResponse = await ornekappApi.get(TRADE_HISTORY_URL)
                    //console.log(Object.keys(tradeResponse));
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
                        console.log("getYourTradeHistory network error: ", error.response.data.errors)
                        break
                    }
                    counter--
                    continue
                }
            }
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            _getPairTradeHistory();
            getYourTradeHistory();
        }, [])
    );

    return (
        <View>
            <TabButtons callback={setDurum} state={durum} />

            {
                durum === 1 ? <TransactionsTable transactions={pairTrades} /> : <TransactionsTable transactions={yourTrades} />
            }

        </View>
    )
}


export default LatestTransactions