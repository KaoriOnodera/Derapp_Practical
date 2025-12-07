from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

# データベース接続情報
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

# MySQLのURL構築
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Azure環境かどうかを判定
# Azure App Service では WEBSITE_SITE_NAME 環境変数が自動設定される
IS_AZURE = os.getenv("WEBSITE_SITE_NAME") is not None

# SSL設定の構築
if IS_AZURE:
    # Azure環境: SSL検証をスキップ
    # Azure Database for MySQL は信頼できる環境なので検証不要
    connect_args = {
        "ssl": {
            "check_hostname": False,
            "verify_mode": False  # SSL検証を無効化
        }
    }
    print("Azure環境で接続します（SSL検証スキップ）")
else:
    # ローカル環境: 証明書を使用
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    cert_path = os.path.join(backend_dir, "DigiCertGlobalRootG2.crt.pem")
    
    if os.path.exists(cert_path):
        # 証明書ファイルが存在する場合
        connect_args = {
            "ssl": {
                "ca": cert_path,
                "check_hostname": False
            }
        }
        print(f"ローカル環境で接続します（証明書使用: {cert_path}）")
    else:
        # 証明書ファイルがない場合はSSL無効
        connect_args = {}
        print("ローカル環境で接続します（SSL無効）")

# エンジンの作成
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args=connect_args)