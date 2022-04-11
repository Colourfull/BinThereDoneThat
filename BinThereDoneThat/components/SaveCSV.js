/****
 * file: SaveCSV.js
 * author: Devon Blewett <blewedev@uregina.ca>
 * student number: 200361371
 * CS855 Final Project
 * version: 1
 * last-modified: April-11-2022
 * 
 * 
 * Regrettably, was not able to get this working properly before the due date, but left it in the files to work on later.  Causes "cannot generate url for blob" error, 
 * and I have no idea what that means
 ****/

import { CSVLink} from "react-csv";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';

/**
 * function: SaveCSV
 * purpose: This function is meant to save the data stored in the bins to a csv file, but at the moment does not work
 * paramaters: N/A
 * preconditions: A button is pressed to call the function, there is data in local storage to load and save, access to phone's file system
 * returns: N/A
 * Side effect: Writes the bin's data into a csv file that is stored in phones downloads
 **/
export default function SaveCSV (){
    // an array to store the bin's data, set with some default values if nothing is stored on the device
    const storageBins = [
        {
           name:"Bin 1",
           capacity:2000,
           bushelsInBin:0,
           grainInBin:"Wheat",
        },
        {
           name:"Bin 2",
           capacity:1000,
           bushelsinBin:0,
           grainInBin:"Duram",
        }
       ]
/**
 * function: setBinData
 * purpose: Updates the storageBins array by loading the bin data stored on the device and setting the values appropriately.  Prepares the data to be printed off.
 * paramaters: N/A
 * preconditions: storageBins is defined and has the appropriate fields, data is stored on the device to load
 * returns: N/A
 * Side effect: The storageBins array is updated with the phone's data for the two bins if there is any
 **/
    const setBinData = () => {
    // check each stored value one at a time and set the appropriate value in the array if data exists
    AsyncStorage.getItem('bushelsAmountbin1').then((bushelsLoaded) => {
        if (bushelsLoaded) {          
          storageBins[0].bushelsInBin = bushelsLoaded;
        }
      });
      AsyncStorage.getItem('grainStoredbin1').then((grainStored) => {
        if (grainStored) {
          storageBins[0].grainInBin = grainStored;

        } 
      });
      AsyncStorage.getItem('binCapacitybin1').then((binCapacity) => {
        if (binCapacity) {
          storageBins[0].capacity = binCapacity;
        } 
      });
      AsyncStorage.getItem('bushelsAmountbin2').then((bushelsLoaded) => {
        if (bushelsLoaded) {
          
            storageBins[1].bushelsinBin = bushelsLoaded;
          
        } 
      });
      AsyncStorage.getItem('grainStoredbin2').then((grainStored) => {
        if (grainStored) {
            storageBins[1].grainInBin = grainStored;
        }
      });
      AsyncStorage.getItem('binCapacitybin2').then((binCapacity) => {
        if (binCapacity) {
            storageBins[1].capacity = binCapacity;
        } 
      });
    }

  
// automatically call the setBinData function to load the stored data from the phone into the storageBins array
    useEffect(() => {
        setBinData();
      }, []);
return(
    <div>
        <CSVLink data={storageBins} >Download CSV</CSVLink>
    </div>
    )
}