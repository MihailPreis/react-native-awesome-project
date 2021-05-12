import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchUsers } from '../../common/network';
import UserCard from './UserCard';
import UserModel, { UsersResponse } from './UserModel';

const styles = StyleSheet.create({
    f: {
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    table: {
        width: '100%',
        paddingHorizontal: 5
    }
});

export default function UsersScreen({ navigation, route }) {
    const pageSize = 30;

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const currentPage = () => Math.ceil(data.length / pageSize);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => alert('fuck')} title="⚙️" />
            ),
        });
    }, [navigation]);

    useEffect(() => {
        load(false)
    }, []);

    const load = (isMore: boolean = false) => {
        if (isLoading) return;
        setLoading(true);
        fetchUsers(currentPage() + 1, pageSize)
            .then((json) => setData((items) => {
                if (isMore) {
                    return items.concat(json.results)
                } else {
                    return json.results
                }
            }))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.table}
                data={data}
                refreshing={false}
                onRefresh={() => load(false)}
                onEndReached={(_) => load(true)}
                onEndReachedThreshold={5}
                renderItem={(item) => (
                    <TouchableOpacity onPress={() => { navigation.navigate('UserDetails', { model: item.item }) }}>
                        <UserCard key={'userCard-' + item.index} model={item.item} />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    isLoading
                        ? <ActivityIndicator />
                        : <Text>Да чета ничего и нету капец 👀</Text>
                }
                ListHeaderComponent={
                    <View style={{ paddingTop: 5 }}></View>
                }
                ListFooterComponent={
                    <View style={{ paddingBottom: 20 }}></View>
                }
                contentContainerStyle={data.length > 0 ? {} : { flex: 1, alignItems: 'center', justifyContent: 'center' }}
                keyExtractor={(i, _) => i.login !== undefined ? i.login.uuid : i.toString()}
            />
        </View>
    );
}
