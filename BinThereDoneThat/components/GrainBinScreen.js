/****
 * file: GrainBinScreen.js
 * author: Devon Blewett <blewedev@uregina.ca>
 * student number: 200361371
 * CS855 Final Project
 * version: 1
 * last-modified: April-11-2022
 *
 *
 *  The save functionality is based on the YouTube tutorial "React Native: AsyncStorage (using new AsyncStorage)" 
 *  by Lirs Tech Tips.  https://www.youtube.com/watch?v=oXsTkvxHeYw
 *
 *  The fillIn animation function is based on the fadeIn tutorial given by Dr. T. in class.
 *
 ****/
import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Animated,
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  Text,
  TextInput,
} from 'react-native';
import Constants from 'expo-constants';
// I used a modaldropdown because other lists I tried broke my format
import ModalDropdown from 'react-native-modal-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

import vibrate from './vibrate';

  /** 
   * function: GrainBinScreen
   * purpose: The screen for showing information about a grain bin.  Contains an animated bin indicator and a table to enter and save data
   * paramaters: <1> navigation : variable for the stack navigator to determine routing and variables
   *             <2> route: a list of parameters from the homescreen to determine colour theme and which bin is being viewed
   * preconditions: a react stack navigator is implemented to call the screen, and the colour variables exist and are set
   * returns: A view of one of the two grain bins
   * Side effect: N/A
   **/
function GrainBinScreen({ navigation, route }) {
    // set all the parameters that were passed from the navigator, mostly just colours, but also the name of the bin that is being viewed
  const {
    backgroundColour,
    fontColour,
    binFillColour,
    inputColour,
    inputFontColour,
    buttonColour,
    buttonFontColour,
    binBackgroundColour,
    binName,
    statusBarIndicators,
    statusBarColour,
  } = route.params;
  // setters for the four fields of the table with some default values that won't be used in most situations
  const [grainType, setGrainType] = useState('Wheat');
  const [tonnes, setTonnes] = useState(0);
  const [bushels, setBushels] = useState(0);
  const [capacity, setCapacity] = useState(2000);

  //variables used to show how full the bin is
  const [filled, setFilled] = useState(0);
  const [empty, setEmpty] = useState(100 - filled + '%');

  // a list of grains with keys for the drop down list in the table.  Mapped so that the modal dropdown reads them properly and their text values display
  const [grainList, setGrainList] = useState(
    [
      { text: 'Wheat', key: '0' },
      { text: 'Barley', key: '1' },
      { text: 'Canola', key: '2' },
      { text: 'Duram', key: '3' },
    ].map((grain) => grain.text)
  );


  /* Data storage functions.  Uses AsyncStorage to save values locally to device */

   /** 
   * function: saveValues
   * purpose: Stores the values from the grain table in the appropriate memory location depending on if the user is viewing bin1 or bin2.  They are hardcoded
   * as single variables for now because I was having trouble passing and updating objects between screens.  Provides a success message when finished.
   * paramaters: N/A
   * preconditions: The user is viewing one of two bins named either bin1 or bin2, and the bushels, grainType, and capacity are defined.  A button is clicked
   * and the inputs were deemed valid.
   * returns: N/A
   * Side effect: Bin data is stored for either bin1 or bin2.  A success message pops up to let the user know something happened.
   **/
  const saveValues = () => {
    if (binName == 'bin1') {
      AsyncStorage.setItem('bushelsAmountbin1', bushels.toString());
      AsyncStorage.setItem('grainStoredbin1', grainType);
      AsyncStorage.setItem('binCapacitybin1', capacity.toString());
    } else if (binName == 'bin2') {
      AsyncStorage.setItem('bushelsAmountbin2', bushels.toString());
      AsyncStorage.setItem('grainStoredbin2', grainType);
      AsyncStorage.setItem('binCapacitybin2', capacity.toString());
    }
    // print success alert when the changes are saved
    Alert.alert('Success', 'The bin has been updated', [
        { text: 'OK', style: 'cancel' },
      ]);

  };


 /** 
   * function: getValues
   * purpose: Will load capacity, grainType, and bushels from storage depending on which bin is currently being viewed.  If the keys are not defined, gives some default values
   * for testing purposes
   * paramaters:  N/A
   * preconditions: There are setters for the bushels, grainType, and capacity for this to load the data with
   * returns: N/A
   * Side effect: bushels, grainType, and capacity are changed to match the stored data for whichever bin is being viewed, or loaded with default values
   **/
  const getValues = () => {
    if (binName == 'bin1') {
      AsyncStorage.getItem('bushelsAmountbin1').then((bushelsLoaded) => {
        if (bushelsLoaded) {
          {
            setBushels(bushelsLoaded),
              updateNumericField('bushels', bushelsLoaded);
          }
        } else {
          setBushels(0);
          updateNumericField('bushels', 0);
        }
      });
      AsyncStorage.getItem('grainStoredbin1').then((grainStored) => {
        if (grainStored) {
          setGrainType(grainStored);
        } else {
          setGrainType('Wheat');
        }
      });
      AsyncStorage.getItem('binCapacitybin1').then((binCapacity) => {
        if (binCapacity) {
          setCapacity(binCapacity);
        } else {
          setCapacity(2000);
        }
      });
    } else if (binName == 'bin2') {
      AsyncStorage.getItem('bushelsAmountbin2').then((bushelsLoaded) => {
        if (bushelsLoaded) {
          {
            setBushels(bushelsLoaded),
              updateNumericField('bushels', bushelsLoaded);
          }
        } else {
          setBushels(0);
          updateNumericField('bushels', 0);
        }
      });
      AsyncStorage.getItem('grainStoredbin2').then((grainStored) => {
        if (grainStored) {
          setGrainType(grainStored);
        } else {
          setGrainType('Wheat');
        }
      });
      AsyncStorage.getItem('binCapacitybin2').then((binCapacity) => {
        if (binCapacity) {
          setCapacity(binCapacity);
        } else {
          setCapacity(2000);
        }
      });
    }
  };

    /** 
   * function: confirmSave
   * purpose: Checks if the values are legal.  If they are not, provides the user an error message.  If they are, asks the user if they want to save.  Updates the 
   * stored values for that bin.
   * paramaters: N/A
   * preconditions: A confirm button is pressed to call this function.  bushels and capacity are set and legal values.  Device can use the alert library.
   * returns: N/A
   * Side effect: <1> If the values were not legal, a window pops up with a warning, but nothing is changed
   *              <2> If the values were legal, a window pops up asking the user if they would like to save the changes.  If confirm is pressed, the saveValues function
   *                  is called and the variables for that bin are stored.  If cancelled, nothing changes.
   **/  
     const confirmSave = () => {
        // provide an error message because there are more bushels than the bin would be able to hold
        if (parseInt(bushels) > parseInt(capacity)) {
          Alert.alert('Error', 'The bushels exceed storage capacity', [
            { text: 'OK', style: 'cancel' },
          ]);
        } else {
            // provide a confirmation window to make sure the user didn't accidentally press the button and actually wants to change the values
          Alert.alert(
            'Confirm',
            'Save Changes to Bin?',
            [
              // do nothing
              { text: 'Cancel', style: 'cancel' },
              // update the values by calling saveValues
              { text: 'Confirm', onPress: () => saveValues() },
            ],
            // allow the user to dismiss the window by tapping outside the box
            { cancelable: true }
          );
        }
      };
/* End Data storage functions */

/* Animation functions for the bin indicator */

// the number that changes over time that will be used to animate the bin filling
  const heightAnim = useRef(new Animated.Value(0)).current;
 /** 
   * function: fillIn
   * purpose: Changes the heightAnim over time to animate the bin indicator filling. 
   * paramaters: <1> value : The value the heightAnim should be changed to, determined by calculating how much space the grain is taking up in the bin
   * preconditions: There is something using the heightAnim as it's height property, in this case the bin's fill indicator
   * returns: N/A
   * Side effect: the heightAnim value changes, which in turn changes the height of the bin's fill indicator
   **/
  const fillIn = (value) => {
    Animated.timing(heightAnim, {
      toValue: value,
      duration: 5000,
      // for some reason everything breaks if this is not set to false, despite most guides saying it should be set to true
      useNativeDriver: false,
    }).start();
  };

   /** 
   * function: updateBinIndicator
   * purpose: Calculates the percentage of the bin is taking up (bushels/capacity) and passes the value to the fillIn so that it can update the animation.  It is called onChangeText
   * for the capacity and bushels sections of the table.
   * paramaters: <1> inBushels : How many bushels have been entered into the bin
   * preconditions: fillIn is defined and working.  Either of the numeric fields in the table are edited to call this function
   * returns: N/A
   * Side effect: The percentage of the bin that is full is updated and passed to the fillIn function to update the animation
   **/
  // only uses inBushels as input because I later learned I could use useEffect to update the setters without it lagging behind one step, and used that for the capacity
  const updateBinIndicator = (inBushels) => {
    var percentFilled = 0;
    // if the capacity of the bin is less than the number of bushels entered, fill the bin to 100%
    //parseInt is used to make sure that the values aren't being read as strings, which sometimes happened
    if (parseInt(capacity) < parseInt(inBushels)) {
      percentFilled = 1;
    } else {
      percentFilled = inBushels / capacity;
    }
    setFilled(percentFilled * 100);
    setEmpty(100 - percentFilled * 100 + '%');
    // pass the percentage filled (multiply by 100 to convert it to the rate range) to the fillIn function to update the animation
    fillIn(percentFilled * 100);
  };
/* end of animation functions */

/* bin update functions */

  /** 
   * function: updateNumericField
   * purpose: Updates the appropriate setter for either capacity or bushels with the value being entered into the table.  Uses a regex to ensure only numeric input is being entered.
   * Also calls the vibrate function whenever the user presses a button to edit the fields.
   * paramaters: <1> field: the name of the field in the table being updated, used to determine which setter to call
   *             <2> value: the value to be passed to the setter
   * preconditions: Setters for the bushels and capacity exist, the input fields are modified to call this function
   * returns: N/A
   * Side effect: <1>Phone vibrates for 100ms.  
   *              <2>If the bushels field was changed, updates the bushels variable, passes the value it was changed to to updateBinIndicator to animate
   *                the change in bushels, passes the type of grain that is currently in the table and the bushels to updateTonnes to calculate the new tonnes for the table
   *              <3> If the capacity was changed, update the capacity variable
   **/
  const updateNumericField = (field, value) => {
    //vibrate the phone no matter what, so the user can tell it is reading their input but if it is not a number it is ignoring it
    vibrate();
    // regular expression that only allows a space or numbers.  The space was needed to allow the user to delete the entire number
    const numericRegex = /^\s*\d*\s*$/;
    if (numericRegex.test(value)) {

      if (field == 'bushels') {
        setBushels(value);
        updateBinIndicator(value);
        updateTonnes(grainType, value);
      } else if (field == 'capacity') {
        setCapacity(value);
        updateBinIndicator(bushels);
      }
    }
  };
  /** 
   * function: updateTonnes
   * purpose: Calculates the tonnes that are stored in the bin based on the volume of the bushel for the grain being stored and the number of bushels.  The values were given
   * to me by my friend who works at a grain terminal and are based on how they calculate it.  Tonnes are calculated by number of bushels / number of bushels per tonne.
   * Rounds to five decimal places.
   * paramaters: <1> inGrainType:  The type of grain that is being stored in the bin, determines the number needed for the volume of the bushel.  36.44 for wheat and duram, 
   *  45.93 for barley, 44.092 for canola
   *             <2>  value: The amount of bushels being used to calculate the tonnes
   * preconditions: Either the grain or the bushels were changed in the table, which results in this function being directly or indirectly called.  Grain must match one of the 
   * predefined entries
   * returns: N/A
   * Side effect: The tonnes field of the table is updated
   **/
  const updateTonnes = (inGrainType, value) => {
    // need to check numeric keys and names because either may be input depending on the source of the call
    //temporary variable to store the result
    var result = 0;
    if (
      inGrainType == 0 ||
      inGrainType == 3 ||
      inGrainType == 'Wheat' ||
      inGrainType == 'Duram'
    ) {
      result = (value / 36.44);
    } else if (inGrainType == 1 || inGrainType == 'Barley') {
      result = (value / 45.93);
    } else if (inGrainType == 2 || inGrainType == 'Canola') {
      result = (value / 44.092);
    }
    // round the result to five places
    result = parseFloat(result.toFixed(5));
    setTonnes(result);
  };

  /** 
   * function: updateGrainType
   * purpose: Updates the type of grain being stored in the bin based on what option is selected from the modal dropdown in the grain table
   * paramaters: <1> value:  The numeric key of the grain selected in the dropdown
   * preconditions: Function is called whenever a grain is selected from the table.  Setter for the grain type must exist
   * returns: N/A
   * Side effect: The grain in the table is updated.  The tonnes may also be recalculated and updated based on what grain was selected
   **/
  const updateGrainType = (value) => {
    if (value == 0) {
      setGrainType('Wheat');
    } else if (value == 1) {
      setGrainType('Barley');
    } else if (value == 2) {
      setGrainType('Canola');
    } else if (value == 3) {
      setGrainType('Duram');
    }
  };

/* End bin update functions */

  // load the stored items and run the appropriate functions when the app first launches
  useEffect(() => {
    getValues();
    updateNumericField('bushels', bushels);
    updateTonnes(grainType, bushels);
  }, []);
  // update the bin indicator whenever the capacity is changed.  Doing this elsewhere when the capacity is updated lags behind one step
  useEffect(() => {
    updateNumericField('bushels', bushels);
  }, [capacity]);
  


  return (
    <View style={[styles.container, { backgroundColor: backgroundColour }]}>
        <StatusBar backgroundColor={statusBarColour} barStyle={statusBarIndicators}></StatusBar>
      <Text style={[styles.header, { color: fontColour }]}>
        Bin There Done That {'\n'}
        {binName}
      </Text>

      <View style={[styles.bin, { backgroundColor: backgroundColour }]}>
        <View
          style={[
            styles.bincontainer,
            { backgroundColor: binBackgroundColour },
          ]}>
          <View
            style={[
              styles.binbackground,
              { backgroundColor: binBackgroundColour, height: empty },
            ]}></View>
            {/* the bin animation.  It works be tracking the heightAnim, which changes over time based on bushels/capacity.  The value is passed here as the height, and interpolated
            so that the needed percentage sign is added in */}
          <Animated.View
            style={[
              styles.binfilled,
              {
                backgroundColor: binFillColour,
                height: heightAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}></Animated.View>
        </View>
      </View>

      <View style={[styles.container, { backgroundColor: backgroundColour }]}>
      {/* The pressable for the save values button.  This was moved here because if the user had the keyboard open, it was too easy to accidentally press the return home button */}
         <Pressable
              style={[
                styles.editButton,
                { backgroundColor: buttonColour, color: buttonFontColour },
             ]}
             onPress={() => {
             confirmSave();
             }}>
          <Text style={[styles.edit, {backgroundColor:buttonColour, color:buttonFontColour}]}> Save Bin Values </Text>
        </Pressable>
        {/* Row for the capacity */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { color: fontColour }]}>
            Capacity
          </Text>
          <View style={[styles.tableCell, { color: fontColour }]}>
            <TextInput
              style={[
                styles.field,
                { backgroundColor: inputColour, color: inputFontColour },
              ]}
              onChangeText={(value) => {
                updateNumericField('capacity', value);
              }}
              value={capacity.toString()}
            />
          </View>
        </View>
        {/* Row for the type of grain */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { color: fontColour }]}>
            Commodity
          </Text>
          <View
            style={[
              styles.tableCell,
              { backgroundColor: inputColour, color: inputFontColour },
            ]}>
            {/* modal dropdown used to select the grain to store.  It gets the values from const grainList, defined above.  Updates graintype and tonnes when changed */}
            <ModalDropdown
              textStyle={[styles.tableCell, { color: inputFontColour }]}
              onSelect={(value) => {
                updateGrainType(value);
                updateTonnes(value, bushels);
              }}
              defaultValue={grainType}
              options={grainList}
            />
          </View>
        </View>
        {/* Row for bushels */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { color: fontColour }]}>Bushels</Text>
          <View style={[styles.tableCell, { color: fontColour }]}>
            <TextInput
              style={[
                styles.field,
                { backgroundColor: inputColour, color: inputFontColour },
              ]}
              onChangeText={(value) => {
                updateNumericField('bushels', value);
              }}
              value={bushels.toString()}
            />
          </View>
        </View>
        {/* Row for tonnes.  Since it is calculated automatically and the user doesn't change it, it doesn't need to do anything special */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { color: fontColour }]}>Tonnes</Text>
          <Text style={[styles.tableCell, { color: fontColour }]}>
            {tonnes}
          </Text>
        </View>
      
      </View>
      {/* button to navigate back to home screen */}
      <Pressable
        style={styles.pressable}
        onPress={() => {
          navigation.navigate('SettingsScreen');
          vibrate();
        }}>
        <Text style={[styles.button, {backgroundColor:buttonColour, color:buttonFontColour}]}> Return to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // overall container of the bin function
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'darkgrey',
    padding: 8,
  },
  // header text
  header: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // the space for the bin indicator, contains the fill indicator
  bin: {
    flex: 1,
    marginLeft: '15%',
    marginRight: '15%',
  },
  bincontainer: {
    height: '100%',
    width: '100%',
  },
  // the green box that grows or shrinks based on the bushels and capacity
  binfilled: {
    height: '70%',
    width: '100%',
    bottom: 0,
    position: 'absolute',
  },
  binbackground: {
    height: '25%',
    width: '100%',
  },
  // each row in the bin table
  tableRow: {
    flexDirection: 'row',
  },
  // each cell in the bin table
  tableCell: {
    flex: 1,
    borderWidth: 2,
  },
  // the button to save the bin table data
  editButton: {
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: '3%',
  },
  // the text within the edit button
  edit: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  // expands the fields in the table to take up the whole space
  field: {
    flex: 1,
    width: '100%',
  },

  // style for the nav button
  button: {
    fontSize: 40,
    backgroundColor: 'lightblue',
    textAlign: 'center',
    borderRadius: 10,
  },
  // style for all pressables
  pressable: {
    minWidth: '20%',
  },
});

export default GrainBinScreen;
