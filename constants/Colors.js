import {Platform } from 'react-native';

//for android
let primary = '#dd114b'; 
let accent = '#ffc107';
let switchColor = primary
let switchColorWhite = 'white';
let switchAccent = accent;
let switchWhiteAccent = '#d5d5d5';


//for ios
if(Platform.OS === 'ios'){
    switchColor = 'white'
    switchColorWhite= primary;
    switchAccent = '#d5d5d5'
    switchWhiteAccent = accent;
}




export default {
    //primary: '#8c144a',
    // accent: '#ff6f00'
    accent: '#ffc107',
    primary: '#dd114b',
    switchPrimary: switchColor,
    switchWhite : switchColorWhite,
    switchAccent: switchAccent,
    switchWhiteAccent: switchWhiteAccent,
};