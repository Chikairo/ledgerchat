# LedgerChat 📊

> **Your conversations. Your business. One clear picture.**

LedgerChat is an AI-powered financial management and business intelligence web application designed for small businesses, informal merchants, WhatsApp vendors, retailers, wholesalers, and independent service providers across Nigeria and Africa.

The platform transforms unstructured business conversations (quotes, customer commitments, delivery terms) and bank transfer payment receipts into reconciled financial records, customer insights, product analytics, and exportable accounting reports.

---

## ✨ Features

- **Executive Financial Dashboard:** Distinguishes **Total Sales Volume** from **Verified Money Received** and **Outstanding Balances Owed**.
- **Gemma 4 AI Engine:** Server-side natural language and financial parsing powered by `gemma-4-26b-a4b-it` via `@google/genai`. Understands Nigerian currency expressions (`5k`, `10k`, `2.5m`, `₦50,000`) and Nigerian Pidgin (`"I don pay"`, `"balance tomorrow"`, `"confirm alert"`).
- **Proof of Payment & Evidence Verification:** Side-by-side inspection of customer chat excerpts, bank transfer receipts (GTBank, Access Bank, Moniepoint, OPay, Zenith, etc.), transaction references, and merchant sign-off controls.
- **WhatsApp Conversation Import:** Drag-and-drop support for `.txt` chat exports, `.zip` archives with media, and receipt images with step-by-step export instructions.
- **Customer Intelligence:** Customer rankings, repeat buyer tracking, purchase frequencies, and debtor lists.
- **Product Intelligence:** Strict distinction between informal chat inquiries vs. qualifying completed sales.
- **Business Insights:** Real-time revenue trends, collection rate graphs, and AI-powered recommendations.
- **Reports & Exporting:** Weekly, bi-weekly, monthly, and annual financial statements with **Excel (CSV)** export and **Print / PDF** generation.
- **Explore Demo Business (Chidi Electronics):** Pre-loaded with 22 realistic transactions, 9 customers, 9 products, and receipts for instant evaluation.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts
- **Backend:** Node.js, Express, tsx
- **AI Processing:** `@google/genai` (Gemma 4 / Gemini API)
- **Archive Extraction:** JSZip

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/ledgerchat.git
cd ledgerchat
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
# Gemini API Key (Required for Gemma 4 AI parsing)
GEMINI_API_KEY="your-gemini-api-key-here"

# Server Port
PORT=3000
```

### 4. Run the development server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🔒 Security & Merchant Privacy

- WhatsApp chat logs are processed on the server and strictly isolated to the user's business profile.
- No direct connection or scraping of private WhatsApp accounts.
- Merchants maintain full ownership and can wipe their stored records with one click in **Settings > Privacy**.
