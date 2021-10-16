import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

export default (ChildItem = ({
  item,
  style,
  onPress,
  index,
  imageKey,
  local,
  height,
  language,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(index)} activeOpacity={1}>
      <FastImage
        style={[styles.image, style, { height: height }]}
        source={local ? item[imageKey][language] : { uri: item[imageKey][language] }}
        resizeMode={FastImage.resizeMode.contain}
      />
      {(item.title[language] || item.desc[language])?
      <View style={{     position: 'absolute', bottom: 20, color: "#fff", padding: 10, backgroundColor: "#00000050", width: "100%" }}>
        {item.title[language] && (item.title[language].trim().length > 3) ?
          <Text style={{ color: "#fff", }}>
            {item.title[language]}
          </Text>
          : null
        }
        {item.desc[language] && (item.desc[language].trim().length > 3) ?
          <Text style={{  color: "#fff",  }}>
            {item.desc[language]}
          </Text>
          : null
        }
        </View>
        :null
        }
      
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 230,
    resizeMode: 'stretch',
  },
});
