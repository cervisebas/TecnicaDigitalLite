import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import { Card, Text, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../Scripts/Theme";

type IProps = {
    namestudent: string;
};
type IState = {};

export default class WelcomeCard extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Card style={styles.content}>
            <Card.Content style={styles.contentCard}>
                <Title style={styles.title}>Bienvenido/a:</Title>
                <Icon name={'account'} size={28} color={Theme.colors.secondary} style={styles.icon} />
                <Text style={styles.name}>{this.props.namestudent}</Text>
            </Card.Content>
        </Card>);
    }
}
const styles = StyleSheet.create({
    content: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 12
    },
    contentCard: {
        position: 'relative'
    },
    title: {
        fontWeight: '600'
    },
    icon: {
        position: 'absolute',
        top: 18,
        right: 12
    },
    name: {
        marginLeft: 14,
        marginTop: 4,
        fontSize: 18,
        fontWeight: '600'
    }
});