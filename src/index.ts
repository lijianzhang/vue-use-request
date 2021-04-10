import { AxiosInstance } from 'axios';
import { App } from 'vue';
import { provideAxios } from './use-axios';
import { VueQuery } from './vue-query';
export * from './use-request';
export * from './use-mutation';
export { VueQuery } from './vue-query';
export { useQuery } from './use-query';
export { VueMutation } from './vue-mutation';
import { VueMutation } from './vue-mutation';


export function Request(axios: AxiosInstance) {
    return function install(app: App) {
        provideAxios(app, axios);
        app.component('vue-query', VueQuery);
        app.component('vue-mutation', VueMutation);
    }
}