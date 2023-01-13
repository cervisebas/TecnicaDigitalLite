type TypicalRes = {
    ok?: boolean;
    cause?: string;
    datas?: any;
};

// Students
type StudentsData = {
    id: string;
    name: string;
    dni: string;
    curse: string;
    tel: string;
    email: string;
    date: string;
    picture: string;
};
type FamilyDataAssist = {
    id: string;
    date: string;
    hour: string;
    status: string;
    credential: boolean;
};

// Matters
type Matter = {
    id: string;
    name: string;
    teacher: StudentsData;
};

// Schedules
type Schedule = {
    day: string;
    hour: string;
    group: string;
    matter: Matter | 'none';
};
type DataSchedule = {
    id: string;
    curse: string;
    data: Schedule[];
};

// Header
type ApiHeader = {
    headers: {
        Authorization: string;
        AppVersion: string;
    };
};

export type {
    ApiHeader,
    DataSchedule,
    FamilyDataAssist,
    StudentsData,
    Schedule,
    TypicalRes
};