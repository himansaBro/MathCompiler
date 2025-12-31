### 🧮 Math Compiler — A Handcrafted JavaScript Calculator

➡️ *Looks like a simple calculator.  
But inside? A full mini-compiler: lexer, AST, evaluator — all hand-rolled.*

This project was built to explore the **AST lifecycle** — from raw string to step-by-step evaluation — using **pure, vanilla JavaScript**, with **zero dependencies** or build tools.

It’s designed for learners diving into:
- 🔤 Custom tokenization  
- 🌳 AST generation & simplification  
- 🧠 Operator precedence & bracket parsing  
- 📜 Step-by-step execution tracing  

---

### 🗂 Project Structure

```
├─ calculator.html      # GUI interface (button-based)
├─ cli.html             # CLI-style interface (terminal feel)
│
├─ calculator.js/css    # UI helpers for calculator (no compiler logic)
├─ cli.js / cli.css     # Input filtering, focus, rendering — all UI-layer
│
└─ compiler.js          # 🧠 THE CORE: fully self-contained compiler
     ├─ Lexer (custom tokenizer)
     ├─ Implicit multiplication (`2(3)` → `2*(3)`)
     ├─ Recursive bracket parsing
     ├─ AST generation (with precedence scoring)
     ├─ AST simplification
     └─ AST executor (with step-by-step logging)
```

✅ **Compiler is 100% decoupled** from UI — drop `compiler.js` into any project and call:
```js
const result = CalculateResult("2 + 3 * (4 - 1)");
// → { answer: 11, flow: "4 - 1 = 3\n3 * 3 = 9\n2 + 9 = 11" }
```

---

### 🔧 Extensibility (Future-Proof!)

While not *designed* for production, the core is intentionally modular:
- Add new operators? → Tweak `getValueOfOp()` + `Calculate()`.
- Support functions (`sin`, `sqrt`)? → Extend lexer + AST node types.
- Unary minus? → Already prototyped with `0-(x)` — formal support is ~20 lines away!

💡 With just ~50 lines of lexer/executor changes, this could evolve into:
- A safe math sandbox (no `eval`!)  
- A tiny DSL for formulas  
- An educational AST visualizer

---

### ⚠️ License & Disclaimer

> 🙏 **Free to use as a learning tool!**  
> I welcome issues, suggestions, and PRs — especially from fellow learners. 😊

> ⚠️ **Not for production use.**  
> This project is for educational purposes only.  
> No guarantees — use at your own risk.  
> (But honestly? It’s more reliable than my coffee maker. ☕)

---

Made with curiosity.  
— [@HimansaBro](https://github.com/HimansaBro)
