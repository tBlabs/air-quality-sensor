import { LogType } from './LogType';
import { LogEntry } from './LogEntry';

export class LoggerConfig
{
    public output: (entry: LogEntry) => void;
}
