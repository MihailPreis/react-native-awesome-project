import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Slider from '@react-native-community/slider';
import Cat from './Cat.view';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    catTable: {
        width: '100%',
        paddingHorizontal: 5
    },
    catImage: {
        flex: 1
    }
});

export default function CatViewer({ navigation, route }) {
    const [dataLn, setDataLn] = useState(1);

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.catTable}
                data={Array(dataLn)}
                ListHeaderComponent={
                    <View style={{ alignItems: 'center', paddingTop: 20 }}>
                        <Text>
                            🎉 {dataLn} - items 🎉
                        </Text>
                        <Slider
                            style={{ width: 200, height: 40 }}
                            value={dataLn}
                            minimumValue={1}
                            maximumValue={100}
                            minimumTrackTintColor="#1000FF"
                            maximumTrackTintColor="#AAAAAA"
                            onValueChange={(i) => setDataLn(Math.trunc(i))}
                        />
                    </View>
                }
                ListFooterComponent={
                    <View style={{ paddingBottom: 20 }}></View>
                }
                renderItem={(item) => <Cat key={'cat' + item.index} name={'Cat #' + (item.index + 1)} />}
                keyExtractor={(_, ind) => ind.toString()}
            />
        </View>
    );
}