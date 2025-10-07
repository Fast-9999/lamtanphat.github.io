---
title: "React.js - Frontend Framework hiện đại"
date: 2025-09-02T10:00:00+07:00
draft: false
tags: ["JavaScript", "React", "Frontend", "Components"]
categories: ["JavaScript"]
description: "Tìm hiểu về React.js và cách xây dựng ứng dụng frontend với React"
featured: true
featured_image: "/images/javascript-placeholder.jpg"
featured_badge: "Popular"
views: 2100
likes: 156
---

# React.js - Frontend Framework hiện đại

React là một JavaScript library được phát triển bởi Facebook để xây dựng user interfaces, đặc biệt là single-page applications.

## Tại sao React?

### 1. Component-Based Architecture
Code được tổ chức thành các components có thể tái sử dụng.

### 2. Virtual DOM
React sử dụng Virtual DOM để optimize performance.

### 3. One-Way Data Flow
Data flow một chiều giúp ứng dụng dễ predict và debug.

### 4. Rich Ecosystem
Có nhiều libraries và tools hỗ trợ.

## Cài đặt và Hello World

### Tạo React App
```bash
# Sử dụng Create React App
npx create-react-app my-react-app
cd my-react-app
npm start

# Hoặc sử dụng Vite (nhanh hơn)
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

### Component đầu tiên
```jsx
// src/App.js
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chào mừng đến với React!</h1>
        <p>Ứng dụng React đầu tiên của bạn</p>
      </header>
    </div>
  );
}

export default App;
```

## JSX và Components

### JSX Syntax
```jsx
// JSX cho phép viết HTML trong JavaScript
const element = <h1>Xin chào, {name}!</h1>;

// Conditional rendering
const Greeting = ({ isLoggedIn, username }) => {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Xin chào, {username}!</h1>
      ) : (
        <h1>Vui lòng đăng nhập</h1>
      )}
    </div>
  );
};

// List rendering
const UserList = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
};
```

### Functional Components
```jsx
// Simple functional component
const Welcome = ({ name }) => {
  return <h1>Xin chào, {name}!</h1>;
};

// Component với multiple props
const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <div className="actions">
        <button onClick={() => onEdit(user.id)}>Sửa</button>
        <button onClick={() => onDelete(user.id)}>Xóa</button>
      </div>
    </div>
  );
};

// Component với children
const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

// Sử dụng Card component
<Card title="Thông tin người dùng">
  <p>Nội dung của card</p>
  <button>Hành động</button>
</Card>
```

## State và Props

### useState Hook
```jsx
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div>
      <h2>Counter: {count}</h2>
      <div>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
      </div>
      
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên của bạn"
        />
        <p>Xin chào, {name}!</p>
      </div>
    </div>
  );
};
```

### Form Handling
```jsx
import React, { useState } from 'react';

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', age: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Tên:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Tuổi:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit">Thêm người dùng</button>
    </form>
  );
};
```

## useEffect Hook

```jsx
import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data khi component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array = chỉ chạy một lần

  // Update document title khi users thay đổi
  useEffect(() => {
    document.title = `Có ${users.length} người dùng`;
  }, [users]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h2>Danh sách người dùng ({users.length})</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Custom Hooks

```jsx
// Custom hook để fetch data
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Custom hook để localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// Sử dụng custom hooks
const App = () => {
  const { data: users, loading, error } = useFetch('/api/users');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className={`app ${theme}`}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Chuyển đổi theme
      </button>
      <UserList users={users} />
    </div>
  );
};
```

## Context API

```jsx
import React, { createContext, useContext, useReducer } from 'react';

// Tạo context
const UserContext = createContext();

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'FETCH_USERS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'DELETE_USER':
      return { 
        ...state, 
        users: state.users.filter(user => user.id !== action.payload) 
      };
    default:
      return state;
  }
};

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const addUser = (user) => {
    dispatch({ type: 'ADD_USER', payload: user });
  };

  const deleteUser = (userId) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
  };

  const fetchUsers = async () => {
    dispatch({ type: 'FETCH_USERS_START' });
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
    }
  };

  const value = {
    ...state,
    addUser,
    deleteUser,
    fetchUsers
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

## Routing với React Router

```bash
npm install react-router-dom
```

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Users from './components/Users';
import UserDetail from './components/UserDetail';

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Trang chủ</Link>
        <Link to="/about">Giới thiệu</Link>
        <Link to="/users">Người dùng</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
};

// UserDetail component với useParams
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]);

  if (!user) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Tuổi: {user.age}</p>
    </div>
  );
};
```

## Testing với Jest và React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```jsx
// Counter.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';

test('renders counter with initial value', () => {
  render(<Counter />);
  expect(screen.getByText('Counter: 0')).toBeInTheDocument();
});

test('increments counter when + button is clicked', () => {
  render(<Counter />);
  const incrementButton = screen.getByText('+');
  fireEvent.click(incrementButton);
  expect(screen.getByText('Counter: 1')).toBeInTheDocument();
});

test('decrements counter when - button is clicked', () => {
  render(<Counter />);
  const decrementButton = screen.getByText('-');
  fireEvent.click(decrementButton);
  expect(screen.getByText('Counter: -1')).toBeInTheDocument();
});
```

## Best Practices

### 1. Component Structure
```
src/
├── components/
│   ├── common/
│   ├── forms/
│   └── layout/
├── hooks/
├── context/
├── utils/
├── services/
└── styles/
```

### 2. Performance Optimization
```jsx
import React, { memo, useMemo, useCallback } from 'react';

// Memo component để tránh re-render không cần thiết
const UserCard = memo(({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Sửa</button>
      <button onClick={() => onDelete(user.id)}>Xóa</button>
    </div>
  );
});

// useMemo để memoize expensive calculations
const ExpensiveComponent = ({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  return <div>Total: {expensiveValue}</div>;
};

// useCallback để memoize functions
const ParentComponent = () => {
  const [users, setUsers] = useState([]);

  const handleEdit = useCallback((userId) => {
    // Edit logic
  }, []);

  const handleDelete = useCallback((userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
```

## Kết luận

React.js đã cách mạng hóa việc phát triển frontend với component-based architecture và Virtual DOM. Hooks đã làm cho functional components trở nên mạnh mẽ hơn, và ecosystem phong phú giúp developer có thể xây dựng các ứng dụng phức tạp một cách hiệu quả.

Trong bài tiếp theo, chúng ta sẽ tìm hiểu về **Vue.js** - một frontend framework khác cũng rất phổ biến và dễ học.
