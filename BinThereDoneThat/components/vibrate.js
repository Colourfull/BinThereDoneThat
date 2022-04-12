/****
 * file: vibrate.js
 * author: Devon Blewett <blewedev@uregina.ca>
 * student number: 200361371
 * CS855 Final Project
 * version: 1
 * last-modified: April-11-2022
 *
 *  This code is based on the example given in class by Dr. T.
 *
 ****/
import { Vibration } from 'react-native';
/**
 * function: vibrate
 * purpose: This function vibrates the user's phone for 100ms
 * paramaters: N/A
 * preconditions: a button is pressed that call this function
 * returns: N/A
 * Side effect: Phone vibrates
 **/
export default function vibrate() {
  Vibration.vibrate(100);
}
