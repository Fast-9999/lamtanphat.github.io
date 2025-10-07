---
title: "Vue.js - Progressive JavaScript Framework"
date: 2025-07-15T10:00:00+07:00
draft: false
tags: ["JavaScript", "Vue.js", "Frontend", "Framework"]
categories: ["JavaScript"]
description: "Tìm hiểu về Vue.js và cách xây dựng ứng dụng frontend với Vue"
featured_image: "/images/javascript-placeholder.jpg"
---

# Vue.js - Progressive JavaScript Framework

Vue.js là một progressive JavaScript framework được phát triển bởi Evan You, được thiết kế để dễ học và tích hợp dần dần vào các dự án hiện có.

## Tại sao Vue.js?

### 1. Progressive Framework
Có thể tích hợp từng phần vào dự án hiện có.

### 2. Template Syntax
Template syntax đơn giản và trực quan.

### 3. Reactivity System
Hệ thống reactivity tự động cập nhật DOM.

### 4. Single File Components
Components được viết trong một file duy nhất.

## Cài đặt và Hello World

### CDN
```html
<!DOCTYPE html>
<html>
<head>
    <title>Vue.js App</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <h1>{{ message }}</h1>
        <p>Counter: {{ count }}</p>
        <button @click="increment">Tăng</button>
    </div>

    <script>
        const { createApp } = Vue;
        
        createApp({
            data() {
                return {
                    message: 'Chào mừng đến với Vue.js!',
                    count: 0
                }
            },
            methods: {
                increment() {
                    this.count++;
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```

### Vue CLI
```bash
# Cài đặt Vue CLI
npm install -g @vue/cli

# Tạo project mới
vue create my-vue-app
cd my-vue-app
npm run serve
```

### Vite
```bash
npm create vue@latest my-vue-app
cd my-vue-app
npm install
npm run dev
```

## Template Syntax

### Interpolation
```vue
<template>
  <div>
    <!-- Text interpolation -->
    <p>{{ message }}</p>
    
    <!-- Raw HTML -->
    <p v-html="rawHtml"></p>
    
    <!-- Attributes -->
    <div :id="dynamicId" :class="dynamicClass"></div>
    
    <!-- JavaScript expressions -->
    <p>{{ message.split('').reverse().join('') }}</p>
    <p>{{ count + 1 }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Xin chào Vue.js!',
      rawHtml: '<strong>Bold text</strong>',
      dynamicId: 'my-id',
      dynamicClass: 'active'
    }
  }
}
</script>
```

### Directives
```vue
<template>
  <div>
    <!-- v-if / v-else -->
    <p v-if="isVisible">Nội dung hiển thị</p>
    <p v-else>Nội dung ẩn</p>
    
    <!-- v-show -->
    <p v-show="isVisible">Luôn render nhưng có thể ẩn</p>
    
    <!-- v-for -->
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        {{ index + 1 }}. {{ item.name }}
      </li>
    </ul>
    
    <!-- v-model -->
    <input v-model="inputValue" placeholder="Nhập text">
    <p>Bạn đã nhập: {{ inputValue }}</p>
    
    <!-- Event handling -->
    <button @click="handleClick">Click me</button>
    <button @click="handleClickWithParam('Hello')">Click with param</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: true,
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ],
      inputValue: ''
    }
  },
  methods: {
    handleClick() {
      console.log('Button clicked!');
    },
    handleClickWithParam(message) {
      console.log(message);
    }
  }
}
</script>
```

## Components

### Single File Component
```vue
<!-- UserCard.vue -->
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" class="avatar">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <div class="actions">
      <button @click="editUser">Sửa</button>
      <button @click="deleteUser">Xóa</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  methods: {
    editUser() {
      this.$emit('edit', this.user.id);
    },
    deleteUser() {
      this.$emit('delete', this.user.id);
    }
  }
}
</script>

<style scoped>
.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  max-width: 300px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.actions {
  margin-top: 12px;
}

.actions button {
  margin-right: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### Sử dụng Component
```vue
<!-- App.vue -->
<template>
  <div id="app">
    <h1>Danh sách người dùng</h1>
    <div class="user-list">
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard.vue'

export default {
  name: 'App',
  components: {
    UserCard
  },
  data() {
    return {
      users: [
        {
          id: 1,
          name: 'TaansFast',
          email: 'nguyenvana@email.com',
          avatar: 'https://via.placeholder.com/60'
        },
        {
          id: 2,
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          avatar: 'https://via.placeholder.com/60'
        }
      ]
    }
  },
  methods: {
    handleEdit(userId) {
      console.log('Edit user:', userId);
    },
    handleDelete(userId) {
      this.users = this.users.filter(user => user.id !== userId);
    }
  }
}
</script>
```

## Composition API

### Setup Function
```vue
<template>
  <div>
    <h2>Counter: {{ count }}</h2>
    <button @click="increment">Tăng</button>
    <button @click="decrement">Giảm</button>
    
    <h3>Users ({{ users.length }})</h3>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'

export default {
  setup() {
    // Reactive data
    const count = ref(0)
    const users = reactive([])
    
    // Computed properties
    const doubleCount = computed(() => count.value * 2)
    
    // Methods
    const increment = () => {
      count.value++
    }
    
    const decrement = () => {
      count.value--
    }
    
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        users.push(...data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    
    // Lifecycle
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      count,
      users,
      doubleCount,
      increment,
      decrement
    }
  }
}
</script>
```

### Composables (Custom Hooks)
```javascript
// composables/useUsers.js
import { ref, onMounted } from 'vue'

export function useUsers() {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      users.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addUser = (user) => {
    users.value.push(user)
  }

  const deleteUser = (userId) => {
    users.value = users.value.filter(user => user.id !== userId)
  }

  onMounted(() => {
    fetchUsers()
  })

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    deleteUser
  }
}
```

```vue
<!-- Sử dụng composable -->
<template>
  <div>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">Lỗi: {{ error }}</div>
    <div v-else>
      <h2>Users ({{ users.length }})</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.email }}
          <button @click="deleteUser(user.id)">Xóa</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useUsers } from '@/composables/useUsers'

export default {
  setup() {
    const { users, loading, error, deleteUser } = useUsers()

    return {
      users,
      loading,
      error,
      deleteUser
    }
  }
}
</script>
```

## Vue Router

```bash
npm install vue-router@4
```

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Users from '@/views/Users.vue'
import UserDetail from '@/views/UserDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Trang chủ</router-link>
      <router-link to="/about">Giới thiệu</router-link>
      <router-link to="/users">Người dùng</router-link>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

```vue
<!-- UserDetail.vue -->
<template>
  <div v-if="loading">Đang tải...</div>
  <div v-else-if="error">Lỗi: {{ error }}</div>
  <div v-else-if="user">
    <h2>{{ user.name }}</h2>
    <p>Email: {{ user.email }}</p>
    <p>Tuổi: {{ user.age }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  props: ['id'],
  setup(props) {
    const user = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${props.id}`)
        const data = await response.json()
        user.value = data
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchUser()
    })

    return {
      user,
      loading,
      error
    }
  }
}
</script>
```

## State Management với Pinia

```bash
npm install pinia
```

```javascript
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    userCount: (state) => state.users.length,
    activeUsers: (state) => state.users.filter(user => user.active)
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        this.users = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    addUser(user) {
      this.users.push(user)
    },

    deleteUser(userId) {
      this.users = this.users.filter(user => user.id !== userId)
    },

    updateUser(userId, userData) {
      const index = this.users.findIndex(user => user.id === userId)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...userData }
      }
    }
  }
})
```

```vue
<!-- Sử dụng Pinia store -->
<template>
  <div>
    <div v-if="userStore.loading">Đang tải...</div>
    <div v-else-if="userStore.error">Lỗi: {{ userStore.error }}</div>
    <div v-else>
      <h2>Users ({{ userStore.userCount }})</h2>
      <ul>
        <li v-for="user in userStore.users" :key="user.id">
          {{ user.name }} - {{ user.email }}
          <button @click="userStore.deleteUser(user.id)">Xóa</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const userStore = useUserStore()

    return {
      userStore
    }
  }
}
</script>
```

## Testing với Vitest

```bash
npm install --save-dev vitest @vue/test-utils jsdom
```

```vue
<!-- Counter.vue -->
<template>
  <div>
    <h2>Counter: {{ count }}</h2>
    <button @click="increment">Tăng</button>
    <button @click="decrement">Giảm</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    const increment = () => {
      count.value++
    }

    const decrement = () => {
      count.value--
    }

    return {
      count,
      increment,
      decrement
    }
  }
}
</script>
```

```javascript
// Counter.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('Counter: 0')
  })

  it('increments count when increment button is clicked', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Counter: 1')
  })

  it('decrements count when decrement button is clicked', async () => {
    const wrapper = mount(Counter)
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.text()).toContain('Counter: -1')
  })
})
```

## Best Practices

### 1. Project Structure
```
src/
├── components/
│   ├── common/
│   ├── forms/
│   └── layout/
├── views/
├── composables/
├── stores/
├── router/
├── utils/
└── assets/
```

### 2. Performance Optimization
```vue
<template>
  <div>
    <!-- Lazy loading components -->
    <Suspense>
      <template #default>
        <LazyComponent />
      </template>
      <template #fallback>
        <div>Đang tải...</div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const LazyComponent = defineAsyncComponent(() => import('./LazyComponent.vue'))

export default {
  components: {
    LazyComponent
  }
}
</script>
```

## Kết luận

Vue.js là một framework JavaScript progressive và dễ học, phù hợp cho cả người mới bắt đầu và developer có kinh nghiệm. Với template syntax trực quan, Composition API mạnh mẽ, và ecosystem phong phú, Vue.js là lựa chọn tuyệt vời cho việc phát triển frontend applications.

Trong bài tiếp theo, chúng ta sẽ tìm hiểu về **Database và ORM** - những kiến thức quan trọng cho việc phát triển full-stack applications.
