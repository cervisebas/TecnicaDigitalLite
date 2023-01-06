import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type IProps = {
    title: string;
    text: string;
};

export default React.memo(function PointItemText(props: IProps) {
    return(<View style={styles.pointItem}>
        <Text style={styles.pointItem_text1}>⦿</Text>
        <Text style={styles.pointItem_text2}>{`${props.title}:`}</Text>
        <Text style={styles.pointItem_text3}>{props.text}</Text>
    </View>);
});

const styles = StyleSheet.create({
    pointItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    pointItem_text1: { marginLeft: 14 },
    pointItem_text2: { marginLeft: 6, fontWeight: 'bold' },
    pointItem_text3: { marginLeft: 2 }
});