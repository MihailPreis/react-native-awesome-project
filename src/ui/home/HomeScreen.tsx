import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1
    },
    image: {
        width: '100%',
        height: 250
    }
});

export default function HomeScreen({ navigation }) {
    const userImage = require('../../../assets/goToUserList.png');
    const catImage = require('../../../assets/goToCatsViewer.jpg');

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity style={styles.image} onPress={() => navigation.navigate('UsersViewer')}>
                    <Image
                        style={styles.image}
                        source={userImage}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ ...styles.container, flexDirection: 'column-reverse' }}>
                <TouchableOpacity style={styles.image} onPress={() => navigation.navigate('CatViewer')}>
                    <Image
                        style={styles.image}
                        source={catImage}
                    />
                </TouchableOpacity>
            </View>
        </>
    );
}