import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

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


export default class AndroidChart extends React.Component {
    static contextType = ThemeContext;

    constructor(props) {
        super(props)
        this.state = {
            chartOptions: dummyChartOptions,
            selectedOption: dummyChartOptions[2].id,
            id: 'usdttry',
            isReloadWebView: false,
        }
    }

    componentDidMount() {
        this.setState({
            id: this.props.gelenMarket.id
        })
    }

    refresh(params) {
        this.setState(
            {
                selectedOption: params,
                isReloadWebView: true
            }
        )
    }

    checkForState() {
        this.setState({ isReloadWebView: false })
    }

    render() {
        const { state: { mode } } = this.context;
        let jsInject;
        if (mode == 'dark') {
            jsInject = `
                        const chartProperties = {
                        height: 350,
                        layout:{
                            backgroundColor: '#212529',
                            textColor: 'rgba(255, 255, 255, 0.9)',
                        },
                        timeScale: {
                            timeVisible: true,
                            secondsVisible: false,
                        }
                    }
        
                    const domElement = document.getElementById('tvchart')
                    const chart = LightweightCharts.createChart(domElement, chartProperties)
                    const candleSeries = chart.addCandlestickSeries();
        
                    fetch("https://ornekapp.com/api/v2/trade/public/markets/${this.state.id}/k-line?period=${this.state.selectedOption}&limit=1000")
                            .then(res => res.json())
                            .then(data => {
                                const cdata = data.map(d => {
                                    return { time: d[0], open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]), }
                                })
                                candleSeries.setData(cdata)
                            })
                            .catch(err => console.log(err))
                    `
        } else {
            jsInject = `
                        const chartProperties = {
                        height: 350,
                        layout:{
                            backgroundColor: '#FFFFFF',
                            textColor: 'rgba(0, 0, 0, 0.9)',
                        },
                        timeScale: {
                            timeVisible: true,
                            secondsVisible: false,
                        }
                    }
        
                    const domElement = document.getElementById('tvchart')
                    const chart = LightweightCharts.createChart(domElement, chartProperties)
                    const candleSeries = chart.addCandlestickSeries();
        
                    fetch("https://ornekapp.com/api/v2/trade/public/markets/${this.state.id}/k-line?period=${this.state.selectedOption}&limit=1000")
                            .then(res => res.json())
                            .then(data => {
                                const cdata = data.map(d => {
                                    return { time: d[0], open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]), }
                                })
                                candleSeries.setData(cdata)
                            })
                            .catch(err => console.log(err))
                    `
        }



        return (
            <View style={{ height: 400 }}>

                <WebView
                    source={Platform.OS === 'android' ?
                        { uri: 'file:///android_asset/lightTradingView/index.html' } :
                        { uri: 'lightTradingView/index.html' }}
                    value={this.state.selectedOption}
                    style={{ flex: 1, backgroundColor: theme[mode].white }}
                    key={this.state.isReloadWebView}
                    allowFileAccessFromFileURLs={true}
                    onLoadEnd={() => this.checkForState()}
                    originWhitelist={["*"]}
                    domStorageEnabled={true}
                    allowFileAccess={true}
                    allowUniversalAccessFromFileURLs={true}
                    onShouldStartLoadWithRequest={() => true}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    injectedJavaScript={jsInject}
                    onMessage={(event) => {
                        const data = JSON.parse(event.nativeEvent.data)
                        console.log("data: ", data)
                        if (data.type == "onIntervalChanged") {
                            ToastAndroid.show("Interval = " + data.interval, ToastAndroid.SHORT);
                        }
                    }}
                />
                {
                    this.state.isVisible ?
                        <ActivityIndicator
                            size="large"
                            color={theme[mode].indicatorColor}
                            style={{
                                position: "absolute",
                                zIndex: 10,
                                flex: 1,
                                backgroundColor: "white",
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0
                            }}
                        /> : null
                }


                <View style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: "space-between"
                }}>
                    {
                        this.state.chartOptions.map((option) => {
                            return (
                                <TouchableOpacity key={`option-${option.id}`}
                                    onPress={() => this.refresh(option.id)}
                                    style={{
                                        height: 30,
                                        width: 60,
                                        borderRadius: 15,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: this.state.selectedOption == option.id ?
                                            theme[this.props.mode].lightblue :
                                            theme[this.props.mode].cardbg
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: this.state.selectedOption == option.id ?
                                                theme[this.props.mode].white :
                                                theme[this.props.mode].theadgray
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
}


const GraphicsLine = ({ gelenMarket }) => {
    const { state: { mode } } = useContext(ThemeContext);

    return (
        <AndroidChart gelenMarket={gelenMarket} mode={mode} />
    );
};
module.exports = GraphicsLine