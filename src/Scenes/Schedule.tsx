import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";

type IProps = {};
type IState = {};

export default class Schedule extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'Mi horario'} />
            </Appbar.Header>
            <View style={styles.content}>

            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    }
});