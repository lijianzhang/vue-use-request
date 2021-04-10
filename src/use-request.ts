import { ref, UnwrapRef, watch, unref, WatchSource } from 'vue';
import { getTime, TimeFormat } from './time';
import { debounce, throttle } from 'lodash-es';

declare type MultiWatchSources = (WatchSource<unknown> | object)[];
export interface IConfig<T> {
    /**
     * 初始值
     *
     * @type {T}
     * @memberof IConfig
     */
    initalValue?: T,
    /**
     * 当函数内的响应式数据变化时，会重新触发请求
     *
     * @type {boolean}
     * @memberof IConfig
     */
    watch?: MultiWatchSources;
    /**
     * 如果请求失败重试次数
     *
     * @type {number}
     * @memberof IConfig
     */
    retry?: number;
    /**
     * 轮询请求
     *
     * @type {boolean}
     * @memberof IConfig
     */
    polling?: TimeFormat;
    /**
     * 请求去抖动 只取最后一次请求
     *
     * @type {TimeFormat}
     * @memberof IConfig
     */
    debounce?: TimeFormat;
    /**
     * 节流， 在一定时间范围内，取最后一次请求
     *
     * @type {TimeFormat}
     * @memberof IConfig
     */
    throttle?: TimeFormat;
    /**
     * 取缓存数据, 如果为true 则表示永久
     *
     * @type {TimeFormat}
     * @memberof IConfig
     */
    cache?: TimeFormat | boolean;

    /**
     * 惰性运行请求
     *
     * @type {boolean}
     * @memberof IConfig
     */
    lazy?: boolean;
}

const cacheMap = new Map<any, any>();

export function useRequest<T, E extends any>(requestFn: () => Promise<T>, config: IConfig<T> = {}) {
    const data = ref<T | null>();
    data.value = config?.initalValue ?? null;
    const loading = ref(false);
    const error = ref<E | null>(null);

    let pollingKey = 0;
    let handleRequest: (...args: any[]) => any = async function handleRequest() {
        clearTimeout(pollingKey);
        loading.value = true;

        if (config.cache && cacheMap.has(requestFn)) {
            const cache = cacheMap.get(requestFn);
            if (cache.expirationTime >= Date.now()) {
                data.value = cacheMap.get(requestFn).value;
                loading.value = false;
                return;
            } else {
                cacheMap.delete(requestFn);
            }
        }
        try {
            let retry = config.retry || 0;
            let res = null;

            while (retry >= 0) {
                try {
                    res = await requestFn();
                    retry = -1;
                } catch (error) {
                    retry -= 1;
                    if (retry < 0) {
                        throw error;
                    }
                }
            }

            if (config.cache && typeof window !== 'undefined') {
                cacheMap.set(requestFn, { value: unref(res), expirationTime: config.cache === true ? Number.MAX_VALUE : Date.now() + getTime(config.cache) })
            }
            data.value = res;
            error.value = null;
        } catch (err) {
            error.value = err;
        }

        if (config.polling) {
            pollingKey = setTimeout(handleRequest, getTime(config.polling));
        }

        loading.value = false;
    }
    
    const originHandleRequest = handleRequest;


    if (config.debounce) {
        handleRequest = debounce(originHandleRequest, getTime(config.debounce))
    }
    if (config.throttle) {
        handleRequest = throttle(originHandleRequest, getTime(config.throttle));
    }

    if (config.watch) {
        watch(config.watch, handleRequest);
    }

    
    if (!config.lazy) {
        handleRequest();
    }

    const stopPolling = () => {
        clearTimeout(pollingKey);
        config.polling = undefined;
    }

    const run = handleRequest;

    /**
     * 更新数据
     *
     * @param {T} newData
     */
    function update(newData: T) {
        data.value = newData;
    }

    return {
        run,
        update,
        stopPolling,
        error,
        loading,
        data
    }
}