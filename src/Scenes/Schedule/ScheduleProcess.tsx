import { Schedule } from "../../Scripts/ApiTecnica/types";

export type DayData = {
    name: string;
    days: Schedule[];
};

export type ScheduleProcessData = {

};

export default async function scheduleProcess(datas: Schedule[]) {
    const dataReturn = await filterBySchedule(datas);
    const finalData: DayData[] = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    // ##### Filter by days #####
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        let fData = dataReturn.find((v)=>v.name == day);
        if (fData) finalData[i] = fData;
    }
    return dataReturn;
}

function filterBySchedule(datas: Schedule[]): Promise<DayData[]> {
    return new Promise((resolve)=>{
        var dataReturn: DayData[] = [];
        function eachData(day: Schedule, index: number) {
            function findData(value: DayData) {
                return value.name == day.day;
            }
            let findIndex = dataReturn.findIndex(findData);
            if (findIndex == -1) return dataReturn.push({
                name: day.day,
                days: [day]
            });
            dataReturn[findIndex]['days'].push(day);
            if ((datas.length - 1) == index) resolve(dataReturn);
        }
        datas.forEach(eachData);
    });
}