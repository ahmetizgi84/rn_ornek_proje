import React, { useContext } from 'react'
import { View, Text, Animated, Easing } from 'react-native'

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

const AnimatedView = Animated.createAnimatedComponent(View)
const animatedValue = new Animated.Value(-50)

export const callToast = () => {
    Animated.timing(
        animatedValue,
        {
            toValue: 1,
            duration: 300,
            easing: Easing.exp,
            useNativeDriver: true
        }).start(closeToast())
}

const closeToast = () => {
    setTimeout(() => {
        Animated.timing(
            animatedValue,
            {
                toValue: -50,
                duration: 350,
                easing: Easing.exp,
                useNativeDriver: true
            }).start()
    }, 3000)
}



const Toast = ({ ...props }) => {
    const { state: { mode } } = useContext(ThemeContext);
    const styles = setStyle(mode);

    return (

        <View style={styles.container}>
            {
                props.type === "success" ? (

                    <AnimatedView style={[{ transform: [{ translateY: animatedValue }] }, styles.success]}>
                        <Text style={styles.toastText}>
                            {props.message}
                        </Text>
                    </AnimatedView>
                ) : (
                    <AnimatedView style={[{ transform: [{ translateY: animatedValue }] }, styles.danger]}>
                        <Text style={styles.toastText}>
                            {props.message}
                        </Text>
                    </AnimatedView>
                )
            }

        </View>

    )
}

export default Toast


const setStyle = mode => ({
    container: {
        zIndex: 1,
        elevation: 15
    },

    success: {
        height: 50,
        backgroundColor: theme[mode].green,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        justifyContent: 'center'
    },

    danger: {
        height: 50,
        backgroundColor: theme[mode].red,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        justifyContent: 'center'
    },

    toastText: {
        textAlign: "center",
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    },
})





// import React, { useContext } from 'react'
// import { View, Text, Animated, Easing } from 'react-native'

// import { theme } from '../constants/ThemeStyle';
// import { Context as ThemeContext } from '../context/ThemeContext';

// const AnimatedView = Animated.createAnimatedComponent(View)
// const animatedValue = new Animated.Value(0)


// export const startAnim = (mode) => {
//     Animated.timing(
//         animatedValue,
//         {
//             toValue: 1,
//             duration: 300,
//             easing: Easing.exp,
//             useNativeDriver: true,
//         }).start(stopAnim())
// }


// const stopAnim = () => {
//     setTimeout(() => {
//         Animated.timing(
//             animatedValue,
//             {
//                 toValue: 0,
//                 duration: 300,
//                 easing: Easing.exp,
//                 useNativeDriver: true,
//             }).start()

//     }, 3000)
// }



// const Toast = ({ ...props }) => {
//     const { state: { mode } } = useContext(ThemeContext);
//     const styles = setStyle(mode);



//     const translateX = animatedValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: [150, -10]
//     })


//     return (
//         <>
//             {
//                 props.type === "success" ? (

//                     <AnimatedView style={[styles.toastContainer, { transform: [{ translateX: translateX }], backgroundColor: theme[mode].green }]}>
//                         <Text style={{ color: 'white' }}>{props.message}</Text>
//                     </AnimatedView>
//                 ) : (

//                     <AnimatedView style={[styles.toastContainer, { transform: [{ translateX: translateX }], backgroundColor: theme[mode].red }]}>
//                         <Text style={{ color: 'white' }}>{props.message}</Text>
//                     </AnimatedView>
//                 )
//             }

//         </>
//     )
// }

// export default Toast


// const setStyle = mode => ({
//     toastContainer: {
//         //width: "70%",
//         padding: 5,
//         alignItems: "center",
//         borderRadius: 3,
//         position: 'absolute',
//         top: 10,
//         right: 0,
//         justifyContent: 'center',
//         zIndex: 1000,
//         elevation: 3
//     }
// })