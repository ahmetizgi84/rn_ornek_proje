import React, { lazy, PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Sparkline from 'react-native-sparkline';

import * as componentsMap from './svg/icon';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

function isNumeric(s) {
  return !isNaN(s - parseFloat(s));
}


function UpperKelime(string) {
  if (string == null)
    return null
  try {
    if (isNumeric(string.charAt(0)))
      string = "Svg" + string.charAt(0) + (string.charAt(1)).toUpperCase() + string.slice(2)
    else
      string = (string.charAt(0)).toUpperCase() + string.slice(1)
    const DynamicComponent = componentsMap[string];
    if (DynamicComponent == null)
      return null
    return <DynamicComponent height={32} width={32} />;
  } catch (error) {
    return null
  }

}
export class ListCard extends PureComponent {
  static contextType = ThemeContext;

  render() {
    const { state: { mode } } = this.context;
    const styles = setStyle(mode);
    const { callback, item } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.4}
        style={styles.item}
        onPress={callback}>

        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={styles.icon}>
            {UpperKelime(item.svg)}
          </View>

          <View style={styles.type}>
            <Text style={styles.txt}>{item.title}</Text>
            <Text style={styles.txt}>{item.subtitle.toUpperCase()}</Text>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Sparkline data={item.graph} width={100} height={32}
            color={item.percentage_type > 0 ? theme[mode].green :
              item.percentage_type < 0 ? theme[mode].red : theme[mode].textblack}>
            <Sparkline.Line />
          </Sparkline>
        </View>

        <View style={{ flex: 0.9 }}>
          <Text style={item.percentage_type > 0 ? styles.priceGreen : item.percentage_type < 0 ? styles.priceRed : styles.priceDefault}>
            {item.price}
          </Text>

          <Text style={item.percentage_type > 0 ? styles.priceGreen : item.percentage_type < 0 ? styles.priceRed : styles.priceDefault}>
            {item.percentage}
          </Text>
        </View>

      </TouchableOpacity>
    );
  }
}

export default ListCard;

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
    color: theme[mode].textblack,
    textAlign: 'right',
  },
  priceGreen: {
    color: theme[mode].green,
    textAlign: 'right',
  },
  priceRed: {
    color: theme[mode].red,
    textAlign: 'right',
  },

  txt: {
    color: theme[mode].textblack,
    fontSize: 12,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",

  }
});
