import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Dialog, Paragraph } from "react-native-paper";

type IProps = {
    loadOutNow: ()=>any;
};
export type AlertCloseSessionRef = {
    open: ()=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function AlertCloseSession(props: IProps, ref: React.Ref<AlertCloseSessionRef>) {
    const [visible, setVisible] = useState(false);

    const open = ()=>setVisible(true);
    const close = ()=>setVisible(false);

    function logout() {
        close();
        props.loadOutNow();
    }

    useImperativeHandle(ref, ()=>({ open, close }));

    return(<Dialog visible={visible} dismissable={true} onDismiss={close}>
        <Dialog.Title>Alerta</Dialog.Title>
        <Dialog.Content><Paragraph>Está a punto de cerrar sesión. ¿Estás seguro que quieres realizar esta acción?</Paragraph></Dialog.Content>
        <Dialog.Actions>
            <Button onPress={close}>Cancelar</Button>
            <Button onPress={logout}>Aceptar</Button>
        </Dialog.Actions>
    </Dialog>);
}));