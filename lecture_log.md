# Docker + WSL + VSCode DevContainer 学習ログ

## 学習開始
**日時**: 2025-07-21
**目標**: WindowsPC上でDockerとWSLとVScode(DevContainer)を利用した開発環境構築を学習

## 第1回：基本概念の理解

### 解説内容
**1. Docker（ドッカー）**
- アプリケーションを「コンテナ」という軽量な仮想環境で動かす技術
- 「どの環境でも同じように動く」を実現
- 例：自分のPCでもチームメンバーのPCでも、全く同じ環境で開発できる

**2. WSL（Windows Subsystem for Linux）**
- Windows上でLinux環境を動かす仕組み
- WindowsでもLinuxのコマンドやツールが使える
- DevContainer開発では必須の技術

**3. DevContainer（Development Container）**
- VSCodeで使える開発用コンテナ
- プロジェクトごとに独立した開発環境を作成
- チーム全員が同じ環境で開発できる

### 学習者への質問
- 現在のこれらの技術についての理解度
- 特に詳しく学びたい部分

### 学習者の回答
- 基本概念は表面上理解している
- 実際の開発環境構築は初めて
- 具体的な操作・ステップを知りたい

## 第2回：開発環境構築の全体ステップ

### 構築ステップ概要
**ステップ1：事前準備と確認**
1. Windowsのバージョン確認（Windows 10 version 2004以降、またはWindows 11が必要）
2. WSL2の有効化とインストール
3. Docker Desktopのインストールと設定
4. VSCodeのインストール
5. 必要な拡張機能のインストール

**ステップ2：実際の環境構築**
1. プロジェクトフォルダの作成
2. DevContainer設定ファイルの作成
3. コンテナの起動と接続
4. 動作確認

### 現在の環境確認質問
- Windowsのバージョンは？
- 既にインストール済みのソフトウェア（WSL2, Docker Desktop, VSCode）は？

### 環境確認用コマンド集

**1. Windowsバージョンの確認**
```cmd
winver
```
```powershell
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, WindowsBuildLabEx
```

**2. WSL2の確認**
```cmd
wsl --list --verbose
wsl --version
```

**3. Docker Desktopの確認**
```cmd
docker --version
docker info
```

**4. VSCodeの確認**
```cmd
code --version
```

**5. VSCode拡張機能の確認**
```cmd
code --list-extensions
```

### チェックポイント
- WSL2が有効になっているか
- Docker Desktopが正常に動作しているか  
- VSCodeに「Dev Containers」拡張機能がインストールされているか

### 学習者の環境確認結果
- **Windows**: Windows11 24H2 ✅
- **WSL2**: Ubuntu-22.04とdocker-desktopが両方動作中 ✅
- **Docker**: v27.2.0がインストール済み ✅
- **VSCode**: v1.101.1がインストール済み ✅
- **重要な拡張機能**: 
  - ms-vscode-remote.remote-containers (Dev Containers) ✅
  - ms-vscode-remote.remote-wsl (WSL) ✅

## 第3回：実際のDevContainer作成

### 環境確認完了 - すべて準備OK！

### DevContainer作成ステップ開始

**ステップ1: プロジェクトフォルダの準備**
```bash
mkdir ~/my-devcontainer-demo
cd ~/my-devcontainer-demo
```

**ステップ2: DevContainer設定ファイルの作成**
```bash
mkdir .devcontainer
```

### 開発環境選択質問
どの開発言語・フレームワークでDevContainerを試したいか？
- Python (Django/Flask)
- Node.js (React/Express)  
- その他

### 学習者の選択
**バックエンド**: Python
**フロントエンド**: React

## 第4回：Python + React フルスタック DevContainer 作成

### ステップ3: devcontainer.json の設定

```json
{
    "name": "Python + React Development",
    "dockerComposeFile": "docker-compose.yml",
    "service": "app",
    "workspaceFolder": "/workspace",
    "shutdownAction": "stopCompose",
    "customizations": {
        "vscode": {
            "extensions": [
                "ms-python.python",
                "ms-python.vscode-pylance",
                "ms-python.black-formatter",
                "ms-python.flake8",
                "bradlc.vscode-tailwindcss",
                "esbenp.prettier-vscode",
                "ms-vscode.vscode-typescript-next"
            ],
            "settings": {
                "python.defaultInterpreterPath": "/usr/local/bin/python",
                "python.formatting.provider": "black"
            }
        }
    },
    "forwardPorts": [8000, 3000],
    "postCreateCommand": "pip install -r requirements.txt && npm install"
}
```

### ステップ4: 必要なファイル一覧
1. docker-compose.yml
2. Dockerfile
3. requirements.txt
4. package.json

### PythonWebフレームワーク選択質問
- Django (より機能豊富、管理画面付き)
- FastAPI (モダン、高速、API開発に特化)

### 学習者の選択
**PythonWebフレームワーク**: FastAPI

## 第5回：devcontainer.json 詳細解説

### devcontainer.json各項目の役割

```json
{
    // DevContainerの名前（VSCodeのステータスバーに表示される）
    "name": "Python + React Development",
    
    // Docker Composeファイルの場所を指定
    // 複数のサービス（フロント・バック・DB等）を管理する場合に使用
    "dockerComposeFile": "docker-compose.yml",
    
    // Docker Composeの中で、メイン開発環境として使うサービス名
    "service": "app",
    
    // コンテナ内での作業ディレクトリ
    // VSCodeがこのフォルダをルートとして開く
    "workspaceFolder": "/workspace",
    
    // VSCodeを閉じた時の動作
    // "stopCompose" = Docker Composeで起動したすべてのサービスを停止
    "shutdownAction": "stopCompose",
    
    // VSCode固有の設定
    "customizations": {
        "vscode": {
            // 自動インストールする拡張機能のリスト
            "extensions": [
                "ms-python.python",              // Python基本サポート
                "ms-python.vscode-pylance",      // Python言語サーバー（高速・高機能）
                "ms-python.black-formatter",     // Pythonコードフォーマッター
                "ms-python.flake8",              // Python構文チェッカー
                "bradlc.vscode-tailwindcss",     // TailwindCSS支援
                "esbenp.prettier-vscode",        // JavaScript/CSS等のフォーマッター
                "ms-vscode.vscode-typescript-next" // TypeScript支援
            ],
            // VSCodeエディタの設定
            "settings": {
                // Pythonインタープリターの場所を指定
                "python.defaultInterpreterPath": "/usr/local/bin/python",
                // Pythonのフォーマッターとしてblackを使用
                "python.formatting.provider": "black"
            }
        }
    },
    
    // ローカルマシンに転送するポート番号
    // 8000: FastAPI（バックエンド）, 3000: React（フロントエンド）
    "forwardPorts": [8000, 3000],
    
    // コンテナ作成後に自動実行するコマンド
    // Pythonパッケージをインストール → Node.jsパッケージをインストール
    "postCreateCommand": "pip install -r requirements.txt && npm install"
}
```

### 次のステップ：FastAPI用設定ファイル作成
実際にファイルを作成していきます。

## 第6回：実際のファイル作成開始

### 対話再開地点の確認
- devcontainer.jsonの詳細解説完了 ✅
- 作業環境がWSL2であることを確認 ✅
- FastAPIを選択 ✅

### 実践開始：プロジェクト作成手順

```bash
# WSL2で新しいプロジェクトを作成
mkdir ~/fastapi-react-devcontainer
cd ~/fastapi-react-devcontainer

# DevContainerの設定フォルダを作成
mkdir .devcontainer
```

### 作成予定ファイル一覧
1. **devcontainer.json** - DevContainer設定
2. **docker-compose.yml** - コンテナオーケストレーション  
3. **Dockerfile** - カスタムコンテナイメージ
4. **requirements.txt** - Python依存関係
5. **package.json** - Node.js依存関係

### 学習者からの質問
アプリケーションのディレクトリ構成イメージを教えてほしい

## 第7回：アプリケーション構成の全体像

### 最終的なディレクトリ構成

```
fastapi-react-devcontainer/
├── .devcontainer/                 # DevContainer設定
│   ├── devcontainer.json         # VS Code DevContainer設定
│   ├── docker-compose.yml        # コンテナオーケストレーション
│   └── Dockerfile                # カスタムイメージ定義
│
├── backend/                       # Python FastAPI バックエンド
│   ├── main.py                   # FastAPI メインアプリ
│   ├── api/                      # API エンドポイント
│   │   └── routes.py
│   ├── models/                   # データモデル
│   │   └── todo.py
│   └── requirements.txt          # Python依存関係
│
├── frontend/                      # React フロントエンド
│   ├── public/                   # 静的ファイル
│   ├── src/                      # Reactソースコード
│   │   ├── components/           # Reactコンポーネント
│   │   ├── App.js                # メインアプリコンポーネント
│   │   └── index.js              # エントリーポイント
│   ├── package.json              # Node.js依存関係
│   └── package-lock.json
│
└── README.md                      # プロジェクト説明
```

### アプリケーション動作イメージ

```
┌─────────────────┐    API通信     ┌─────────────────┐
│   React         │   (HTTP)      │   FastAPI       │
│   (Frontend)    │ ←----------→  │   (Backend)     │
│   Port: 3000    │               │   Port: 8000    │
└─────────────────┘               └─────────────────┘
         │                                 │
         │           Docker Container       │
         │         ┌─────────────────────┐ │
         └─────────│  Development Env    │─┘
                   │  - Python 3.11      │
                   │  - Node.js 18       │
                   │  - VS Code Server   │
                   └─────────────────────┘
```

### 開発フローイメージ
1. VS Codeで`fastapi-react-devcontainer`フォルダを開く
2. DevContainerが自動起動（Python + Node.js環境）
3. バックエンド（FastAPI）が`http://localhost:8000`で起動
4. フロントエンド（React）が`http://localhost:3000`で起動
5. API通信でデータをやり取り（例：ToDo管理アプリ）

## 第8回：DevContainer設定ファイル作成

### ファイル作成開始

**1. devcontainer.json** ✅
- **役割**: DevContainerの中心設定ファイル
- **なぜ必要？**: VSCodeにどのような開発環境を作るかを指示する設計図

**2. docker-compose.yml** ✅  
- **役割**: 複数のサービス（アプリ、データベース等）を管理
- **なぜ必要？**: 単一のDockerfileでは複雑なフルスタック環境を管理しきれないため

**3. Dockerfile** ✅
- **役割**: カスタムコンテナイメージの作成
- **なぜ必要？**: Python + Node.jsの両方が入った開発環境を作るため

### ファイル関係性の理解
- `devcontainer.json` = 「VS Codeよ、このDocker環境で開発させて」
- `docker-compose.yml` = 「この構成でコンテナを起動して」
- `Dockerfile` = 「Python + Node.jsが両方入った環境を作って」

### 次のステップ：アプリケーション側ファイル作成

## 第9回：アプリケーション側ファイル作成完了

### 作成されたファイル一覧

**4. requirements.txt** ✅
- **役割**: Python依存関係の管理
- **なぜ必要？**: FastAPIや関連ライブラリをインストールするため

**5. main.py** ✅
- **役割**: APIサーバーのエントリーポイント
- **なぜ必要？**: WebAPIの基盤となるサーバーアプリケーション

**6. package.json** ✅
- **役割**: Node.js依存関係とスクリプトの管理
- **なぜ必要？**: Reactアプリケーションの構築・実行に必要なライブラリを管理

**7. React基本ファイル** ✅
- **役割**: Reactアプリケーションの基本構造
- **なぜ必要？**: ユーザーインターフェース（画面）を提供するため
  - `public/index.html` - HTMLテンプレート
  - `src/index.js` - Reactエントリーポイント
  - `src/App.js` - メインコンポーネント（ToDoアプリUI）

**8. README.md** ✅
- **役割**: プロジェクト説明とセットアップ手順
- **なぜ必要？**: チームメンバーやあとで見返すときの手順書

### 完成したプロジェクト構成

```
fastapi-react-devcontainer/
├── .devcontainer/          # DevContainer設定 ✅
├── backend/                # FastAPI バックエンド ✅
├── frontend/               # React フロントエンド ✅
└── README.md               # プロジェクト説明 ✅
```

### 次のステップ：VSCodeでの起動と動作確認
実際にDevContainerを起動して動作確認をしましょう！

## 第10回：VSCodeでDevContainer起動手順

### プロジェクト配置確認
- fastapi-react-devcontainerフォルダをTest_DevContainer_Build内に配置 ✅

### ステップ1: VSCodeでプロジェクトフォルダを開く

**方法1: Windows側から**
```cmd
cd \\wsl$\Ubuntu-22.04\home\gbrai\Test_DevContainer_Build\fastapi-react-devcontainer
code .
```

**方法2: WSL側から**  
```bash
cd /home/gbrai/Test_DevContainer_Build/fastapi-react-devcontainer
code .
```

### ステップ2: DevContainer通知の確認

VSCodeが開くと、右下に通知が表示：
```
📦 フォルダに Dev Container 構成が含まれています
[コンテナーで再度開く] [フォルダーで開く] [もう表示しない]
```
**「コンテナーで再度開く」をクリック**

### ステップ3: DevContainerビルド開始

初回起動時の自動処理（2-5分）：
1. **Dockerイメージのビルド** - Python 3.11 + Node.js 18 環境構築
2. **コンテナの起動** - docker-compose.yml に基づく
3. **VSCode拡張機能のインストール** - devcontainer.json指定分
4. **依存関係のインストール** - pip install & npm install

### ステップ4: DevContainer起動完了の確認

成功すると：
- 左下に **「Dev Container: FastAPI + React Development」** と表示
- ターミナルに **`vscode@...:/workspace$`** プロンプト
- ファイルエクスプローラーに `/workspace` が表示

### ステップ5: 動作確認コマンド

```bash
# 現在の場所を確認
pwd  # → /workspace

# Python バージョン確認  
python --version  # → Python 3.11.x

# Node.js バージョン確認
node --version    # → v18.x.x
```

### ステップ6: アプリケーション起動と動作確認

**バックエンド（FastAPI）の起動**
```bash
# バックエンドディレクトリに移動
cd /workspace/backend

# FastAPI サーバーを起動  
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

成功時の表示例：
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [123] using WatchFiles
INFO:     Started server process [456]  
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**フロントエンド（React）の起動**
```bash
# 新しいターミナルで
cd /workspace/frontend

# React 開発サーバーを起動
npm start
```

成功時の表示例：
```
Local:            http://localhost:3000
On Your Network:  http://172.17.0.2:3000
webpack compiled with 0 errors
```

### ステップ7: ブラウザでの動作確認

**アクセスURL：**
- **React アプリ**: http://localhost:3000
- **FastAPI API**: http://localhost:8000  
- **API ドキュメント**: http://localhost:8000/docs

**期待される動作：**
1. http://localhost:3000 でToDoアプリが表示
2. タスクの追加・削除・完了切り替えができる
3. http://localhost:8000/docs でAPI仕様が確認できる

### よくあるトラブルと解決方法

**ポートが使用中の場合**
```bash
netstat -tulpn | grep :8000
netstat -tulpn | grep :3000
```

**依存関係のエラーの場合**
```bash  
# 再インストール
cd /workspace/backend && pip install -r requirements.txt
cd /workspace/frontend && rm -rf node_modules && npm install
```

## 第12回：DevContainer内でClaudeCode環境構築

### 目的
DevContainer内でClaudeCodeを動作させて、完全に統一された開発環境を作る

### ステップ1: DockerfileにClaudeCode CLIを追加

```dockerfile
# ClaudeCode CLIをグローバルにインストール（rootユーザーで実行）
RUN npm install -g @anthropic-ai/claude-code
```

### ステップ2: devcontainer.jsonにClaudeCode拡張機能を追加

```json
"extensions": [
    "ms-python.python",
    "ms-python.vscode-pylance", 
    "ms-python.black-formatter",
    "ms-python.flake8",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "anthropic.claude-code"
]
```

### ステップ3: プロジェクト用CLAUDE.mdファイル作成

DevContainer向けの詳細なプロジェクト説明ファイルを作成 ✅

### ステップ4: DevContainer再構築手順

**方法1: VS Codeコマンドパレット**
1. `Ctrl+Shift+P` でコマンドパレット
2. "Dev Containers: Rebuild Container" を選択
3. 再構築を待つ（5-10分）

**方法2: 手動再構築**
```bash
cd /home/gbrai/Test_DevContainer_Build/fastapi-react-devcontainer
docker-compose -f .devcontainer/docker-compose.yml down
docker system prune -f
code .
```

### ステップ5: ClaudeCode動作確認

```bash
# CLIが利用可能か確認
claude-code --version

# 初回セットアップ
claude-code auth login
```

### 完成した環境の特徴

- チーム全員が同じClaudeCode環境を使用
- 依存関係の衝突なし  
- コンテナ内で完結した開発環境
- Python + React + ClaudeCode が全て統合

---