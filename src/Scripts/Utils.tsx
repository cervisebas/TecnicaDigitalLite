import { decode } from "base-64";
import moment from "moment";

export function waitTo(wait: number): Promise<void> {
    return new Promise((resolve)=>setTimeout(resolve, wait));
}
export function safeDecode(str: string) {
    try {
        return decode(str);
    } catch  {
        return str;
    }
}
export function getForScale(scale: number, size: number) {
    return ((scale * size) / 1);
}
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
export function calcYears(date: string): string {
    var dateNow = new Date();
    var processDate = moment(date, 'DD-MM-YYYY').toDate();
    var years = dateNow.getFullYear() - processDate.getFullYear();
    var months = dateNow.getMonth() - processDate.getMonth();
    if (months < 0 || (months === 0 && dateNow.getDate() < processDate.getDate())) years--;
    return String(years);
}