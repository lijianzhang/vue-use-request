import { useRequest } from './use-request';
import { isEqual } from 'lodash-es';
import { defineComponent, ref, PropType, watch } from 'vue';
import { useAxios } from './use-axios';
import { TimeFormat } from './time';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from './use-mutation';

export const VueMutation = defineComponent({
    name: 'vue-mutation',
    props: {
        url: {
            type: String,
            required: true,
        },
        method: {
            type: String as PropType<'post' | 'put' | 'patch'>,
            default: 'post',
        },
        map: {
            type: Function,
            default: null,
        },
        onSuccess: {
            type: Function as PropType<(data: any) => any>,
            default: undefined,
        },
        onError: {
            type: Function as PropType<(error: Error) => any>,
            default: undefined,
        },
        config: {
            type: Object as PropType<AxiosRequestConfig>,
            default: null,
        },
        data: {
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

        const { loading, data, error, run } = useMutation(
            async () => {
                try {
                    const res = await axios[props.method](props.url, props.data, props.config);
                    if (props.map) {
                        return res.data(res.data);
                    }
                    return res.data;
                } catch (error) {
                    throw error;
                }
            },
            {
                onError: props.onError,
                onSuccess: props.onSuccess
            }
        );
        return () => {
            if (!ctx.slots.default) return null;
            return ctx.slots.default({
                data,
                run: () => run(),
                error,
                loading,
            })
        }
    },
});
