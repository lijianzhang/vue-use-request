import { useRequest } from './use-request';
import { isEqual } from 'lodash-es';
import { defineComponent, ref, PropType, watch } from 'vue';
import { useAxios } from './use-axios';
import { TimeFormat } from './time';
import { AxiosRequestConfig } from 'axios';

export const VueQuery = defineComponent({
    name: 'vue-query',
    props: {
        initalValue: {
            type: [String, Number, Object, Array] as PropType<any>,
            default: null,
        },
        url: {
            type: String,
            required: true,
        },
        /** 如果为false， 不执行请求 */
        if: {
            type: Boolean,
            default: true,
        },
        map: {
            type: Function,
            default: null,
        },
        lazy: {
            type: Boolean,
            default: false,
        },
        config: {
            type: Object as PropType<AxiosRequestConfig>,
            default: null,
        },
        /**
         * 如果请求失败重试次数
         *
         * @type {number}
         * @memberof IConfig
         */
        retry: {
            type: Number,
            default: null,
        },
        /**
         * 轮询请求
         *
         * @type {boolean}
         * @memberof IConfig
         */
        polling: {
            type: [String, Number, Boolean] as PropType<TimeFormat>,
            default: false,
        },
        /**
         * 请求去抖动 只取最后一次请求
         *
         * @type {TimeFormat}
         * @memberof IConfig
         */
        debounce: {
            type: [String, Number, Boolean] as PropType<TimeFormat>,
            default: false,
        },
        /**
         * 节流， 在一定时间范围内，取最后一次请求
         *
         * @type {TimeFormat}
         * @memberof IConfig
         */
        throttle: {
            type: [String, Number, Boolean] as PropType<TimeFormat>,
            default: false,
        },
        /**
         * 尝试取缓存数据
         *
         * @type {TimeFormat}
         * @memberof IConfig
         */
        cache: {
            type: [String, Number, Boolean] as PropType<TimeFormat>,
            default: false,
        },
        params: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props, ctx) {
        const axios = useAxios();
        if (!axios) {
            throw new Error(`Please try the following code before you execute
            import { createApp } from 'vue';
            import axios from 'axios';
            import { Request } from 'vue-use-request';
            const app = createApp();
            app.use(Request(axios));
            `)
        }
        let paramsVersion = ref(0);
        watch(() => props.params, (old, newData) => {
            if (!isEqual(old, newData)) {
                paramsVersion.value += 1;
            }
        })
        const { loading, data, error, run, stopPolling } = useRequest(
            async () => {
                if (!props.if) return props.initalValue;
                try {
                    const res = await axios.get(props.url, { ...props.config, params: props.params });
                    if (props.map) {
                        return res.data(res.data);
                    }
                    return res.data;
                } catch (error) {
                    throw error;
                }
            },
            {
                initalValue: props.initalValue,
                lazy: props.lazy,
                throttle: props.throttle,
                debounce: props.debounce,
                polling: props.polling,
                retry: props.retry,
                cache: props.cache as any,
                watch: [paramsVersion, () => props.url, () => props.if],
            },
        );
        return () => {
            if (!ctx.slots.default) return null;
            return ctx.slots.default({
                data,
                stopPolling,
                run: () => run(),
                error,
                loading,
            })
        }
    },
});
