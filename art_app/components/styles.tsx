import { theme } from '../components/theme';
import {StyleSheet, useWindowDimensions, Dimensions,} from 'react-native';

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    commentContainer: {
      backgroundColor: "white",
      flex: 1,
      height: 'auto',
      width: width * 0.2,
    },
    mobileCommentContainer: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 15,
      maxHeight: '80%',
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    commentModalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'white',
    },
    container: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 20,
      backgroundColor: theme.colors.background,
    },
    postBox: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: 10,
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    row2: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    imageSideBySide: {
      width: width * 0.4,
      height: height * 0.8, 
      resizeMode: 'contain',
      marginRight: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    mobileimg: {
      width: width,
      height: height,
      resizeMode: 'contain',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    overlay: { 
      flex: 1, 
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center', 
      alignItems: 'center',
     }, 
    modalView: { 
      margin: 20, 
      backgroundColor: 'white', 
      borderRadius: 10, 
      padding: 35, 
      alignItems: 'center', 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2, },
      shadowOpacity: 0.25, 
      shadowRadius: 4, 
      elevation: 5, 
    }, 
    closeButton: {
      position: 'absolute',
      top: 30,
      right: 30,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 10,
      borderRadius: 50,
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalText: { 
      marginBottom: 15, 
      textAlign: 'center',
    },
    info: {
      fontSize: 14,
      color: theme.colors.cap,
      fontWeight: '600',
    },
    image: {
      width: 'auto',
      height: 300,
      borderRadius: 8,
      marginVertical: 10,
      resizeMode: 'contain',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    bold: {
      fontWeight: 'bold',
    },
    caption: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.tertiary,
      fontWeight: '400',
    },
    commentBtn: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
    },
    commentBtnText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
});

  