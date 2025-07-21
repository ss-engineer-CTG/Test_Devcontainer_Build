# FastAPI + React DevContainer プロジェクト

Docker + WSL + VSCode DevContainer を使った フルスタック開発環境のサンプルプロジェクトです。

## 技術スタック

- **バックエンド**: Python + FastAPI
- **フロントエンド**: React + JavaScript
- **開発環境**: Docker + DevContainer
- **プラットフォーム**: WSL2 + Windows

## プロジェクト構成

```
├── .devcontainer/          # DevContainer設定
│   ├── devcontainer.json   # VS Code DevContainer設定
│   ├── docker-compose.yml  # コンテナオーケストレーション
│   └── Dockerfile          # カスタムイメージ定義
├── backend/                # FastAPI バックエンド
│   ├── main.py            # API サーバー
│   └── requirements.txt   # Python 依存関係
├── frontend/               # React フロントエンド  
│   ├── public/
│   ├── src/
│   └── package.json       # Node.js 依存関係
└── README.md
```

## セットアップ手順

### 1. VS Code でプロジェクトを開く

```bash
code fastapi-react-devcontainer
```

### 2. DevContainer で開く

VS Code の右下に表示される通知から「Reopen in Container」をクリック、または:
- `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"

### 3. 開発サーバーの起動

**バックエンド (FastAPI)**:
```bash
cd /workspace/backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**フロントエンド (React)**:
```bash  
cd /workspace/frontend
npm start
```

## アクセス URL

- **React アプリ**: http://localhost:3000
- **FastAPI API**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs

## 機能

シンプルな ToDo アプリケーション:
- タスクの追加、完了切り替え、削除
- REST API による データのやり取り
- レスポンシブデザイン

## 学習ポイント

1. **DevContainer** による統一開発環境
2. **FastAPI** による高速API開発  
3. **React** によるモダンフロントエンド
4. **Docker Compose** によるマルチサービス管理# Test_Devcontainer_Build
# Test_Devcontainer_Build
