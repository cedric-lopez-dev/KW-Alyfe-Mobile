import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import reco from '../assets/reco.png'

const getStatus = (status) => {

    switch (status) {
        case 'captured':
            return { label: 'Capturé', colorText: '#1D293E', colorBackground: 'rgba(29, 41, 62, 0.15)' }
        case 'cultivated':
            return { label: 'Cultivé', colorText: '#FFBC7D', colorBackground: 'rgba(255, 188, 125, 0.15)' }
        case 'connected':
            return { label: 'Connecté', colorText: '#9499DA', colorBackground: 'rgba(148, 153, 218, 0.15)' }
        case 'closed':
            return { label: 'Closé', colorText: '#009AA7', colorBackground: '(rgba(0, 154, 167, 0.15)' }
    }

}

const CardGrowth = ({ lead, last }) => {

    const split = lead?.fullname.split(" ")
    const initiales = split[0][0] + (split[1] ? split[1][0] : "")
    const leadStatus = getStatus(lead.status)

    return (

        <View style={[styles.container, !last && styles.borderBottom]}>

            <View style={styles.initialesContainer}>
                <Text style={styles.initiales}>{initiales}</Text>
            </View>
            <View style={styles.content} >
                <View style={styles.titleContainer}>
                    <Text style={styles.fullname}>{lead?.fullname}</Text>
                    <View style={styles.pictoContainer}>
                        <Image source={reco} style={styles.picto} resizeMode="contain" />
                    </View>
                </View>

                <Text style={styles.phone}>{lead?.phone}</Text>
                <Text style={styles.mail}>{lead?.email}</Text>
            </View>
            <View style={styles.infoContainer} >
                <Text style={styles.date}>{(new Date(lead.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }))}</Text>
                <View style={[styles.statusContainer, { backgroundColor: leadStatus.colorBackground }]}>
                    <Text style={[styles.status, { color: leadStatus.colorText }]}>{leadStatus.label}</Text>
                </View>

            </View>
        </View >

    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 0.5,
    },
    borderBottom: {
        borderBottomWidth: 0.25,
        borderColor: '#8F9294',
    },
    initialesContainer:
    {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#009AA7'
    },
    initiales:
    {
        color: '#009AA7',
        fontSize: 20,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    content: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 30
    },
    fullname: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '600'
    },
    phone:
    {
        fontSize: 12,
        fontWeight: '400'
    },
    mail:
    {
        fontSize: 12,
        fontWeight: '400'
    },
    infoContainer: {
        alignItems: 'center',
        gap: 5
    },
    date:
    {
        fontWeight: '400',
        fontSize: 12,
    },
    statusContainer:
    {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 50
    },
    status: {
        fontWeight: '600',
        fontSize: 10,
    },
    pictoContainer:
    {
        height: 16,
        width: 16
    },
    picto: {
        width: '100%',
        height: '100%',
    },
    titleContainer:
    {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    }

});
export default CardGrowth;