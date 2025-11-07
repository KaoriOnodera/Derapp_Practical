# Derapp_Practical

FastAPI と Next.js を使用した顧客管理システムです。

## 機能

- **顧客管理**: 顧客情報の作成、読み取り、更新、削除（CRUD 操作）
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **REST API**: FastAPI による RESTful API

## セットアップ手順

### プロジェクトのクローン

```bash
git clone https://github.com/KaoriOnodera/Derapp_Practical.git
cd Derapp_Practical
```

## バックエンド (FastAPI)

```bash
cd backend
python3 -m venv backend_env
source backend_env/bin/activate  # macOS/Linux の場合
# ./backend_env/Scripts/activate.ps1  # Windows PowerShell の場合
pip install -r requirements.txt
uvicorn app:app --reload
```

## フロントエンド (Next.js)

```bash
cd frontend
npm install
npm run dev
```

## アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンド API**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs
- **顧客管理画面**: http://localhost:3000/customers

## API エンドポイント

### 顧客管理

- `GET /` - トップページ
- `POST /customers` - 顧客作成
- `GET /customers?customer_id={id}` - 特定顧客取得
- `GET /allcustomers` - 全顧客取得
- `PUT /customers` - 顧客更新
- `DELETE /customers?customer_id={id}` - 顧客削除
- `GET /fetchtest` - テスト用外部 API 呼び出し

### フロントエンド画面

- `/customers` - 顧客一覧表示
- `/customers/create` - 新規顧客作成
- `/customers/read/[id]` - 顧客詳細表示
- `/customers/update/[id]` - 顧客情報更新
- `/customers/delete/[id]` - 顧客削除

## 技術スタック

- **バックエンド**: FastAPI, Python, SQLite, Pydantic
- **フロントエンド**: Next.js 13+, React, Tailwind CSS, DaisyUI
- **データベース**: SQLite (開発環境)
- **API**: RESTful API, CORS 対応

## データモデル

### Customer

```json
{
  "customer_id": "string",
  "customer_name": "string",
  "age": "integer",
  "gender": "string"
}
```

## プロジェクト構成

```
Derapp_Practical/
├── backend/
│   ├── db_control/
│   │   ├── crud.py         # CRUD操作
│   │   ├── mymodels.py     # データモデル
│   │   └── CRM.db         # SQLiteデータベース
│   ├── app.py             # FastAPI メインアプリ
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── customers/  # 顧客管理ページ
│   │       └── components/ # 共通コンポーネント
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 開発メモ

- FastAPI は自動的に API ドキュメント（Swagger UI）を生成します
- CORS 設定により、フロントエンドからの API 呼び出しが可能
- SQLite データベースを使用（ファイルベース）
