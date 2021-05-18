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
        height: 240,
        resizeMode: 'contain'
    }
});

export interface ImageButtonProps {
    image: any;
    onPress: () => void;
}

export default function ImageButton(props: ImageButtonProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.image} onPress={props.onPress}>
                <Image
                    style={styles.image}
                    source={props.image}
                />
            </TouchableOpacity>
        </View>
    )
}