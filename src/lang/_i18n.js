import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';

import tr from './tr';
import en from './en';

const locales = RNLocalize.getLocales(); // Cihazdaki tercih edilen dil listesini getir

I18n.locale = locales[0].languageTag; //en, tr veya ar gibi dil kodunu getir

export const isRtl = locales[0].isRTL; // İlgili dilin sağdan sola yazıldığını belirtir.

I18nManager.forceRTL(isRtl);

I18n.fallbacks = true; // belirtilen dile ait kayıt bulunamadığında bir sonraki dilden telafi edilmesi gerektiğini belirtir.
I18n.locales.no = 'en'; // İstenen dil bulunamadığında, yerine telafi edilecek dil belirtilir.
I18n.translations = { // Uygulama içerisinde kullanılacak dillerin nesne olarak alınmasını sağlar.
  en,
  tr,
};
export default I18n;
