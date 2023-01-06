import React, { PureComponent } from "react";
import { Button, Card, IconButton, ProgressBar, Text } from "react-native-paper";
import { Theme } from "../../Scripts/Theme";
import PointItemText from "../../Components/PointItemText";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Color from "color";

type IProps = {
    // Controller
    isLoading: boolean;
    isError: boolean;
    isDisableDetailAssist: boolean;
    messageError: string;
    // Datas
    assist: string;
    notAssist: string;
    total: string;
    // Functions
    reloadAssist: ()=>any;
    openDetailsAssit: ()=>any;
};
type IState = {};

export default class AssistCard extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Card style={styles.content}>
            {(!this.props.isError)? <>
                {(this.props.isLoading)&&<ProgressBar indeterminate={true} />}
                <Card.Title
                    title={'Asistencia:'}
                    titleStyle={styles.title}
                    titleVariant={'titleMedium'}
                    right={(props)=><IconButton
                        {...props}
                        icon={'reload'}
                        //disabled={this.props.isLoading}
                        onPress={(!this.props.isLoading)? this.props.reloadAssist: undefined}
                        iconColor={(this.props.isLoading)? Color(Theme.colors.tertiary).alpha(0.5).rgb().string(): Theme.colors.secondary}
                    />}
                />
                <Card.Content>
                    <PointItemText title="Presentes" text={this.props.assist} />
                    <PointItemText title="Ausentes" text={this.props.notAssist} />
                    <PointItemText title="Total" text={this.props.total} />
                </Card.Content>
                <Card.Actions style={styles.cardAction}>
                    <Button
                        icon={'account-details'}
                        //disabled={this.props.isLoading || this.props.isDisableDetailAssist}
                        onPress={(this.props.isLoading || this.props.isDisableDetailAssist)? undefined: this.props.openDetailsAssit}
                        mode={'text'}
                        //buttonColor={(this.props.isLoading)? Color(Theme.colors.tertiary).alpha(0.5).rgb().string(): undefined}
                        textColor={(this.props.isLoading || this.props.isDisableDetailAssist)? Color(Theme.colors.tertiary).alpha(0.5).rgb().string(): undefined}
                    >
                        Ver detalles
                    </Button>
                </Card.Actions>
            </>:
            <>
                <Card.Content>
                    <View style={styles.contentError}>
                        <Icon name={'alert-outline'} size={48} style={styles.iconError} />
                        <Text style={styles.textError}>{this.props.messageError}</Text>
                        <IconButton
                            icon={'reload'}
                            iconColor={Theme.colors.primary}
                            size={28}
                            onPress={this.props.reloadAssist}
                            style={styles.iconButtonError}
                        />
                    </View>
                </Card.Content>
            </>}
        </Card>);
    }
}

const styles = StyleSheet.create({
    content: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 8,
        overflow: 'hidden'
    },
    contentError: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 12
    },
    title: {
        fontWeight: '600',
        fontSize: 20
    },
    cardAction: {
        justifyContent: 'flex-end'
    },
    iconError: {
        fontSize: 48
    },
    textError: {
        marginTop: 10,
        fontWeight: '700',
        fontSize: 16
    },
    iconButtonError: {
        marginTop: 12
    }
});