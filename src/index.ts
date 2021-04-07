import { AxiosInstance } from 'axios';
import { App } from 'vue';
import { provideAxios } from './use-axios';
import { VueQuery } from './vue-query';
export * from './use-request';
export { VueQuery } from './vue-query';


export function Request(axios: AxiosInstance) {
    return function install(app: App) {
        provideAxios(app, axios);
        app.component('vue-query', VueQuery);
    }
}