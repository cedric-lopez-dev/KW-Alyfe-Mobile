import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import FlashMessage from "react-native-flash-message";

const Layout = ({ children }) => {

    return <View style={styles.container}>
        <FlashMessage />
        {children}

    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
});

export default Layout;
