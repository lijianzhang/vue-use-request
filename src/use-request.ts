import { ref, UnwrapRef, watchEffect } from 'vue';
interface IConfig<T> {
    initalValue?: T,
    watch?: boolean;
    
}

export function useRequest<T, E extends any>(requestFn: () => Promise<UnwrapRef<T>>, config: IConfig<T>) {
    const data = ref<T | null>(config?.initalValue ?? null);
    const loading = ref(false);
    const error = ref<E | null>(null);

    async function handleRequest() {
        loading.value = true;

        try {
            if (config.watch) {
                const wrapperFn = async () => {
                    const res = await requestFn();
                    data.value = res;
                }
                await watchEffect(wrapperFn);
            } else {
                const res = await requestFn();
                data.value = res;
            }
        } catch(err){
            error.value = err;
        }

        loading.value = false;
    }

    handleRequest()

    return {
        error,
        loading,
        data
    }
}