import { ref } from 'vue';


export interface IMutationOptions<T> {
    onSuccess?: (data: T) => any;
    onError?: (error: Error) => any;
}

export function useMutation<T, A extends any[], M>(requestFn: (...args: A) => Promise<T>, config: IMutationOptions<T> = {}) {
    const data = ref<T>();

    const loading = ref(false);
    const error = ref<Error | null>(null);

    let pollingKey = 0;
    let handleRequest: (...args: A) => any = async function handleRequest(...args: A) {
        clearTimeout(pollingKey);
        loading.value = true;

        try {
            const res = await requestFn(...args);
            data.value = res;
            error.value = null;
            if (config.onSuccess) {
                config.onSuccess(data.value!);
            }
        } catch (err) {
            error.value = err as any;
            if (config.onError) {
                config.onError(err as any);
            }
        }

        loading.value = false;
    }

    const run = handleRequest;

    return {
        run,
        error,
        loading,
        data
    }
}
