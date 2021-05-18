import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import ImageButton from './ImageButton';

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: '#fff'
    }
});

export default function HomeScreen({ navigation }) {
    const userImage = require('../../../assets/goToUserList.png');
    const catImage = require('../../../assets/goToCatsViewer.jpg');
    const takeAPhotoImage = require('../../../assets/takeAPhoto.png');
    const devMenuTipImage = require('../../../assets/devMenuTip.png');

    return (
        <ScrollView style={styles.scroll}>
            <ImageButton image={devMenuTipImage} onPress={() => alert("Shake!")} />
            <ImageButton image={userImage} onPress={() => navigation.navigate('UsersViewer')} />
            <ImageButton image={takeAPhotoImage} onPress={() => navigation.navigate('CameraScreen')} />
            <ImageButton image={catImage} onPress={() => navigation.navigate('CatViewer')} />
        </ScrollView>
    );
}