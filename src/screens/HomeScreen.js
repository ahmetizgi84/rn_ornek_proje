import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import I18n from 'i18n-js'
import { useFocusEffect } from "@react-navigation/native";

import SliderCompenent from '../components/SliderCompenent';
import Layout from '../components/Layout';
import MarketList from '../components/MarketList'
import { WifiOff } from '../components/svg'

import { Context as ThemeContext } from '../context/ThemeContext';
import { SocketContext } from '../context/SocketContext';
import { DataContext } from '../context/DataContext';
import { Context as AuthContext } from '../context/AuthContext'
import { theme } from '../constants/ThemeStyle';


/**
 *
 * IMPORTANT NOTE!
 *
 * https://stackoverflow.com/questions/65572571/prevent-child-component-to-re-render-below-context-provider-with-memo =>
 * React.Memo doesn't help since you are calling the useContext hook which will cause the component to re-render every time the value from the provider changes.
 *
 * https://reactjs.org/docs/context.html =>
 * All consumers that are descendants of a Provider will re-render whenever the Provider’s value prop changes.
 * The propagation from Provider to its descendant consumers (including .contextType and useContext) is not subject to the shouldComponentUpdate method,
 * so the consumer is updated even when an ancestor component skips an update.
 *
 * For example, the code below will re-render all consumers every time the Provider re-renders because a new object is always created for value:
 *
    class App extends React.Component {
      render() {
        return (
          <MyContext.Provider value={{something: 'something'}}>
            <Toolbar />
          </MyContext.Provider>
        );
      }
    }

    To get around this, lift the value into the parent’s state:

    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: {something: 'something'},
        };
      }

      render() {
        return (
          <MyContext.Provider value={this.state.value}>
            <Toolbar />
          </MyContext.Provider>
        );
      }
    }
 */

const HomeScreen = ({ navigation }) => {
  const { state: { mode, language }, _checkingForMode, _getPreviousLanguage } = useContext(ThemeContext);
  const { isModalOpen } = useContext(SocketContext);
  const { _imagesData, _getOrders, _getWalletList } = useContext(DataContext);
  const { _checkingForAuth } = useContext(AuthContext)
  const [imagesData, setimagesData] = useState(null);

  const styles = setStyle(mode);

  useEffect( async () => {
    if (isModalOpen === false) {
      _checkingForAuth();
      _checkingForMode();
      _getPreviousLanguage();
      setimagesData(await _imagesData());
     }
  }, [isModalOpen]);

  useFocusEffect(
    React.useCallback( () => {
      if (isModalOpen === false) {
        _getOrders();
        _getWalletList();
       
      }
    }, [isModalOpen])
  );


  const listHeaderComponent = () =>
   imagesData && <SliderCompenent imagesData={imagesData} language={language}/>;


  return (
    <Layout navigation={navigation}>
      <Modal
        isVisible={isModalOpen === null ? false : isModalOpen}
        backdropOpacity={0.70}
        hasBackdrop={true}
        animationIn="bounceIn"
        animationOut="bounceOut"
        useNativeDriver={true}
        style={{ alignItems: 'center', margin: 10 }}
      >
        <ModalChild />
      </Modal>

      <View style={styles.container}>
        <View style={styles.content}>

          <MarketList sliced listHeaderComponent= {imagesData && imagesData.length >0? listHeaderComponent():null}/>

        </View>
      </View>
    </Layout>
  );
};

export default HomeScreen

const setStyle = mode => ({
  container: {
    flex: 1,
  },

  content: {
    flex: 1, 
  },
});




export function ModalChild() {
  const { state: { mode, language } } = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: theme[mode].bg,
        width: "85%",
        height: '20%',
        padding: 24,
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 24,
      }}>

      <WifiOff width={36} height={36} color={theme[mode].inputIconColor} />
      <Text style={{ color: theme[mode].textblack, textAlign: "center" }}>{I18n.t('noInternet', { locale: language })}</Text>
    </View>
  )
}
