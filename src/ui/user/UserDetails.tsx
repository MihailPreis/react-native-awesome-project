import React from 'react';
import { StyleSheet, View, Text, Image, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import UserModel from './UserModel';
import * as Sharing from 'expo-sharing';
import RNFetchBlob from 'rn-fetch-blob';
import Contacts, { Contact } from 'react-native-contacts';

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%'
    },
    container: {
        alignItems: 'center',
        margin: 5,
        padding: 24
    },
    avatar: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 1000,
        borderWidth: 2,
        marginBottom: 24
    },
    info_block: {
        flexDirection: 'column',
        paddingStart: 10,
        width: '100%'
    },
    usename: {
        fontWeight: 'bold',
        fontSize: 36,
        textAlign: 'center'
    },
    info_title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10
    },
    info_value: {
        fontSize: 16
    }
});

function InfoItem(prefs: { title: string, value: any }) {
    return (
        <>
            <Text style={styles.info_title}>{prefs.title}</Text>
            <Text style={styles.info_value}>{prefs.value}</Text>
        </>
    )
}

export default function UserDetails({ navigation, route }) {
    const model: UserModel = route.params.model;
    const username = [model.name.first, model.name.last]
        .filter(i => i.length > 0)
        .join(' ');
    const avatarBorder = model.gender == 'male'
        ? '#31ebe4'
        : '#fa41e7';
    const address = [
        model.location.postcode,
        model.location.country,
        model.location.state,
        model.location.city,
        model.location.street.name,
        model.location.street.number
    ].join(", ");

    async function openContactForm(level: number = 0) {
        if (level >= 3) return;
        level += 1;
        console.log("openContactForm level=" + level.toString())
        try {
            let permission = await Contacts.checkPermission();
            console.log("permission:", permission)
            switch (permission) {
                case 'authorized':
                    break;
                case 'denied':
                    await Contacts.requestPermission();
                    openContactForm();
                    return;
                case 'undefined':
                    await Contacts.requestPermission();
                    openContactForm();
                    return;
                default:
                    return;
            }
            let dob = new Date(model.dob.date);
            let path = await download_avatar();
            let contact: Partial<Contact> = {
                emailAddresses: [{
                    label: 'work',
                    email: model.email,
                }],
                familyName: model.name.last,
                givenName: model.name.first,
                phoneNumbers: [{
                    label: 'mobile',
                    number: model.phone,
                }],
                hasThumbnail: true,
                thumbnailPath: path,
                prefix: model.gender === "male" ? 'MR' : 'MRS',
                birthday: { 'year': dob.getFullYear(), 'month': dob.getMonth(), 'day': 1 },
            }
            await Contacts.openContactForm(contact);
        } catch (e) {
            console.warn("Contact create error:", e)
        }
    }

    function saveContact() {
        Alert.alert(
            "Подтвердите",
            "Хотите сохранить контакт?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => openContactForm() }
            ]
        );
    }

    async function download_avatar(): Promise<string> {
        const { config, fs } = RNFetchBlob
        let options = {
            fileCache: true,
            appendExt: 'jpg',
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: false,
                path: fs.dirs.DocumentDir + "/" + model.id.value,
                description: 'Downloading file.'
            }
        }
        return await config(options)
            .fetch('GET', model.picture.large)
            .then(r => "file://" + r.path())
    }

    async function shareAvatar() {
        if (!Sharing.isAvailableAsync()) return;
        try {
            let path = await download_avatar();
            await Sharing.shareAsync(path);
        } catch (err) {
            console.warn("User avatar download/share error: {}", err)
        }
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: username,
            headerRight: () => <Button onPress={saveContact} title="🗿" />,
        });
    }, [navigation]);

    return (
        <ScrollView style={styles.scroll}>
            <View style={styles.container}>
                <TouchableOpacity style={{ ...styles.avatar, borderColor: avatarBorder }} onPress={shareAvatar}>
                    <Image style={{ ...styles.avatar, borderColor: avatarBorder }} source={{ uri: model.picture.large }}></Image>
                </TouchableOpacity>
                <View style={styles.info_block}>
                    <Text style={styles.usename}>{username}</Text>
                    <InfoItem title="Age" value={model.dob.age} />
                    <InfoItem title="Date of birth" value={new Date(model.dob.date).toLocaleDateString()} />
                    <InfoItem title="Email" value={model.email} />
                    <InfoItem title="ID::Name" value={model.id.name} />
                    <InfoItem title="ID::Value" value={model.id.value} />
                    <InfoItem title="Login::UUID" value={model.login.uuid} />
                    <InfoItem title="Login::Username" value={model.login.username} />
                    <InfoItem title="Address" value={address} />
                </View>
            </View>
        </ScrollView>
    );
}