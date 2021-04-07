import { inject, App } from 'vue';
import { AxiosInstance } from 'axios';

const AXIOS_KEY = Symbol('[vue-use-request-axios]');

export function provideAxios(app: App,axios: AxiosInstance) {
    app.provide(AXIOS_KEY, axios);
}

export function useAxios() {
    return inject(AXIOS_KEY) as AxiosInstance;
}