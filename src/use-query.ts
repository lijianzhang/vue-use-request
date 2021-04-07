import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRequest, IConfig } from './use-request';
import { useAxios } from './use-axios';

export function useQuery<T, M>(url: string, params: { [k: string]: any }, config: IConfig<M> & { config: AxiosRequestConfig; map: (data: AxiosResponse<T>) => M }) {
    const axios = useAxios();
    const { map, config: axiosConfig, ...other } = config;
    return useRequest(async () => {
        const res = await axios.get<T>(url, { ...axiosConfig, params })
        if (map) {
            return map(res);
        }
        return res;
    }, other)
}