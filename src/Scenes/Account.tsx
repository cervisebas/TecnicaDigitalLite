import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";

type IProps = {};
type IState = {};

export default class Account extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}></View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    }
});