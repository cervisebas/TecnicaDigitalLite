import React, { useEffect, useState } from "react";
import { Schedule } from "../../Scripts/ApiTecnica/types";
import { DayData } from "./ScheduleProcess";
import { FlatList, ListRenderItemInfo, ScrollView, StyleSheet, View } from "react-native";
import { Divider, List, Text } from "react-native-paper";
import { safeDecode } from "../../Scripts/Utils";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../Scripts/Theme";

type IProps = {
    datas: DayData;
};

export default React.memo(function SchedulePage(props: IProps) {
    const time1 = ['7:15', '8:40', '9:50', '11:00'];
    const time2 = ['13:15', '14:25', '15:35', '16:45'];
    const [morning, setMorning] = useState<Schedule[]>([]);
    const [afternoon, setAfternoon] = useState<Schedule[]>([]);

    useEffect(()=>{
        setMorning(props.datas.days.filter((v)=>time1.find((b)=>v.hour == b)));
        setAfternoon(props.datas.days.filter((v)=>time2.find((b)=>v.hour == b)));
    }, []);

    function _renderItem(item: Schedule, index: number, array: Schedule[]) {
        let pTitle = (item.matter == 'none')? 'Libre': safeDecode(item.matter.name);
        let title = <>{(item.group == 'none')? pTitle: <><Text style={styles.textGroup}>{`(Grupo ${item.group})`}</Text> {pTitle}</>}</>;
        let showDivider = (array.length - 1) !== index;
        return(<>
            <List.Item
                key={`${item.day}-${item.hour}-${index}`}
                title={title}
                description={(item.matter == 'none')? undefined: safeDecode(item.matter.teacher.name)}
                left={(props)=><Icon {...props} name={'calendar-today'} size={32} color={(item.matter == 'none')? '#FF0000': props.color } />}
                right={(props)=><Text {...props}>{item.hour}</Text>}
                style={{ height: (item.matter == 'none')? 61: 68.5 }}
            />
            {(showDivider)&&<Divider />}
        </>);
    }

    return(<ScrollView style={styles.content}>
        <List.Section title={'Turno mañana'}>
            {morning.map(_renderItem)}
        </List.Section>
        <List.Section title={'Turno tarde'}>
            {afternoon.map(_renderItem)} 
        </List.Section>
    </ScrollView>);
});

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    textGroup: {
        fontWeight: '700',
        color: Theme.colors.secondary
    }
});