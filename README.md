# タスク管理アプリ

Next.jsとSupabaseを使用したシンプルなCRUDアプリケーションです。

## 機能

- ✅ タスクの作成（Create）
- 📖 タスク一覧の表示（Read）
- ✏️ タスクの編集（Update）
- 🗑️ タスクの削除（Delete）
- 📊 タスクの統計情報表示
- 🎨 モダンなUI（Tailwind CSS）

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **言語**: TypeScript
- **状態管理**: React Hooks

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd solarDB
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下を取得：
   - Project URL
   - anon/public key

### 4. データベーステーブルの作成

Supabaseのダッシュボードで以下のSQLを実行：

```sql
-- power_plantsテーブルの作成
CREATE TABLE power_plants (
  id SERIAL PRIMARY KEY,
  plant_name VARCHAR(255) NOT NULL,
  plant_address TEXT NOT NULL,
  prefecture VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  ac_capacity DECIMAL(10,2) DEFAULT 0,
  operation_start_date DATE,
  category VARCHAR(50) DEFAULT 'その他',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- updated_atを自動更新するトリガーの作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_power_plants_updated_at BEFORE UPDATE ON power_plants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. 環境変数の設定

プロジェクトルートに`.env.local`ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてアプリケーションを確認してください。

## プロジェクト構造

```
src/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts          # タスク一覧取得・作成API
│   │       └── [id]/
│   │           └── route.ts      # 個別タスク操作API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # メインページ
├── components/
│   ├── TaskCard.tsx              # タスクカードコンポーネント
│   ├── TaskForm.tsx              # 新規作成フォーム
│   └── EditTaskForm.tsx          # 編集フォーム
├── hooks/
│   └── useTasks.ts               # タスク操作用カスタムフック
└── lib/
    └── supabase.ts               # Supabaseクライアント設定
```

## API エンドポイント

- `GET /api/tasks` - タスク一覧を取得
- `POST /api/tasks` - 新しいタスクを作成
- `GET /api/tasks/[id]` - 特定のタスクを取得
- `PUT /api/tasks/[id]` - タスクを更新
- `DELETE /api/tasks/[id]` - タスクを削除

## デプロイ

### Vercelでのデプロイ

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイ

### その他のプラットフォーム

Netlify、Railway、その他のプラットフォームでも同様にデプロイ可能です。

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します！
