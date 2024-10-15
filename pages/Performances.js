import React, { useCallback, useContext, useState } from 'react';
import { Image, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardPerf from '../Components/CardPerf';
import { StorageContext } from '../Context/StorageContext';
import sad from '../assets/sad.png'

const Performances = () => {



    const { data, sendGetProperties } = useContext(StorageContext)
    const [refreshing, setRefreshing] = useState(false);

    const handleCardPress = (property) => {
        const url = `https://${data?.website?.subdomain}.${data?.website.domain}/annonces/${stringToValidURL(property.title)}/${property.id}`;
        Linking.openURL(url);
    };
    const stringToValidURL = (inputString) => {
        const accentChars = ['À-Ö', 'Ø-ö', 'ø-ÿ']; // Character ranges for accented letters
        const specialChars = ['!', '*', "'", "(", ")", ",", ";", ":", "@", "&", "=", "+", "$", "/", "?", "%", "#", "[", "]", "\\", "<", ">"];
        let validURL = inputString
            .replace(new RegExp(`[${accentChars.join('')}]`, 'g'), removeAccents)
            .replace(/[^\w\-._~]/g, '-')
            .replace(new RegExp(`[${specialChars.join('\\')}]`, 'g'), '-')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase();

        return validURL
    }
    const removeAccents = char => {
        return accentMap[char] || char;
    }

    // Map of correspondences between accented characters and their unaccented equivalents
    const accentMap = {
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
        'Æ': 'AE', 'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
        'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N',
        'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O',
        'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ý': 'Y', 'Þ': 'TH',
        'ß': 'ss', 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
        'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e',
        'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'd',
        'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ý': 'y',
        'þ': 'th', 'ÿ': 'y'
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        sendGetProperties(data.agent.id).then((res) => {
            setRefreshing(false);
        }).catch(() =>
            setRefreshing(false)
        )
    }, []);
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.container}>
                <Text style={styles.heading}>Performances</Text>
                <Text style={styles.subtitle}>Découvrez les performances générées sur vos mandats de vente</Text>
            </View>
            {
                data?.properties ?
                    data.properties.map((property, i) => (
                        <TouchableOpacity key={property.id} onPress={() => handleCardPress(property)}>
                            <CardPerf dataProperty={property} last={i === data.properties.length - 1} />
                        </TouchableOpacity>

                    )) :
                    <View style={styles.containerSad}>

                        <View style={styles.pictoContainerSad}><Image source={sad} style={styles.picto} resizeMode="contain" /></View>

                        <Text>Vous n'avez pas de mandats pour le moment.</Text>

                    </View>
            }
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        justifyContent: "space-between",
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 10,
        marginBottom: 20,
        fontWeight: '400',
    },
    pictoContainerSad: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    picto: {
        height: '100%',
    },
    containerSad: {
        paddingTop: 30,
        alignItems: "center",
    },
})

export default Performances;