import { LogType } from './LogType';

export class LogEntry
{ 
    constructor(
        public type?: LogType,
        public path?: string,
        public args?: any[],
        public message?: string,
        public time?: Date)
    { }
}
