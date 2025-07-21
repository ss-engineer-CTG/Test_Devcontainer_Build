// メインのReactコンポーネント
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // 状態管理
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);

  // コンポーネントマウント時にTodoリストを取得
  useEffect(() => {
    fetchTodos();
  }, []);

  // APIからTodoリストを取得
  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Todoの取得に失敗しました:', error);
      setLoading(false);
    }
  };

  // 新しいTodoを作成
  const createTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const response = await axios.post('/api/todos', newTodo);
      setTodos([...todos, response.data]);
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      console.error('Todoの作成に失敗しました:', error);
    }
  };

  // Todoの完了状態を切り替え
  const toggleTodo = async (todoId, completed) => {
    try {
      const response = await axios.put(`/api/todos/${todoId}`, { completed: !completed });
      setTodos(todos.map(todo => 
        todo.id === todoId ? response.data : todo
      ));
    } catch (error) {
      console.error('Todoの更新に失敗しました:', error);
    }
  };

  // Todoを削除
  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`/api/todos/${todoId}`);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error('Todoの削除に失敗しました:', error);
    }
  };

  if (loading) {
    return <div style={{padding: '20px'}}>読み込み中...</div>;
  }

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
      <h1>📝 ToDo アプリ</h1>
      <p>FastAPI + React + DevContainer で作成</p>
      
      {/* 新しいTodo作成フォーム */}
      <form onSubmit={createTodo} style={{marginBottom: '30px'}}>
        <div style={{marginBottom: '10px'}}>
          <input
            type="text"
            placeholder="タスクのタイトル"
            value={newTodo.title}
            onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{marginBottom: '10px'}}>
          <textarea
            placeholder="詳細説明（任意）"
            value={newTodo.description}
            onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
            style={{
              width: '100%',
              height: '60px',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          追加
        </button>
      </form>

      {/* Todoリスト表示 */}
      <div>
        <h2>📋 タスク一覧 ({todos.length}件)</h2>
        {todos.length === 0 ? (
          <p>タスクがありません。上記フォームから追加してください。</p>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id} 
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: todo.completed ? '#f8f9fa' : 'white',
                opacity: todo.completed ? 0.7 : 1
              }}
            >
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '10px'}}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  style={{marginTop: '2px'}}
                />
                <div style={{flex: 1}}>
                  <h3 style={{
                    margin: '0 0 5px 0',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#6c757d' : 'black'
                  }}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p style={{
                      margin: '0 0 5px 0',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      {todo.description}
                    </p>
                  )}
                  <small style={{color: '#6c757d'}}>
                    作成日: {new Date(todo.created_at).toLocaleString('ja-JP')}
                  </small>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;