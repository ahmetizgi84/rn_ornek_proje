import { Dimensions, Platform, PixelRatio } from 'react-native';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

function normalize(size){
  const newSize = size * scale
  if (Platform.OS == 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }else{
    if(width <= 360){
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 1 // -2 
    }
    else if(width > 360){
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1 // -2 
    }
  }
}

export const theme = {
  light: {
    bg: '#F3F3F5',
    white: '#FFFFFF',
    cardbg: '#F6F8F9',
    listcardbg: '#F8F8F9',
    darkblue: '#003399',
    lightblue: '#57B2F6',
    textblack: '#2C3247',
    usertextblack: '#212529',
    hamburgerblue: '#007bff',
    buttontextgray: '#7A7C83',
    theadgray: 'rgba(112, 112, 112, 0.6)',
    inputbordercolor: 'rgba(122, 124, 131, 0.5)',
    tabbuttonactive: '#273E95',
    tabbuttonpassive: '#B2B2B2',
    green: '#57CA79',
    red: '#FF5640',
    barStyle: "light-content",

    searchInputBg: '#FFFFFF',
    searchInputBorderColor: 'rgba(122, 124, 131, 0.5)',

    inputIconColor: '#7A7C83',
    placeholderTextColor: "#a3a3a3",
    inpbgc: 'rgba(87, 202, 121, 0.15)',

    btnPrimaryColor: "#FFFFFF",

    textDimColor: '#7A7C83',
    textShineColor: '#212529',

    checkboxbgcolor: '#FFFFFF',
    checkboxbordercolor: '#7A7C83',

    cardinputbgcolor: '#F8F8F9',
    cardinputdirty: '#F8F8F9',

    btnActiveColor: "#FFFFFF",
    btnPassiveColor: '#F8F8F9',

    cardbtnbgcolor: '#FFFFFF',

    modalbgcolor: '#FFFFFF',
    modalItembgcolor: '#F3F3F5',

    indicatorColor: '#FFFFFF',
    darkIndicatorColor: '#212529',

    greetingColor: '#003399',

    cancelBtnbgcolor: '#F6F8F9',

    lineColor: 'rgba(122, 124, 131, 0.5)',

    lightbluedisabled: '#C2E2FC',

    lightblueopact: '#EEF7FE',

    lightblueopacity: 'rgba(87, 178, 246, 0.15)',

    chartTextBlack: '#5B6488',
    redbgc: 'rgba(255, 86, 64, 0.15)',

    switchBtnPassive: '#B2B2B2',
    switchDotColor: '#F3F3F5',

    pendingColor: '#E8AF59',


  },
  dark: {
    // Test colors. will be changed
    bg: '#212529',
    cardbg: '#2C3247',
    textblack: '#FFFFFF',
    white: '#353846',
    tabbuttonactive: '#57CA79',
    tabbuttonpassive: '#FFFFFF',

    listcardbg: '#353846',
    theadgray: 'rgba(112, 112, 112, 0.6)',
    searchInputBg: '#212529',
    searchInputBorderColor: 'rgba(122, 124, 131, 0.5)',

    inputIconColor: '#F6F8F9',
    placeholderTextColor: "#a3a3a3",
    inpbgc: 'rgba(87, 202, 121, 0.15)',

    btnPrimaryColor: "#FFFFFF",

    textDimColor: '#F6F8F9',
    textShineColor: '#FFFFFF',

    checkboxbgcolor: '#353846',
    checkboxbordercolor: '#F6F8F9',

    cardinputbgcolor: '#212529',
    cardinputdirty: '#212529',

    btnActiveColor: "#212529",
    btnPassiveColor: '#2C3247',

    cardbtnbgcolor: '#212529',

    modalbgcolor: '#212529',
    modalItembgcolor: '#353846',

    indicatorColor: '#FFFFFF',
    darkIndicatorColor: '#FFFFFF',


    greetingColor: '#57B2F6',

    cancelBtnbgcolor: '#212529',

    lineColor: '#F6F8F9',

    lightbluedisabled: '#C2E2FC',

    lightblueopact: '#EEF7FE',

    lightblueopacity: 'rgba(87, 178, 246, 0.15)',

    chartTextBlack: '#737F92',
    redbgc: 'rgba(255, 86, 64, 0.15)',

    switchBtnPassive: '#B2B2B2',
    switchDotColor: '#F3F3F5',

    pendingColor: '#E8AF59',




    darkblue: '#FFFFFF',
    lightblue: '#57B2F6',
    lightbluedisabled: '#C2E2FC',
    green: '#57CA79',
    red: '#FF5640',
    barStyle: "dark-content",
  },

  statusbar: {
    backgroundColor: '#F3F3F5',
  },

  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  littleBtnshadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
      },
      android: {
        elevation: 1,
      },
    }),
  }
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  margin: 20,
  padding: 24,

  // font sizes
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  b1: 18,

  // app dimensions
  width,
  height,
  aspectRatio: width / height,

  xs: normalize(10),
  sm: normalize(12),
  ssm: normalize(13),
  norm: normalize(14),
  fifteen: normalize(15),
  md: normalize(16),
  smd: normalize(18),
  lg: normalize(20),
  xl: normalize(22),
  xxl: normalize(24),
  xxxl: normalize(30)
};

