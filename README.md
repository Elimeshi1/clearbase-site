# Clearbase – אתר החברה

אתר סטטי (HTML, CSS, JS) בלי שלב בנייה. אפשר להעלות כמו שהוא ל-Vercel, Netlify או Cloudflare Pages.

- `index.html` – דף הבית
- `team.html` – הצוות
- `apps.html`, `ai.html` וכו' – עמודי התחומים
- `styles.css`, `script.js` – עיצוב והתנהגות

## עריכה
- **פרטי קשר:** בראש `script.js` (`CONFIG.whatsapp`, `CONFIG.email`).
- **עמודי התחומים** נוצרים מ-`build_services.py`. עורכים את הטקסטים שם ומריצים `python3 build_services.py`.
