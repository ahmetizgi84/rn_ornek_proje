import React, { useEffect, useContext } from 'react'
import { View, StyleSheet, Animated, Easing } from 'react-native'

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';


const AnimatedView = Animated.createAnimatedComponent(View)
const animatedValue = new Animated.Value(0)

const SkeletonLoader = () => {
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        {/* Avatar */}
        <View style={{
          //backgroundColor: '#E8EAED',
          backgroundColor: theme[mode].bg,
          borderRadius: 24,
          width: 24,
          height: 24,
          overflow: "hidden"
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

        <View style={styles.type}>
          {/* Title */}
          <View
            style={{
              height: 17.5,
              backgroundColor: theme[mode].bg,
              marginBottom: 3,
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
          {/* Description */}
          <View
            style={{
              height: 17.5,
              backgroundColor: theme[mode].bg,
              width: 50,
              overflow: "hidden",
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

      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
        }}>
        <View
          style={{
            height: 32,
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

      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <View
          style={{
            height: 17.5,
            width: 75,
            backgroundColor: theme[mode].bg,
            marginBottom: 3,
            overflow: "hidden"
          }}
        >
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
        <View
          style={{
            height: 17.5,
            width: 50,
            backgroundColor: theme[mode].bg,
            overflow: "hidden"
          }}
        >
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

export default SkeletonLoader

const setStyle = mode => ({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme[mode].white,
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 32,
  },
  type: {
    marginLeft: 10,
    textAlign: 'left',
  },
  priceDefault: {
    color: '#E8EAED',
    textAlign: 'right',
  },


});
