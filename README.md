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
            const res = fetch('https://api.github.com/search/code?q=vue-use-request').then(res => res.json());
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
    <vue-query url="https://api.github.com/search/code" :params="{q: 'vue-use-request'}">
        <template #default="{data, loading, error}">
            <div v-if="error">{{error}}</div>
            <div v-else-if="loading">loading...</div>
            <div v-else>{{data}}</div>
        </template>
    </vue-query>
</template>
```
## TODO

- [ ] 完善文档
- [ ] 支持 mutation 操作