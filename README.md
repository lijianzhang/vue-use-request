# vue-use-request

>vue3 hook或者组件的方式使用请求库
## 安装

```shell
yarn add vue-request-vue
#or
npm install vue-request-vue
```

## 使用

### hook 方式
```vue
<template>
    <div v-if="error">{{error}}</div>
    <div v-else-if="loading">loading...</div>
    <div v-else>{{data}}</div>
</template>
<script>
import { defineComponent }  from 'vue';
import { useRequest } from 'vue-use-request';
export default defineComponent({
    setup() {
        const { data, loading, error } = useRequest(async() => {
            const res = fetch('https://api.github.com/search/repositories?q=vue-use-request').then(res => res.json());
        },
        // config, 配置参数，具体参数配置看下面
        {
            retry: 3,
        });

        return {
            data,
            loading,
            error
        }
    }
})
</script>
```

### 参数
```typescript
    type TimeUnit = 'd' | 'h' | 'm' | 's';

    type StringTime = `${number}${TimeUnit}`


    export type TimeFormat = number | StringTime;

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
     * @type {TimeFormat} 比如 100s  2d 3h 3m
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
```

### 集成axios
使用前需要对 vue 执行 use 方法注入 axios实例和注册组件

```typescript
import { createApp } from 'vue';
import axios from 'axios';
import { Request } from 'vue-use-request';
const app = createApp();
app.use(Request(axios));
```

#### 组件方式使用
```vue
<template>
    <vue-query url="https://api.github.com/search/repositories" :params="{q: 'vue-use-request'}">
        <template #default="{data, loading, error}">
            <div v-if="error">{{error}}</div>
            <div v-else-if="loading">loading...</div>
            <div v-else>{{data}}</div>
        </template>
    </vue-query>
</template>
```
#### hook 方式
```vue
<template>
    <div v-if="error">{{error}}</div>
    <div v-else-if="loading">loading...</div>
    <div v-else>{{data}}</div>
</template>
<script>
import { defineComponent }  from 'vue';
import { useQuery } from 'vue-use-request';
export default defineComponent({
    setup() {
        const { data, loading, error } = useQuery('https://api.github.com/search/repositories', { q: 'vue-use-request' });
        return {
            data,
            loading,
            error
        }
    }
})
</script>
```

## TODO

- [ ] 完善文档
- [ ] 支持 Mutation 操作