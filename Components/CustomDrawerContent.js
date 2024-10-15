import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StorageContext } from '../Context/StorageContext';
import { removeToken } from '../services/AsyncStorageService';
import logout from '../assets/logout.png'
import { AuthContext } from '../Context/AuthContext';

const CustomDrawerContent = ({ navigation }) => {
    const { data, dataLoaded, setDataLoaded, setData } = useContext(StorageContext)
    const { setIsLogged, setEmail } = useContext(AuthContext)
    const handleLogout = () => {
        removeToken('token')
        removeToken('refreshToken')
        setIsLogged(false)
        setDataLoaded(false)
        setEmail(null)
        setData({})
        navigation.navigate('Login');
    }
    const handlePress = () => {
        navigation.navigate('Tab');
    }
    return (
        <>
            {

                (dataLoaded) &&
                <View style={styles.container}>
                    {
                        !data.noWebsite &&
                        <TouchableOpacity onPress={handlePress}>
                            <View style={styles.elementDrawer}>
                                <View style={styles.initialesContainer}>
                                    <Text style={styles.initiales}>{`${data?.agent?.firstname[0] || ""} ${data?.agent?.lastname[0] || ""}`}</Text>
                                </View>
                                <View>
                                    <Text style={styles.elementTitle}>Site de {data?.agent?.firstname} {data?.agent?.lastname}</Text>
                                    <Text style={styles.elementSubtitle}>{data?.agent?.website}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    }


                    <TouchableOpacity onPress={handleLogout}>
                        <View style={styles.logoutContainer}>
                            <Image source={logout} style={styles.pictoLogout} resizeMode="contain" />
                            <Text style={styles.logoutText}>Se déconnecter</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 70,
        paddingBottom: 50,
        paddingHorizontal: 30,
    },
    elementDrawer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    initialesContainer:
    {
        backgroundColor: '#009AA7',
        width: 36,
        height: 36,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initiales:
    {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    elementTitle:
    {
        fontWeight: '500'
    },
    elementSubtitle:
    {
        fontSize: 12
    },
    logoutContainer:
    {
        flexDirection: 'row',
        gap: 10
    },
    pictoLogout: {
        width: 25,
        height: 25
    },
    logoutText:
    {
        fontWeight: '500'
    }
});

export default CustomDrawerContent;