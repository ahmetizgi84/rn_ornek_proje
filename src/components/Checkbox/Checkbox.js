import React, { useContext, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Tick } from '../../components/svg';

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';

const Checkbox = ({ isEmpty, callback }) => {
  const [isPressed, setIsPressed] = useState(false);

  const {
    state: { mode },
  } = useContext(ThemeContext);
  const styles = setStyle(mode);

  const onPressHandler = () => {
    setIsPressed(!isPressed);
    callback();
  };
  return (
    <Pressable style={styles.pressable} onPress={onPressHandler}>
      <View
        style={[
          styles.container,
          isPressed && styles.isPressed,
          isEmpty && styles.error,
        ]}>
        {isPressed && <Tick color={theme[mode].white} width={15} />}
      </View>
    </Pressable>
  );
};

export default Checkbox;

const setStyle = mode => ({
  pressable: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    backgroundColor: theme[mode].checkboxbgcolor,
    borderColor: theme[mode].checkboxbordercolor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  error: {
    borderColor: theme[mode].red,
  },

  isPressed: {
    backgroundColor: theme[mode].lightblue,
  },
});
