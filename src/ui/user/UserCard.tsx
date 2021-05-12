import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, FlatList, TouchableHighlight, SafeAreaView } from 'react-native';
import UserModel from './UserModel';

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: '#FFF1FF',
        margin: 5,
        padding: 10,
        paddingTop: 15
    },
    avatar: {
        height: 52,
        width: 50,
        borderRadius: 25,
        borderWidth: 2
    }
});

export interface UserCardProps {
    model: UserModel;
}

export default function UserCard(props: UserCardProps) {
    const avatarBorder = props.model.gender == 'male' ? '#31ebe4' : '#fa41e7';
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Image style={{ ...styles.avatar, borderColor: avatarBorder }} source={{ uri: props.model.picture.medium }}></Image>
                <View style={{ flexDirection: 'column', paddingStart: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{[props.model.name.first, props.model.name.last].filter((i) => i.length > 0).join(' ')}</Text>
                    <Text style={{ fontSize: 12 }}>{props.model.email}</Text>
                </View>
            </View>
        </View>
    );
}