import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from 'react-native';

const styles = StyleSheet.create({
    catCell: {
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#FFF1FF',
        margin: 5,
        padding: 10,
        paddingTop: 15
    }
});

export interface CatProps {
    name: string;
}

export default function Cat(props: CatProps) {
    const [isHungry, setIsHungry] = useState(true);
    const [timesPetted, setTimesPetted] = useState(0);

    const getPetterButtonTitle = (timesPetted: number, isHungry: boolean) => timesPetted > 28
        ? isHungry
            ? "Thanks, i'm full of you petters. fuck of..."
            : "Thanks, i'm full of you petters and full of eat!!1"
        : "Petted";

    return (
        <View style={styles.catCell}>
            <Text style={{ marginBottom: 10 }}>
                I am {props.name}, and I am {isHungry ? "hungry" : "full"}{timesPetted > 0 ? `, but I was stroked ${timesPetted} times!` : "!"}
            </Text>
            <Button
                onPress={() => {
                    setIsHungry(false);
                }}
                disabled={timesPetted > 28 || !isHungry}
                title={isHungry ? "Pour me some milk, please!" : "Thank you!"}
            />
            <Button
                onPress={() => {
                    var nextTimesPetter = timesPetted + 1
                    if (nextTimesPetter % 5 == 0) {
                        setIsHungry(true);
                    }
                    setTimesPetted(nextTimesPetter);
                }}
                disabled={timesPetted > 28}
                title={getPetterButtonTitle(timesPetted, isHungry)}
            />
        </View>
    );
}