import React, { PureComponent } from "react";
import { Button, Card, IconButton, ProgressBar, Text, Tooltip } from "react-native-paper";
import { Theme } from "../../Scripts/Theme";
import PointItemText from "../../Components/PointItemText";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Color from "color";
import { Family } from "../../Scripts/ApiTecnica";
import { FamilyDataAssist } from "../../Scripts/ApiTecnica/types";

type IProps = {
    id: string;
    // Functions
    openDetailsAssit: (data: FamilyDataAssist[])=>any;
    controllerAlert: (visible: boolean, title?: string, message?: string)=>void;
};
type IState = {
    // Controller
    isLoading: boolean;
    isError: boolean;
    isDisableDetailAssist: boolean;
    messageError: string;
    // Datas
    assist: string;
    notAssist: string;
    total: string;
};

export default class AssistCard extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false,
            isDisableDetailAssist: false,
            messageError: '',
            assist: 'Cargando...',
            notAssist: 'Cargando...',
            total: 'Cargando...'
        };
        this.loadData = this.loadData.bind(this);
        this.openDetailsAssit = this.openDetailsAssit.bind(this);
        this.showNotData = this.showNotData.bind(this);
    }
    private assistData: FamilyDataAssist[] = [];

    componentDidUpdate(prevProps: Readonly<IProps>, _prevState: Readonly<IState>, _snapshot?: any): void {
        if (prevProps.id !== this.props.id) this.loadData();
    }
    componentDidMount(): void {
        this.loadData();
    }
    loadData() {
        if (this.props.id == '-') return;
        this.setState({ isLoading: true, isError: false, isDisableDetailAssist: false, assist: 'Cargando...', notAssist: 'Cargando...', total: 'Cargando...' }, ()=>
            Family.getDataAssistStudent().then((data)=>{
                let assists: number = 0;
                let notAssists: number = 0;
                let disable: boolean = false;
                data.forEach((v)=>(v.status)? assists += 1: notAssists += 1);
                disable = data.length == 0;
                this.assistData = data;
                this.setState({
                    isLoading: false,
                    assist: assists.toString(),
                    notAssist: notAssists.toString(),
                    total: data.length.toString(),
                    isDisableDetailAssist: disable
                });
            })
            .catch((error)=>this.setState({
                isLoading: false,
                isError: true,
                messageError: error.cause
            }))
        );
    }
    openDetailsAssit() {
        this.props.openDetailsAssit(this.assistData);
    }
    showNotData() {
        this.props.controllerAlert(true, 'No se encontraron datos', 'En este momento no se encuentran datos de asistencia, si crees que en realidad debe de haber, recarga los datos o espere a que un preceptor se encargue más tarde de cargarlos.');
    }

    render(): React.ReactNode {
        return(<Card style={styles.content}>
            {(!this.state.isError)? <>
                {(this.state.isLoading)&&<ProgressBar indeterminate={true} />}
                <Card.Title
                    title={'Asistencia:'}
                    titleStyle={styles.title}
                    titleVariant={'titleMedium'}
                    right={(props)=><Tooltip title={'Recargar'}>
                        <IconButton
                            {...props}
                            icon={'reload'}
                            //disabled={this.props.isLoading}
                            onPress={(!this.state.isLoading)? this.loadData: undefined}
                            iconColor={(this.state.isLoading)? Color(Theme.colors.tertiary).alpha(0.5).rgb().string(): Theme.colors.secondary}
                        />
                    </Tooltip>}
                />
                <Card.Content>
                    <PointItemText title="Presentes" text={this.state.assist} />
                    <PointItemText title="Ausentes" text={this.state.notAssist} />
                    <PointItemText title="Total" text={this.state.total} />
                </Card.Content>
                <Card.Actions style={styles.cardAction}>
                    <Button
                        icon={'account-details'}
                        //disabled={this.props.isLoading || this.props.isDisableDetailAssist}
                        onPress={(this.state.isLoading || this.state.isDisableDetailAssist)? this.showNotData: this.openDetailsAssit}
                        mode={'text'}
                        //buttonColor={(this.props.isLoading)? Color(Theme.colors.tertiary).alpha(0.5).rgb().string(): undefined}
                        textColor={(this.state.isLoading || this.state.isDisableDetailAssist)? Color(Theme.colors.tertiary).alpha(0.5).rgb().string(): undefined}
                    >
                        Ver detalles
                    </Button>
                </Card.Actions>
            </>:
            <>
                <Card.Content>
                    <View style={styles.contentError}>
                        <Icon name={'alert-outline'} size={48} style={styles.iconError} />
                        <Text style={styles.textError}>{this.state.messageError}</Text>
                        <IconButton
                            icon={'reload'}
                            iconColor={Theme.colors.primary}
                            size={28}
                            onPress={this.loadData}
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
        marginTop: 10,
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