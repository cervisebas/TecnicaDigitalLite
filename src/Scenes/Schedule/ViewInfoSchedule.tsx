import React, { useState, forwardRef, useImperativeHandle } from "react";
import CustomModal from "../../Components/CustomModal";
import { StyleSheet, View } from "react-native";
import { Appbar, List } from "react-native-paper";
import { Theme } from "../../Scripts/Theme";
import { Matter, Schedule } from "../../Scripts/ApiTecnica/types";
import { safeDecode } from "../../Scripts/Utils";
import ImageLazyLoad from "../../Components/ImageLazyLoad";
import { decode } from "base-64";
import { urlBase } from "../../Scripts/ApiTecnica";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";

type IProps = {};
export type ViewInfoScheduleRef = {
    open: (schedule: Schedule)=>void;
};

export default React.memo(forwardRef(function ViewInfoSchedule(props: IProps, ref: React.Ref<ViewInfoScheduleRef>) {
    const [visible, setVisible] = useState(false);
    const [schedule, setSchedule] = useState<Schedule | undefined>(undefined);

    function close() {
        setVisible(false);
    }
    function open(s: Schedule) {
        setVisible(true);
        setSchedule(s);
    }

    function _left(props: any) {
        return(<Icon
            {...props}
            name={'information-outline'}
            size={32}
        />);
    }

    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={close} animationIn={'fadeInRight'} animationInTiming={200} animationOut={'fadeOutLeft'} animationOutTiming={200} backdropTransitionInTiming={0} backdropTransitionOutTiming={0} useBackdrop={false}>
        <View style={styles.content}>
            <Appbar.Header>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={'Ver más detalles'} />
            </Appbar.Header>
            {(schedule)&&<View style={{ flex: 1 }}>
                <List.Section title={'Información'}>
                    <List.Item title={'Nombre de la materia'} description={safeDecode((schedule.matter as Matter).name)} descriptionStyle={{ marginLeft: 4 }} left={_left} />
                    {(schedule.group !== 'none')&&<List.Item title={'Grupo asignado'} description={`Grupo ${schedule.group}`} descriptionStyle={{ marginLeft: 4 }} left={_left} />}
                    <List.Item title={'Horario asignado'} description={`${schedule.hour} ~ ${moment(schedule.hour, 'HH:mm').add(1, 'hour').format('HH:mm')}`} descriptionStyle={{ marginLeft: 4 }} left={_left} />
                </List.Section>
                <List.Section title={'Docente'}>
                    <List.Item
                        left={()=><ImageLazyLoad
                            circle={true}
                            size={56}
                            loadSize={'small'}
                            source={{ uri: `${urlBase}/image/${decode((schedule.matter as Matter).teacher.picture)}` }}
                        />}
                        title={safeDecode((schedule.matter as Matter).teacher.name)}
                        description={safeDecode((schedule.matter as Matter).teacher.curse)}
                        style={{ height: 68.5, paddingLeft: 12 }}
                    />
                </List.Section>
            </View>}
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: Theme.colors.background
    }
});