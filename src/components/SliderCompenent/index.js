import React, { Component } from 'react';
import { SafeAreaView, Dimensions, Text, Linking} from 'react-native';
import I18n from '../../lang/_i18n';

import FlatListSlider from './FlatListSlider';

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';

export default class extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.imagesData || [], 
    };
  }

  render() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const { state: { mode, language } } = this.context;
    const styles = setStyle(mode);
    return (
      <SafeAreaView style={{ height: 260 }}> 
        <FlatListSlider
          data={this.state.data}
          timer={5000}
          onPress={item => this.state.data[item].link[language] && Linking.canOpenURL(this.state.data[item].link[language]).then(supported => {
            if (supported) {
              Linking.openURL(this.state.data[item].link[language]);
            } else {
              console.log("Don't know how to open URI: " + item);
            }
          }).catch(err => console.error('Error', err))}
          language={language}
          indicatorContainerStyle={{ position: 'absolute', bottom: 5 }}
          indicatorActiveColor={theme[mode].darkblue}
          indicatorInActiveColor={theme[mode].lightblue}
          indicatorActiveWidth={30}
          indicator
          animation
        />
        <Text style={styles.title}>{I18n.t('mosttraded', { locale: language })}</Text>
      </SafeAreaView>
    );
  }
}

const setStyle = mode => ({
  separator: {
    height: 20,
  },
  contentStyle: {
    paddingHorizontal: 16,
  },

  title: {
    paddingHorizontal: 10,
    marginTop: 10,
    color: theme[mode].textblack,
    fontSize: 13,
    fontWeight: '700',
  },
});
