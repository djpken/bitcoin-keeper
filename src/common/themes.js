import Colors from 'src/theme/Colors';
import { extendTheme } from 'native-base';
import Fonts from './Fonts';

export const customTheme = extendTheme({
  fontConfig: {
    'RobotoCondensed-Regular': {
      100: {
        normal: Fonts.RobotoCondensedLight,
        italic: Fonts.RobotoCondensedLightItalic,
      },
      200: {
        normal: Fonts.RobotoCondensedRegular,
        italic: Fonts.RobotoCondensedItalic,
      },
      300: {
        normal: Fonts.RobotoCondensedBold,
        italic: Fonts.RobotoCondensedBoldItalic,
      },
      400: {
        normal: Fonts.RobotoCondensedRegular,
        italic: Fonts.RobotoCondensedItalic,
      },
      500: {
        normal: Fonts.RobotoCondensedRegular,
        italic: Fonts.RobotoCondensedItalic,
      },
      600: {
        normal: Fonts.RobotoCondensedRegular,
        italic: Fonts.RobotoCondensedItalic,
      },
      700: {
        normal: Fonts.RobotoCondensedRegular,
        italic: Fonts.RobotoCondensedItalic,
      },
      800: {
        normal: Fonts.RobotoCondensedRegular,
        italic: Fonts.RobotoCondensedItalic,
      },
      900: {
        normal: Fonts.RobotoCondensedRegular,
        italic: Fonts.RobotoCondensedItalic,
      },
    },
  },
  fonts: {
    heading: 'RobotoCondensed-Regular',
    body: 'RobotoCondensed-Regular',
    mono: 'RobotoCondensed-Regular',
  },
  colors: {
    light: {
      primaryGreen: Colors.GenericViridian,
      primaryBackground: Colors.LightYellow,
      mainBackground: Colors.LightWhite,
      modalBackground: Colors.GenericViridian,
      white: Colors.White,
      primaryText: Colors.RichBlack,
      secondaryText: Colors.GraniteGray,
      learnMoreBorder: Colors.Coffee,
      textBlack: Colors.DarkGreen,
      greenText: Colors.RichGreen,
      greenText2: Colors.TropicalRainForest,
      accent: Colors.MacaroniAndCheese,
      lightAccent: Colors.GoldCrayola,
      QrCode: Colors.WhiteCoffee,
      recieverAddress: Colors.DimGray,
      textInputBackground: Colors.Isabelline,
      secondaryBackground: Colors.Isabelline,
      GreyText: Colors.Feldgrau,
      dateText: Colors.HookerGreen,
      Border: Colors.CastletonGreen,
      textColor: Colors.LightGray,
      textColor2: Colors.DeepSpaceSparkle,
      headerText: Colors.TropicalRainForest,
      copyBackground: Colors.LightGray,
      sendCardHeading: Colors.BlueGreen,
      Glass: Colors.Glass,
      TorLable: Colors.Menthol,
      divider: Colors.GrayX11,
      errorRed: Colors.CarmineRed,
      textWallet: Colors.MediumJungleGreen,
      indicator: Colors.OutrageousOrange,
      addTransactionText: Colors.PineTree,
      sendMax: Colors.JackoBean,
      inActiveMsg: Colors.SpanishGray,
      vaultCardText: Colors.Bisque,
      satsDark: Colors.DeepSpaceGreen,
      gradientStart: Colors.GenericViridian, // linearGradient
      gradientEnd: Colors.DeepAquamarine, // linearGradient
      error: Colors.CongoPink,
      black: Colors.Black,
      fadedGray: Colors.FadedGray,
      fadedblue: Colors.FadeBlue,
      dustySageGreen: Colors.DustySageGreen,
      forestGreen: Colors.ForestGreen,
      pantoneGreen: Colors.pantoneGreen,
      seashellWhite: Colors.Seashell,
    },
    dark: {
      primaryGreen: Colors.GenericViridian,
      primaryBackground: Colors.LightYellowDark,
      mainBackground: Colors.LightWhite,
      modalBackground: Colors.LightYellowDark,
      white: Colors.Black,
      primaryText: Colors.RichBlackDark,
      secondaryText: Colors.GraniteGrayDark,
      learnMoreBorder: Colors.GoldCrayola,
      textBlack: Colors.DarkGreen,
      greenText: Colors.RichGreenDark,
      greenText2: Colors.TropicalRainForestDark,
      accent: Colors.MacaroniAndCheese,
      lightAccent: Colors.GoldCrayola,
      QrCode: Colors.WhiteCoffee,
      recieverAddress: Colors.DimGray,
      textInputBackground: Colors.Isabelline,
      secondaryBackground: Colors.Isabelline,
      GreyText: Colors.RichBlackDark,
      dateText: Colors.HookerGreen,
      Border: Colors.CastletonGreen,
      textColor: Colors.LightGray,
      textColor2: Colors.DeepSpaceSparkleDark,
      headerText: Colors.TropicalRainForest,
      copyBackground: Colors.LightGray,
      sendCardHeading: Colors.BlueGreen,
      Glass: Colors.Glass,
      TorLable: Colors.Menthol,
      divider: Colors.GrayX11,
      errorRed: Colors.CarmineRed,
      textWallet: Colors.MediumJungleGreen,
      indicator: Colors.OutrageousOrange,
      addTransactionText: Colors.PineTree,
      sendMax: Colors.JackoBean,
      inActiveMsg: Colors.SpanishGray,
      vaultCardText: Colors.Bisque,
      satsDark: Colors.DeepSpaceGreen,
      gradientStart: Colors.GenericViridian, // linearGradient
      gradientEnd: Colors.DeepAquamarine, // linearGradient
      error: Colors.CongoPink,
      black: Colors.White,
      fadedGray: Colors.FadedGray,
      fadedblue: Colors.FadeBlue,
      dustySageGreen: Colors.DustySageGreen,
      forestGreen: Colors.ForestGreen,
      pantoneGreen: Colors.pantoneGreenDark,
      seashellWhite: Colors.SeashellDark,
    },
  },
  components: {
    Box: {
      variants: {
        linearGradient: () => ({
          backgroundColor: {
            linearGradient: {
              colors: ['light.gradientStart', 'light.gradientEnd'],
              start: [0, 0],
              end: [1, 1],
            },
          },
        }),
        InactiveGradient: () => ({
          backgroundColor: {
            linearGradient: {
              colors: ['light.gradientEnd', 'light.gradientEnd'],
              start: [0, 0],
              end: [1, 1],
            },
          },
        }),
      },
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

export default customTheme;
