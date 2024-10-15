import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import { StorageContext } from '../Context/StorageContext';

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { isLogged } = useContext(AuthContext)
    const { data, dataLoaded } = useContext(StorageContext)
    return (
        <>

            {
                (isLogged && dataLoaded && !data.noWebsite) &&
                <View style={styles.tabBarContainer}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];

                        const isFocused = state.index === index;
                        const picto = isFocused ? options.picto.red : options.picto.grey

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={onPress}
                                style={[
                                    styles.tabBarItem,
                                ]}
                            >
                                <View style={styles.pictoContainer}>
                                    <Image source={picto} style={styles.picto} resizeMode="contain" />
                                </View>
                                <View style={[styles.underline, { backgroundColor: isFocused ? "#CE011F" : "transparent" }]}></View>

                            </TouchableOpacity>

                        );
                    })}
                </View >
            }
        </>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 80,
        backgroundColor: '#FFFFFF',
    },
    tabBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    pictoContainer:
    {
        height: 20,
        width: 20
    },
    picto:
    {
        height: '100%',
        width: '100%',
    },
    underline:
    {
        width: 60,
        height: 3,
        marginTop: 10,
    }
});






export default CustomTabBar;
