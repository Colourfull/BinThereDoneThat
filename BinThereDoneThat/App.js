/****
 * file: App.js
 * author: Devon Blewett <blewedev@uregina.ca>
 * student number: 200361371
 * CS855 Final Project
 * version: 1
 * last-modified: April-11-2022
 *
 * The colour change and navigation methods are based on examples provided by Dr. T. in class.
 *
 ****/
import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  Text,
  Switch,
  Image
} from 'react-native';
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// the screen for grain bin indicator and table 
import GrainBinScreen from './components/GrainBinScreen';
// a function to vibrate phone on inputs 
import vibrate from './components/vibrate';

// wasn't able to get this to work, but this was meant to be a function for saving as a csv
//import SaveCSV from './components/SaveCSV';

export default function App() {
  // the stack needed for the react stack navigator to transition screens
  const Stack = createStackNavigator();
  // setters for all of the different colour variables needed for the themes
  const [backgroundColour, setBackgroundColour] = useState('#363332');
  const [fontColour, setFontColour] = useState('#d6d4d4');
  const [binFillColour, setBinFillColour] = useState('#206301');
  const [inputColour, setInputColour] = useState('lightgrey');
  const [inputFontColour, setInputFontColour] = useState('black');
  const [buttonColour, setButtonColour] = useState('#474746');
  const [buttonFontColour, setButtonFontColour] = useState('lightgrey');
  const [binBackgroundColour, setBinBackgroundColour] = useState('grey');
  const [statusBarColour, setStatusBarColour] = useState("#474443");
  const [statusBarIndicators, setStatusBarIndicators] = useState("light-content");
  // a true/false toggle for which theme is active
  const [colourTheme, setColourTheme] = useState(true);

  /** 
   * function: switchTheme
   * purpose: Sets the colour theme to light or dark using setters for all the colour variables based on the switch value in the settings screen
   * paramaters: <1> value: a boolean to determine which set of colours to use
   * preconditions: All of the variables for the colours exist and have setters, and the variables are used in the view for setting the appropriate colours
   * returns: N/A
   * Side effect: background and font colours for the views, inputs, and buttons are changed to the specified colour
   **/
  const switchTheme = (value) => {
    // dark theme
    if (value) {
      setBackgroundColour('#363332');
      setFontColour('#d6d4d4');
      setBinFillColour('#206301');
      setInputColour('lightgrey');
      setInputFontColour('black');
      setButtonColour('grey');
      setButtonFontColour('black');
      setBinBackgroundColour('grey');
      setStatusBarColour("#474443");
      setStatusBarIndicators("light-content");
    } 
    // light theme
    else {
      setBackgroundColour('white');
      setFontColour('black');
      setBinFillColour('lightgreen');
      setInputColour('lightgrey');
      setInputFontColour('black');
      setButtonColour('lightgrey');
      setButtonFontColour('black');
      setBinBackgroundColour('lightgrey');
      setStatusBarColour("lightgrey");
      setStatusBarIndicators("dark-content");
    }
  };
  /** 
   * function: SettingsScreen
   * purpose: The home screen, presents the user with info about the app, the option to switch colour themes, and two buttons to navigate to the grain bins
   * paramaters: <1> navigation : variable for the stack navigator to determine routing and variables
   * preconditions: a react stack navigator is implemented to call the screen, and the colour variables exist and are set
   * returns: A view of the home screen
   * Side effect: N/A
   **/
  function SettingsScreen({ navigation }) {
    return (
      <View style={[styles.container, { backgroundColor: backgroundColour }]}>
        <StatusBar backgroundColor={statusBarColour} barStyle={statusBarIndicators}></StatusBar>
        <View>
          <Text style={[styles.settingsHeader, { color: fontColour }]}>
            {' '}
            Bin There Done That
          </Text>
          <Text style={[styles.settingsHeader, { color: fontColour }]}>
            {'\n'}
            Name: Devon Blewett {'\n'}
            Date: April 11th 2022{'\n'}
            Subject: CS855{'\n'}
            Final Project
          </Text>
          <View style={styles.logo}>
          <Image  source={require('./assets/icon.png')} />
          </View>
        </View>
        <View style={[styles.settings, { backgroundColor: backgroundColour }]}>
          <View
            style={[styles.themeArea, { backgroundColor: backgroundColour }]}>
            <Text style={[styles.settingsHeader, { color: fontColour }]}>
              Settings
            </Text>
            {/* Switch to toggle the colour theme */}
            <Switch
              onValueChange={(s) => {
                switchTheme(s);
                setColourTheme(s);
              }}
              value={colourTheme}
            />
            <Text style={[styles.baseText, { color: fontColour }]}>
              Change Theme
            </Text>
          </View>
        </View>
        {/* button to navigate to the first bin */}
        <Pressable
          style={styles.pressable}
          onPress={() => {
            navigation.navigate('GrainBinScreen', { binName: 'bin1' });
            vibrate();
          }}>
          <Text style={[styles.button, {backgroundColor:buttonColour, color:buttonFontColour}]}>View Bin 1</Text>
        </Pressable>
        {/* button to navigate to the second bin */}
        <Pressable
          style={styles.pressable}
          onPress={() => {
            navigation.navigate('GrainBinScreen', { binName: 'bin2' });
            vibrate();
          }}>
          <Text style={[styles.button, {backgroundColor:buttonColour, color:buttonFontColour}]}>View Bin 2</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/*  implement the navigator with the header hidden and the default transition animation for the device */}
      <Stack.Navigator
        initialRouteName="SettingsScreen"
        screenOptions={{
          headerShown: false,
          mode: 'card',
        }}>
        {/* the screen for the bin indicators.  Passes the bin's name and the colour parameters */}
        <Stack.Screen
          name="GrainBinScreen"
          initialParams={{
            backgroundColour: backgroundColour,
            binFillColour: binFillColour,
            fontColour: fontColour,
            inputColour: inputColour,
            inputFontColour: inputFontColour,
            buttonColour: buttonColour,
            buttonFontColour: buttonFontColour,
            binBackgroundColour: binBackgroundColour,
            binName: 'bin1',
            statusBarIndicators,
            statusBarColour,
          }}
          component={GrainBinScreen}
        />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//stylesheet for the home screen
const styles = StyleSheet.create({
  // the overall wrapper for the app
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  baseText: {},
  // A container for the settings area
  settings: {
    flex: 1,
    flexDirection: 'row',
  },
  // the header for the settings screen
  settingsHeader: {
    fontSize: 20,
    textAlign: 'center',
  },
  // the area containing the theme toggle
  themeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // style for the navigation buttons
  button: {
    fontSize: 40,
    backgroundColor: 'lightblue',
    textAlign: 'center',
    borderRadius: 10,
    marginTop: 12,
  },
  // style to extend pressables to a minimum size
  pressable: {
    minWidth: '20%',
  },
  // style for centering logo image
  logo:{
    alignItems: 'center',
    justifyContent: 'center',
  }
});
