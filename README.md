# Gap Review – Vercelデプロイ手順書

## 📁 このZIPの中身

```
gap-review/
├── index.html          ← Viteのエントリーポイント
├── package.json        ← 依存パッケージの定義
├── vite.config.js      ← Viteの設定
├── .gitignore          ← Git管理から除外するファイル
├── public/             ← 静的ファイル用（今は空）
└── src/
    ├── main.jsx        ← Reactの起動ファイル
    └── App.jsx         ← あなたのアプリ本体（expectation-gap-review.jsx の中身）
```

---

## ✅ ステップ0：準備（Node.jsのインストール）

Macのターミナル（Spotlight検索で「ターミナル」と入力）を開いて、以下を実行：

```bash
node -v
```

バージョンが表示されればOK。表示されない場合は https://nodejs.org/ から **LTS版** をダウンロード＆インストールしてください。

---

## ✅ ステップ1：ローカルで動作確認

### 1-1. ZIPを解凍

ダウンロードした `gap-review.zip` をダブルクリックで解凍します。
`gap-review` フォルダができます。

### 1-2. ターミナルでフォルダに移動

```bash
cd ~/Downloads/gap-review
```

（解凍した場所に合わせてパスを変えてください）

### 1-3. パッケージをインストール

```bash
npm install
```

### 1-4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで **http://localhost:5173** を開いて、アプリが表示されれば成功です！

`Ctrl + C` でサーバーを停止できます。

---

## ✅ ステップ2：GitHubにアップロード

### 2-1. GitHubでリポジトリを作成

1. https://github.com/new を開く
2. **Repository name** に `gap-review` と入力
3. **Public** を選択
4. 他は何も変更せず **「Create repository」** をクリック

### 2-2. ターミナルからプッシュ

gap-review フォルダにいる状態で：

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/gap-review.git
git push -u origin main
```

⚠️ 「あなたのユーザー名」の部分は、GitHubのユーザー名に置き換えてください。

初回は認証を求められます。GitHubのユーザー名とパスワード（またはPersonal Access Token）を入力してください。

---

## ✅ ステップ3：Vercelでデプロイ

### 3-1. Vercelにログイン

1. https://vercel.com にアクセス
2. **「Sign Up」** → **「Continue with GitHub」** でログイン

### 3-2. プロジェクトを追加

1. **「Add New...」** → **「Project」** をクリック
2. `gap-review` リポジトリの横にある **「Import」** をクリック
3. 設定画面が出ますが、**何も変えずに** **「Deploy」** をクリック

### 3-3. 完了！

1〜2分でデプロイが完了し、以下のようなURLが発行されます：

```
https://gap-review-xxxx.vercel.app
```

このURLを友人に共有すれば、スマホでもPCでもすぐ確認してもらえます！

---

## 💡 よくあるトラブル

| 症状 | 対処法 |
|------|--------|
| `npm: command not found` | Node.jsがインストールされていません → https://nodejs.org/ |
| `git: command not found` | Gitがインストールされていません → ターミナルで `xcode-select --install` を実行 |
| GitHubの認証エラー | Personal Access Tokenが必要かも → GitHub Settings > Developer settings > Tokens |
| Vercelのビルドが失敗 | Vercel画面でエラーログを確認 → スクショを送ってもらえれば一緒に解決します |

---

## 🔜 次のステップ

デプロイが成功したら、次は：
1. 友人にURLを共有してUIの確認
2. Supabaseのデータベース設計
3. DB対応版への差し替え

に進みます！
