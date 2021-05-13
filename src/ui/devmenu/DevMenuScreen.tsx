import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Button, Alert, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Switch } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    table_spacer: {
        borderColor: '#eee',
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        height: 30
    },
    table_item_row: {
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
    },
    table_item: {
        marginVertical: 5,
        marginHorizontal: 24,
        alignItems: 'center',
        flexDirection: 'row'
    },
    table_item_image: {
        width: 10,
        marginVertical: 10,
        aspectRatio: 1
    }
})

function TableItem({ title, rightItem }) {
    return (
        <View style={styles.table_item_row}>
            <View style={styles.table_item}>
                <Text style={{ flex: 1, marginRight: 5 }}>{title}</Text>
                {rightItem}
            </View>
        </View>
    )
}

function TableSpaces() {
    return (<View style={styles.table_spacer} />)
}

interface CellItem {
    title: string;
    type: CellType;
    value: [any, any] | undefined;
    action: (() => void) | undefined;
}

enum CellType { SWITCH, BUTTON, SPACER }

export default function DevMenuScreen({ navigation, route }) {
    const [isEnabled1, setIsEnabled1] = useState(Math.random() < 0.5);
    const [isEnabled2, setIsEnabled2] = useState(Math.random() < 0.5);
    const [isEnabled3, setIsEnabled3] = useState(Math.random() < 0.5);

    let data: [Partial<CellItem>] = [
        { type: CellType.SPACER},
        { title: "Test switch 1", type: CellType.SWITCH, value: [isEnabled1, setIsEnabled1]},
        { title: "Test switch 2", type: CellType.SWITCH, value: [isEnabled2, setIsEnabled2]},
        { title: "Test switch 3", type: CellType.SWITCH, value: [isEnabled3, setIsEnabled3] },
        { type: CellType.SPACER },
        { title: "Test tapable cell", type: CellType.BUTTON, action: () => { alert(saveInfo()) } },
        { type: CellType.SPACER },
    ]

    const saveInfo = () => 'settings is:\nisEnabled1=' + isEnabled1 + ',\nisEnabled2=' + isEnabled2 + ',\nisEnabled3=' + isEnabled3;

    function buildView(item: Partial<CellItem>) {
        switch (item.type) {
            case CellType.BUTTON:
                const rtArrowImage = require('../../../assets/rtArrow.png');
                return (
                    <TouchableOpacity onPress={() => {
                        if (item.action !== undefined) {
                            item.action!();
                        }
                    }}>
                        <TableItem
                            title={item.title ?? "-"}
                            rightItem={<Image style={styles.table_item_image} source={rtArrowImage} />}
                        />
                    </TouchableOpacity>
                )
            case CellType.SWITCH:
                let value = item.value ?? [false, (a: Boolean) => { }]
                return (
                    <TableItem
                        title={item.title ?? "-"}
                        rightItem={
                            <Switch
                                trackColor={{ false: "#64e35b", true: "#6cbd53" }}
                                thumbColor="#fff"
                                onValueChange={() => value[1]((previousState: any) => !previousState)}
                                value={value[0]}
                            />
                        }
                    />
                )
            case CellType.SPACER:
                return <TableSpaces />
            default:
                return <View />
        }
    }

    return (
        <FlatList
            data={data}
            renderItem={(item) => buildView(item.item)}
            keyExtractor={(_, ind) => ind.toString()}
        />
    );
}