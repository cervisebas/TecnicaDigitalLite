import React, { PureComponent, createRef } from "react";
import { Route, StyleSheet, View } from "react-native";
import { BottomNavigation, Provider as PaperProvider, Portal, Text } from "react-native-paper";
import Home from "./Scenes/Home";
import Account from "./Scenes/Account";
import { Theme } from "./Scripts/Theme";
import Session from "./Screens/Session";
import ScreenLoading, { ScreenLoadingRef } from "./Screens/ScreenLoading";
import SplashScreen from "./Screens/SplashScreen";
import { Family, urlBase } from "./Scripts/ApiTecnica";
import { StudentsData } from "./Scripts/ApiTecnica/types";
import { waitTo } from "./Scripts/Utils";
import { decode } from "base-64";
import ChangeCardDesign from "./Screens/ChangeCardDesign";
import AlertComponent from "./Components/AlertComponent";
import ImageViewer from "./Screens/ImageViewer";
import Schedule from "./Scenes/Schedule";

type IProps = {};
type IState = {
    index: number;
    datas: StudentsData;
};

export default class App extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            index: 0,
            datas: this.defaultDatas
        };
        this._onIndexChange = this._onIndexChange.bind(this);
        this._renderScene = this._renderScene.bind(this);
        this.init = this.init.bind(this);
        this._openChangeCardDesign = this._openChangeCardDesign.bind(this);
        this._changeNowCardDesign = this._changeNowCardDesign.bind(this);
        this._controllerAlert = this._controllerAlert.bind(this);
        this._openImageViewer = this._openImageViewer.bind(this);
    }
    private routes = [
        { key: 'home', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
        { key: 'schedule', title: 'Mi horario', focusedIcon: 'calendar-text', unfocusedIcon: 'calendar-text-outline' },
        { key: 'details', title: 'Mi cuenta', focusedIcon: 'account', unfocusedIcon: 'account-outline' }
    ];
    private defaultDatas = { id: '-', name: '-', dni: '-', curse: '-', tel: '-', email: '-', date: '-', picture: '-' };
    private refHome = createRef<Home>();
    private refSession = createRef<Session>();
    private refScreenLoading = createRef<ScreenLoadingRef>();
    private refChangeCardDesign = createRef<ChangeCardDesign>();
    private refAlertComponent = createRef<AlertComponent>();
    private refImageViewer = createRef<ImageViewer>();

    componentDidMount(): void {
        /*RNSplashScreen.hide();
        SystemNavigationBar.setNavigationColor(Theme.colors.elevation.level2, 'dark');
        StatusBar.setBackgroundColor('#FFFFFF');
        StatusBar.setBarStyle('dark-content');*/
    }
    async init() {
        this.setState({ datas: this.defaultDatas });
        this.refScreenLoading.current?.open();
        this.refScreenLoading.current?.setText(true, 'Iniciando sesión...');
        try {
            await Family.verify();
            this.refScreenLoading.current?.setText(true, 'Obteniendo datos locales...');
            const getLocalData = await Family.getDataLocal();
            this.refScreenLoading.current?.setInformation(decode(getLocalData.name), `${urlBase}/image/${decode(getLocalData.picture)}`);
            this.refScreenLoading.current?.setEndHere(true);
            this.refScreenLoading.current?.startAnimation();
            await waitTo(1024);
            this.refScreenLoading.current?.setText(true, 'Obteniendo información...');
            const studentData = await Family.getDataStudent();
            this.setState({ datas: studentData });
            await waitTo(1000);
            this.refScreenLoading.current?.close();
        } catch (error: any) {
            if (error.relogin) {
                await waitTo(1024);
                this.refScreenLoading.current?.close();
                return this.refSession.current?.open();
            }
            this.refScreenLoading.current?.setShowLoading(false);
            this.refScreenLoading.current?.setText(true, error.cause);
        }
    }
    _openChangeCardDesign() {
        this.refChangeCardDesign.current?.open();
    }
    _changeNowCardDesign(id: number) {
        this.refHome.current?.refCardCredential.current?.setDesign(id);
    }
    _controllerAlert(visible: boolean, title?: string, message?: string) {
        if (!visible) return this.refAlertComponent.current?.close();
        this.refAlertComponent.current?.open(title!, message!);
    }
    _openImageViewer(source: string) {
        this.refImageViewer.current?.open(source);
    }
    
    // Navigation
    _onIndexChange(index: number) {
        this.setState({ index });
    }
    _renderScene(props: { route: Route; jumpTo: (key: string) => void; }) {
        switch (props.route.key) {
            case 'home':
                return(<Home
                    ref={this.refHome}
                    datas={this.state.datas}
                    openChangeDesign={this._openChangeCardDesign}
                    openImageViewer={this._openImageViewer}
                    controllerAlert={this._controllerAlert}
                />);
            case 'schedule':
                return <Schedule
                    datas={this.state.datas}
                />;
            case 'details':
                return <Account />;
        }
    }
    _renderLabel(props: { route: Route; focused: boolean; color: string; }) {
        return(<Text
            style={styles.labelNavigation}
            variant={'labelMedium'}
        >
            {props.route.title}
        </Text>);
    }

    render(): React.ReactNode {
        return(<View style={styles.content}>
            <PaperProvider theme={Theme}>
                <BottomNavigation
                    navigationState={{
                        index: this.state.index,
                        routes: this.routes
                    }}
                    sceneAnimationEnabled={true}
                    sceneAnimationType={'shifting'}
                    onIndexChange={this._onIndexChange}
                    renderScene={this._renderScene}
                    renderLabel={this._renderLabel}
                />
                <Session ref={this.refSession} initNow={this.init} />
                <ScreenLoading ref={this.refScreenLoading} />
                <SplashScreen initNow={this.init} />
                <ImageViewer ref={this.refImageViewer} />
                <ChangeCardDesign ref={this.refChangeCardDesign} changeDesign={this._changeNowCardDesign} />
                <Portal>
                    <AlertComponent ref={this.refAlertComponent} />
                </Portal>
            </PaperProvider>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    labelNavigation: {
        fontSize: 12,
        height: 56,
        textAlign: 'center',
        backgroundColor: 'transparent'
    }
});