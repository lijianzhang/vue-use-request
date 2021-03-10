type TimeUnit = 'd' | 'h' | 'm' | 's';

type StringTime = `${number}${TimeUnit}`



export type TimeFormat = number | StringTime;

/**
 * 时间格式
 *
 * @export
 * @param {TimeFormat} time
 * @returns
 * 
 * @example
 * getTime(1000) = 1000 ms
 * getTime('1d') = 1 day
 * getTime('1h') = 1 hour
 * getTime('1m') = 1 minute
 * getTime('10s') = 10 second
 */
export function getTime(time: TimeFormat) {
    if (typeof time === 'number') return time;

    if (typeof time === 'string' && /([.\d]+)([DdSsHhMm])$/.test(time)) {
        let t: number;
        const value = +RegExp.$1;
        const format = RegExp.$2.toLocaleLowerCase();

        if (format === 'd') {
            t = value * 24 * 60 * 60 * 1000;
        } else if (format === 'h') {
            t = value * 60 * 60 * 1000;
        } else if (format === 'm') {
            t = value * 60 * 1000;
        } else if (format === 's') {
            t = value * 1000;
        }

        return Date.now() + t!;
    }
    throw new Error('time must be number or string of valid format');
}
