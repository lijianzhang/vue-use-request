import { useRequest } from '../src';
import { ref } from 'vue';


function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
}

describe('测试 userRequest 方法', () => {
    test('default config', async () => {
        const { data, error, loading } = useRequest(async () => {
            return [1];
        })
        expect(data.value).toEqual(null)
        expect(loading.value).toEqual(true);
        await wait(1);
        expect(data.value).toEqual([1])
        expect(loading.value).toEqual(false);
        expect(error.value).toEqual(null);
    })

    test('options.initValue', async () => {

        const { data } = useRequest(async () => 2, { initalValue: 1 });
        expect(data.value).toEqual(1)
        await wait(1);
        expect(data.value).toEqual(2)
    })

    test('options.throttle', async () => {
        const fn = jest.fn();
        const { data, run } = useRequest(fn, { throttle: 40, lazy: true });
        run();
        await wait(20)
        expect(fn.mock.calls.length).toEqual(1)
        await wait(30);
        expect(fn.mock.calls.length).toEqual(1)
        run();
        await wait(40)
        expect(fn.mock.calls.length).toEqual(2)
    })

    test('options.cache', async () => {
        const fn = jest.fn();
        fn.mockReturnValue(true);
        
        const { data, run } = useRequest(fn, { cache: 100, lazy: true });
        run();
        expect(fn.mock.calls.length).toEqual(1)
        await wait(30);
        expect(fn.mock.calls.length).toEqual(1)
        await wait(120)
        run();
        await wait(1)
        expect(fn.mock.calls.length).toEqual(2)
        await wait(200)
        run()
        expect(fn.mock.calls.length).toEqual(3)
    })

    test('options.polling', async () => {
        const fn = jest.fn();
        fn.mockReturnValue(true);

        const { data, stopPolling } = useRequest(fn, { polling: 20 });

        await wait(100);
        expect(fn.mock.calls.length).toEqual(5);
        stopPolling();
        await wait(100);
        expect(fn.mock.calls.length).toEqual(5);
    })


    test('options.watch', async () => {
        let times = 0;
        let v = ref(0);
        const { data } = useRequest(async () => {
            times = v.value;
            return times;
        }, { watch: [v] });

        expect(data.value).toEqual(null);
        await wait(1);
        expect(data.value).toEqual(0);
        v.value = 1;
        await wait(1);
        expect(data.value).toEqual(1);
        v.value = 2;
        await wait(1)
        expect(data.value).toEqual(2);
    })
})

