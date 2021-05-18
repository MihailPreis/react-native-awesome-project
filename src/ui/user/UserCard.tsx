import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import UserModel from './UserModel';

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: '#FFF1FF',
        margin: 5,
        padding: 15,
        paddingTop: 15,
        flexDirection: 'row'
    },
    avatar: {
        height: 52,
        width: 50,
        borderRadius: 25,
        borderWidth: 2
    },
    inner_container: {
        flexDirection: 'column',
        alignSelf: 'center',
        paddingStart: 15,
    },
    name_title: {
        fontWeight: 'bold',
        fontSize: 16
    },
    val_title: {
        fontSize: 14
    }
});

export interface UserCardProps {
    model: UserModel;
}

export default function UserCard(props: UserCardProps) {
    const avatarBorder = props.model.gender == 'male' ? '#31ebe4' : '#fa41e7';
    const name = [props.model.name.first, props.model.name.last]
        .filter((i) => i.length > 0)
        .join(' ');
    return (
        <View style={styles.container}>
            <Image
                style={{ ...styles.avatar, borderColor: avatarBorder }}
                source={{ uri: props.model.picture.medium }}
            />
            <View style={styles.inner_container}>
                <Text style={styles.name_title}>{name}</Text>
                <Text style={styles.val_title}>{props.model.email}</Text>
            </View>
        </View>
    );
}