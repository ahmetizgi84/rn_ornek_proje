import React, { useEffect, useContext } from 'react'
import { View, StyleSheet, Animated, Easing } from 'react-native'

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';


const AnimatedView = Animated.createAnimatedComponent(View)
const animatedValue = new Animated.Value(0)

const SkeletonLoaderWallet = () => {
    const { state: { mode } } = useContext(ThemeContext);
    const styles = setStyle(mode);



    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 100]
    })

    useEffect(() => {
        Animated.loop(
            Animated.timing(
                animatedValue,
                {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear.inOut,
                    useNativeDriver: false,
                }
            )
        ).start();
    }, [])

    return (
        <View style={styles.item}>

            {/* Avatar */}
            <View style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: theme[mode].bg,
                    borderRadius: 24,
                    width: 24,
                    height: 24,
                    overflow: "hidden",

                }}>
                    <AnimatedView
                        style={{
                            ...StyleSheet.absoluteFill,
                            marginLeft: 10,
                            width: '30%',
                            height: '100%',
                            opacity: 0.5,
                            backgroundColor: "#FFF",
                            transform: [{ translateX: translateX }]
                        }}
                    />
                </View>
            </View>

            {/* Title */}
            <View style={{ flex: 2 }}>
                <View
                    style={{
                        height: 17.5,
                        backgroundColor: theme[mode].bg,
                        overflow: "hidden",
                        width: 75,
                    }}>
                    <AnimatedView
                        style={{
                            width: '30%',
                            height: '100%',
                            opacity: 0.5,
                            backgroundColor: "#FFF",
                            transform: [{ translateX: translateX }]
                        }}
                    />
                </View>
            </View>


            {/* Total */}
            <View style={{ flex: 2 }}>
                <View
                    style={{
                        height: 17.5,
                        width: 75,
                        backgroundColor: theme[mode].bg,
                        overflow: "hidden"
                    }}>

                    <AnimatedView
                        style={{
                            width: '30%',
                            height: '100%',
                            opacity: 0.5,
                            backgroundColor: "#FFF",
                            transform: [{ translateX: translateX }]
                        }}
                    />
                </View>
            </View>

        </View>
    );
}

export default SkeletonLoaderWallet

const setStyle = mode => ({
    item: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme[mode].white,
        padding: 10,
        marginBottom: 5,
        borderRadius: 8,
        marginHorizontal: 10,
    },





});
