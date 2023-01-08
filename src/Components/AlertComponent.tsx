import React, { PureComponent } from "react";
import { Button, Dialog, Paragraph } from "react-native-paper";

type IProps = {};
type IState = {
    visible: boolean;
    title: string;
    message: string;
};

export default class AlertComponent extends PureComponent<IProps, IState> {
    constructor(props : IProps) {
        super(props);
        this.state = {
            visible: false,
            title: 'Titulo de prueba',
            message: 'Labore occaecat ut aliqua laborum officia. Enim nostrud irure laboris velit ipsum culpa deserunt deserunt voluptate ad adipisicing ad. Aute ex pariatur velit non mollit cupidatat id deserunt cupidatat sint. Fugiat ipsum do mollit minim ex adipisicing eu reprehenderit.'
        };
        this.close = this.close.bind(this);
    }

    // Controller
    open(title: string, message: string) {
        this.setState({ visible: true, title, message });
    }
    close() {
        this.setState({ visible: false });
    }

    render(): React.ReactNode {
        return(<Dialog visible={this.state.visible} onDismiss={this.close}>
            <Dialog.Title>{this.state.title}</Dialog.Title>
            <Dialog.Content>
                <Paragraph>{this.state.message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={this.close}>Cerrar</Button>
            </Dialog.Actions>
        </Dialog>);
    }
}