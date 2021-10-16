import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { VictoryVoronoiContainer, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native'
import I18n from '../../lang/_i18n'

import ornekappApi from '../../api/ornekappApi'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';

const dummyChartOptions = [
    {
        id: 15,
        label: "15m",
    },
    {
        id: 30,
        label: "30m",
    },
    {
        id: 60,
        label: "1h"
    },
    {
        id: 240,
        label: "4h"
    },
    {
        id: 1440,
        label: "1d"
    }
]


function GraphicsLine({ ...props }) {
    const { state: { mode, language } } = useContext(ThemeContext);
    const [chartOptions, setChartOptions] = useState(dummyChartOptions)
    const [loading, setLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState(chartOptions[2].id)
    const [graphData, setGraphData] = useState([])
    const [axisDegerleri, setAxisDegerleri] = useState([])


    /*
    const handleTime = (time) => {
        if (String(time).match(/[a-zA-Z]/i)) {
            var ds = time.toString();
            var tar = ds.replace('T', ' ')
            var tarih = tar.replace('+02:00', '')
        } else {
            var date = new Date((time + 10800) * 1000);
            var iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
            tarih = iso[2];
        }
        return tarih
    }
    */

    const _getKlines = async (period) => {
        setLoading(true)
        let sparkLineData = [];
        const BASE_URL = '/trade/public/markets/' + props.gelenMarket.id + '/k-line?period=' + period + '&limit=40';
        let counter = 5
        while (true) {
            try {
                const { data } = await ornekappApi.get(BASE_URL);
                if (data) {
                    data.map(dt => {
                        sparkLineData.push({ 'y': dt[4] });
                        //sparkLineData.push({ x: dt[0], open: dt[1], close: dt[4], high:dt[2], low: dt[3] },);
                    });
                    setSelectedOption(period)
                    setGraphData(sparkLineData)
                    _labelMinMax(sparkLineData)
                    setLoading(false)
                    break
                }

            } catch (error) {
                if (counter == 0) {
                    console.log("_getKLines network error: ", error)
                    break
                }
                counter--
                continue
            }

        }

    }

    const _labelMinMax = (dataArr) => {
        const data = dataArr.map(d => d.y);
        let minIndex = dataArr.findIndex(x => x.y === Math.min(...data));
        let maxIndex = dataArr.findIndex(x => x.y === Math.max(...data));
        setAxisDegerleri({
            'minIndex': minIndex,
            'min': Math.min(...data),
            'maxIndex': maxIndex,
            'max': Math.max(...data)
        })
    }

    useEffect(() => {
        _getKlines(selectedOption)
    }, [])

    return (
        <View>
            <View style={{
                alignItems: 'center',
                height: 350
            }}>
                {
                    loading ?
                        <View style={{ height: 350, justifyContent: 'center' }}>
                            <Text style={{ color: theme[mode].chartTextBlack, fontSize: 12, marginBottom: 5 }}>{I18n.t('graphLoading', { locale: language })}</Text>
                            <ActivityIndicator size="small" color={theme[mode].darkIndicatorColor} />
                        </View>
                        :
                        <VictoryChart
                            padding={{ top: 10, bottom: 10, left: 25, right: 25 }}
                            theme={VictoryTheme.material}
                            containerComponent={
                                <VictoryVoronoiContainer
                                    labels={({ datum }) => `${datum.y}`}
                                />
                            }
                        >
                            {
                                graphData.length > 0 &&
                                <VictoryLine
                                    style={{ data: { stroke: theme[mode].lightblue, strokeWidth: 3 } }}
                                    animate={{ duration: 500, onLoad: { duration: 250 } }}
                                    interpolation="basis"
                                    data={graphData}
                                />
                            }
                            <VictoryAxis
                                style={{
                                    grid: { stroke: "transparent" },
                                    axis: { stroke: "transparent" },
                                    ticks: { stroke: "transparent" },
                                    tickLabels: { fill: "transparent" }
                                }}
                            />
                        </VictoryChart>
                }
            </View>
            <View style={{
                marginTop: 15,
                flexDirection: 'row',
                justifyContent: "space-between"
            }}>
                {
                    chartOptions.map((option) => {
                        return (
                            <TouchableOpacity key={`option-${option.id}`}
                                onPress={() => _getKlines(option.id, option)}
                                style={{
                                    height: 30,
                                    width: 60,
                                    borderRadius: 15,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: selectedOption == option.id ? theme[mode].lightblue : theme[mode].cardbg
                                }}
                            >
                                <Text
                                    style={{
                                        color: selectedOption == option.id ? theme[mode].white : theme[mode].theadgray
                                    }}
                                >{option.label}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>

        </View>
    )
}

export default GraphicsLine






