import React, { useCallback, useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, Image, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { removeToken } from '../services/AsyncStorageService';
import CardStats from '../Components/CardStats';
import house from '../assets/house.png'
import eye from '../assets/eye.png'
import userPicto from '../assets/user.png'
import send from '../assets/send.png'
import { AuthContext } from '../Context/AuthContext';
import { StorageContext } from '../Context/StorageContext';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { updateUser } from '../services/UserService';
import RNEventSource from 'react-native-event-source'



// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//     }),
// });

const Home = ({ navigation }) => {

    const { isLogged, isLoaded, setIsLogged, setEmail, user, setUser } = useContext(AuthContext)
    const { data, dataLoaded, setDataLoaded, setData, sendGetPropertiesStats, sendGetProspects, sendGetMessages, sendGetViews } = useContext(StorageContext)
    const [mes, setMes] = useState("")


    // const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState(false);
    // const notificationListener = useRef();
    // const responseListener = useRef();

    const [refreshing, setRefreshing] = useState(false);



    useEffect(() => {
        const eventSource = new RNEventSource('https://mercurehub.cedriclopez.com/.well-known/mercure?topic=/test');
        eventSource.addEventListener('message', (data) => {
            setMes(data.data)
        });
    }, []);

    useEffect(() => {
        if (isLoaded && !isLogged) {
            handleLogout()
        }
    }, [isLoaded]);

    // useEffect(() => {
    //     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    //     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {

    //         setNotification(notification);

    //     });

    //     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //         // Gérer les actions en réponse aux notifications
    //     });

    //     return () => {
    //         Notifications.removeNotificationSubscription(notificationListener.current);
    //         Notifications.removeNotificationSubscription(responseListener.current);
    //     };
    // }, []);


    // useEffect(() => {
    //     if (isLogged && expoPushToken && user?.exponentPushToken) {
    //         if (!user?.exponentPushToken.includes(expoPushToken)) {
    //             const newArray = [...user?.exponentPushToken, expoPushToken]
    //             updateUser(user.id, { exponentPushToken: newArray })
    //         }
    //     }

    // }, [expoPushToken])

    const onRefresh = () => {
        setRefreshing(true);
        Promise.all([
            sendGetPropertiesStats(data?.properties),
            sendGetProspects(data?.website?.id),
            sendGetMessages(data?.website?.id),
            sendGetViews(data?.website?.id)

        ]).then((res) => {
            setRefreshing(false);
        }).catch(() =>
            setRefreshing(false)
        )
    };


    const handleActivation = () => {
        const url = `https://start.agentkw.fr`;
        Linking.openURL(url);
    };

    const handleLogout = () => {
        removeToken('token')
        removeToken('refreshToken')
        setIsLogged(false)
        setDataLoaded(false)
        setEmail(null)
        setData({})
        navigation.replace('Login')
    }
    return (
        <>
            {(!isLogged || !dataLoaded) ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#CE181F" />
                </View>

            ) : (

                data.noWebsite ?
                    <View style={styles.containerNoWebsite}>
                        <View style={styles.textActivationContainer}>
                            <Text>
                                Vous n'avez actuellement
                            </Text>
                            <Text>
                                pas activé votre site.
                            </Text>
                        </View >
                        <TouchableOpacity onPress={handleActivation}>
                            <View style={styles.buttonActivation}>
                                <Text style={styles.buttonText}>Activer mon site</Text>
                            </View>
                        </TouchableOpacity>
                    </View>




                    :
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                        <View style={styles.container}>

                            <View style={styles.header} >
                                <View>
                                    <Text>Bonjour !</Text>
                                    <Text>{mes}</Text>

                                    <Text style={styles.heading}>{`${data?.agent?.firstname || ""} ${data?.agent?.lastname || ""}`}</Text>
                                </View>
                                <View style={styles.pictureContainer}>
                                    <Image source={{ uri: data?.agent?.picture }} style={styles.picture} />
                                </View>
                            </View>
                            <CardStats data={{ value: data?.propertiesCount || 0, title: "Mandats de vente" }} picto={house} backgroundColor={"#E8E9EB"} />
                            <CardStats data={{ value: data?.visits || 0, title: "Nombre de visites" }} picto={eye} backgroundColor={"rgba(148, 153, 218,0.15)"} />
                            <CardStats data={{ value: data?.prospects || 0, title: "Nombre de prospects" }} picto={userPicto} backgroundColor={"rgba(0, 154, 167,0.15)"} />
                            <CardStats data={{ value: data?.messages || 0, title: "Nombre de messages" }} picto={send} backgroundColor={"rgba(255, 188, 125,0.15)"} />
                        </View>
                    </ScrollView>
            )}

        </>
    );

};
// async function registerForPushNotificationsAsync() {
//     let token;

//     if (Platform.OS === 'android') {
//         await Notifications.setNotificationChannelAsync('default', {
//             name: 'default',
//             importance: Notifications.AndroidImportance.MAX,
//             vibrationPattern: [0, 250, 250, 250],
//             lightColor: '#FF231F7C',
//         });
//     }

//     if (Device.isDevice) {
//         const { status: existingStatus } = await Notifications.getPermissionsAsync();
//         let finalStatus = existingStatus;
//         if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync();
//             finalStatus = status;
//         }
//         if (finalStatus !== 'granted') {
//             alert('Failed to get push token for push notification!');
//             return;
//         }
//         token = (await Notifications.getExpoPushTokenAsync()).data;
//     } else {
//         alert('Must use physical device for Push Notifications');
//     }

//     return token;
// }

const styles = StyleSheet.create({
    textActivationContainer:
    {
        alignItems: 'center'
    },
    buttonActivation:
    {
        backgroundColor: '#009AA7',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,

    },
    buttonText:
    {
        padding: 10,
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '400',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    containerNoWebsite: {
        justifyContent: "center",
        alignItems: 'center',
        flex: 1,
        gap: 30
    },
    container: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        justifyContent: "space-between",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#CE181F',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 30,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    picture: {
        width: 50,
        height: 50,
        borderRadius: 100
    },
    pictureContainer: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 154, 167,0.15)',
    },
});
export default Home;