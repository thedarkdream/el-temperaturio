export type ApiTemperatureObj = {
    date: string;
    temperature: number;
}

export type ApiTemperatures = {
    artists: Array<ApiTemperatureObj>;
}

