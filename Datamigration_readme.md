# SQLite から MySQL へのデータ移行スクリプト解説

## 概要

このスクリプトは、SQLite データベースから MySQL データベースへデータを移行するためのツールです。
既存の SQLite データベース（`CRM.db`）のデータを MySQL データベースへコピーします。

---

## ファイル構造と役割

### 1. インポートセクション

```python
import sqlite3
import mysql.connector
from pathlib import Path
```

**役割:**

- `sqlite3`: SQLite データベースへの接続・読み取り
- `mysql.connector`: MySQL データベースへの接続・書き込み
- `pathlib.Path`: ファイルパスの管理 -> 異なる環境や OS でも正しくファイルにアクセスするするために必要

---

### 2. データベース接続設定

#### 2.1 SQLite 接続設定

```python
# SQLiteデータベースのパス
sqlite_db_path = Path(__file__).parent.parent / 'CRM.db'
sqlite_conn = sqlite3.connect(sqlite_db_path)
sqlite_cursor = sqlite_conn.cursor()
```

**役割:**

- 移行元となる SQLite データベースへの接続
- `CRM.db` ファイルから既存データを読み取るための準備

---

#### 2.2 MySQL 接続設定

```python
# MySQL接続設定
mysql_conn = mysql.connector.connect(
    host="aws.connect.psdb.cloud",
    user="************",
    password="************",
    database="kaorionodera",
    ssl_ca="DigiCertGlobalRootG2.crt.pem"
)
mysql_cursor = mysql_conn.cursor()
```

**役割:**

- 移行先となる MySQL データベースへの接続
- PlanetScale などのクラウド MySQL への SSL 接続
- 認証情報とデータベース名の指定

---

### 3. データ移行処理

#### 3.1 テーブルの初期化

```python
# MySQLのテーブルをクリア（既存データを削除）
mysql_cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
tables = ['customers', 'items', 'purchases', 'purchase_details']
for table in tables:
    mysql_cursor.execute(f"DELETE FROM {table}")
mysql_cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
```

**役割:**

- 外部キー制約を一時的に無効化
- 既存の MySQL テーブルのデータをすべて削除
- 外部キー制約を再有効化

**重要:** このステップにより、MySQL 側の既存データはすべて削除されます

---

#### 3.2 Customers テーブルの移行

```python
# Customersテーブルの移行
sqlite_cursor.execute("SELECT * FROM customers")
customers = sqlite_cursor.fetchall()
for customer in customers:
    mysql_cursor.execute(
        "INSERT INTO customers (customer_id, customer_name, age, gender) VALUES (%s, %s, %s, %s)",
        customer
    )
print(f"Migrated {len(customers)} customers")
```

**役割:**

- SQLite から顧客データを全件取得
- MySQL へ 1 件ずつ INSERT
- 移行件数の表示

---

#### 3.3 Items テーブルの移行

```python
# Itemsテーブルの移行
sqlite_cursor.execute("SELECT * FROM items")
items = sqlite_cursor.fetchall()
for item in items:
    mysql_cursor.execute(
        "INSERT INTO items (item_id, item_name, price) VALUES (%s, %s, %s)",
        item
    )
print(f"Migrated {len(items)} items")
```

**役割:**

- SQLite から商品データを全件取得
- MySQL へ 1 件ずつ INSERT
- 移行件数の表示

---

#### 3.4 Purchases テーブルの移行

```python
# Purchasesテーブルの移行
sqlite_cursor.execute("SELECT * FROM purchases")
purchases = sqlite_cursor.fetchall()
for purchase in purchases:
    mysql_cursor.execute(
        "INSERT INTO purchases (purchase_id, purchase_name, date) VALUES (%s, %s, %s)",
        purchase
    )
print(f"Migrated {len(purchases)} purchases")
```

**役割:**

- SQLite から購入データを全件取得
- MySQL へ 1 件ずつ INSERT
- 移行件数の表示

---

#### 3.5 Purchase_Details テーブルの移行

```python
# Purchase_Detailsテーブルの移行
sqlite_cursor.execute("SELECT * FROM purchase_details")
purchase_details = sqlite_cursor.fetchall()
for detail in purchase_details:
    mysql_cursor.execute(
        "INSERT INTO purchase_details (purchase_id, item_name, quantity) VALUES (%s, %s, %s)",
        detail
    )
print(f"Migrated {len(purchase_details)} purchase details")
```

**役割:**

- SQLite から購入明細データを全件取得
- MySQL へ 1 件ずつ INSERT
- 移行件数の表示

---

### 4. トランザクション管理とクリーンアップ

```python
# 変更をコミット
mysql_conn.commit()

# 接続を閉じる
sqlite_cursor.close()
sqlite_conn.close()
mysql_cursor.close()
mysql_conn.close()

print("Migration completed successfully!")
```

**役割:**

- すべての INSERT 処理を確定（コミット）
- SQLite と MySQL の接続を安全に閉じる
- 完了メッセージの表示

---

## 実行方法

```bash
# backend ディレクトリから実行
cd backend
python db_control/migrate_sqlite_to_mysql.py
```

---

## 注意事項

### ⚠️ 重要な警告

1. **データの上書き**: このスクリプトは MySQL のテーブルをクリアします
2. **バックアップ**: 実行前に MySQL データのバックアップを推奨
3. **認証情報**: スクリプト内の MySQL 接続情報を環境変数化することを推奨

### 🔒 セキュリティ推奨事項

```python
import os

mysql_conn = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE"),
    ssl_ca="DigiCertGlobalRootG2.crt.pem"
)
```

---

## データフロー図

```
SQLite (CRM.db)                    MySQL (kaorionodera)
     |                                     |
     |-- customers ------------------>  customers
     |-- items --------------------->  items
     |-- purchases ----------------->  purchases
     |-- purchase_details ----------> purchase_details
```

---

## エラーハンドリング改善案

```python
try:
    # 移行処理
    mysql_cursor.execute("INSERT INTO customers ...", customer)
except mysql.connector.Error as err:
    print(f"Error: {err}")
    mysql_conn.rollback()
    raise
```

---

## まとめ

このスクリプトは以下の順序でデータ移行を実行します：

1. **接続確立**: SQLite と MySQL に接続
2. **データクリア**: MySQL のテーブルを初期化
3. **データ移行**: 4 つのテーブルを順次移行
   - Customers（顧客）
   - Items（商品）
   - Purchases（購入）
   - Purchase_Details（購入明細）
4. **コミット**: 変更を確定
5. **クリーンアップ**: 接続を閉じる

各ステップで件数を表示し、移行状況を確認できます。
