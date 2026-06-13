"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  note: string;
  date: string; // ISO yyyy-mm-dd
}

interface BudgetLimit {
  categoryId: CategoryId;
  limit: number;
}

type CategoryId = "food" | "transport" | "shopping" | "entertainment" | "health" | "bills" | "other";

interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  yellow:   "#E8F900",
  cyan:     "#00D4E8",
  pink:     "#FF6FD8",
  purple:   "#C8B4FF",
  green:    "#72F7AE",
  red:      "#FF6B6B",
  black:    "#0A0A0A",
  white:    "#FFFFFF",
  offwhite: "#F5F4EE",
  muted:    "rgba(10,10,10,0.45)",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: "food",          label: "Food & Drinks",  emoji: "🍜", color: C.yellow  },
  { id: "transport",     label: "Transport",      emoji: "🚌", color: C.cyan    },
  { id: "shopping",      label: "Shopping",       emoji: "🛍️", color: C.pink    },
  { id: "entertainment", label: "Entertainment",  emoji: "🎮", color: C.purple  },
  { id: "health",        label: "Health",         emoji: "💊", color: C.green   },
  { id: "bills",         label: "Bills",          emoji: "⚡", color: "#FFB347" },
  { id: "other",         label: "Other",          emoji: "📦", color: "#C8C8C8" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>;

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  (TODO: replace with supabase.from('expenses').select('*').eq('user_id', userId))
// ─────────────────────────────────────────────────────────────────────────────
function today() { return new Date().toISOString().slice(0, 10); }
function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const MOCK_EXPENSES: Expense[] = [
  { id: "1",  amount: 180,  category: "food",          note: "Lunch at Darshini",     date: today()      },
  { id: "2",  amount: 450,  category: "food",          note: "Swiggy dinner",         date: today()      },
  { id: "3",  amount: 60,   category: "transport",     note: "Auto to college",       date: today()      },
  { id: "4",  amount: 1200, category: "shopping",      note: "H&M t-shirt",           date: daysAgo(1)   },
  { id: "5",  amount: 99,   category: "entertainment", note: "Netflix monthly",       date: daysAgo(1)   },
  { id: "6",  amount: 240,  category: "food",          note: "Boba tea + snacks",     date: daysAgo(1)   },
  { id: "7",  amount: 350,  category: "health",        note: "Pharmacy",              date: daysAgo(2)   },
  { id: "8",  amount: 80,   category: "transport",     note: "Metro card recharge",   date: daysAgo(2)   },
  { id: "9",  amount: 3500, category: "bills",         note: "Electricity bill",      date: daysAgo(3)   },
  { id: "10", amount: 599,  category: "entertainment", note: "Spotify + YouTube",     date: daysAgo(3)   },
  { id: "11", amount: 720,  category: "food",          note: "Groceries",             date: daysAgo(4)   },
  { id: "12", amount: 2200, category: "shopping",      note: "Boat earphones",        date: daysAgo(5)   },
  { id: "13", amount: 150,  category: "other",         note: "Stationery",            date: daysAgo(6)   },
  { id: "14", amount: 500,  category: "food",          note: "Friend's birthday cake",date: daysAgo(6)   },
];

// TODO: supabase.from('budget_limits').select('*').eq('user_id', userId)
const MOCK_BUDGETS: BudgetLimit[] = [
  { categoryId: "food",          limit: 3000  },
  { categoryId: "shopping",      limit: 2000  },
  { categoryId: "entertainment", limit: 500   },
  { categoryId: "transport",     limit: 800   },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatINR(n: number) {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)   return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.round((now.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function uid() { return Math.random().toString(36).slice(2, 9); }

// ─────────────────────────────────────────────────────────────────────────────
// ADD EXPENSE DRAWER
// ─────────────────────────────────────────────────────────────────────────────
interface AddDrawerProps { onAdd: (e: Expense) => void; onClose: () => void; }

function AddExpenseDrawer({ onAdd, onClose }: AddDrawerProps) {
  const [amount,   setAmount]   = useState("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [note,     setNote]     = useState("");
  const [date,     setDate]     = useState(today());
  const [error,    setError]    = useState("");

  function submit() {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) { setError("Enter a valid amount"); return; }
    if (amt > 1_000_000) { setError("Amount seems too large"); return; }
    // TODO: supabase.from('expenses').insert({ user_id, amount: amt, category, note, date })
    onAdd({ id: uid(), amount: amt, category, note: note.trim() || CAT_MAP[category].label, date });
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,10,10,0.65)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.offwhite, borderRadius: "32px 32px 0 0", border: `3px solid ${C.black}`, borderBottom: "none", width: "100%", maxWidth: 520, padding: "28px 28px 48px" }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "rgba(0,0,0,0.15)", borderRadius: 99, margin: "0 auto 24px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Add Expense</h2>
          <button onClick={onClose} style={{ background: C.black, color: C.white, border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 14, cursor: "pointer", fontWeight: 800, fontFamily: "inherit" }}>✕</button>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 8 }}>AMOUNT</label>
          <div style={{ display: "flex", alignItems: "center", background: C.white, border: `2.5px solid ${error ? C.red : C.black}`, borderRadius: 16, padding: "0 16px", boxShadow: `3px 4px 0 ${C.black}` }}>
            <span style={{ fontSize: 22, fontWeight: 800, opacity: 0.4, marginRight: 8 }}>₹</span>
            <input
              autoFocus
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 28, fontWeight: 800, fontFamily: "inherit", background: "transparent", padding: "14px 0", width: "100%" }}
            />
          </div>
          {error && <p style={{ fontSize: 12, color: C.red, fontWeight: 700, marginTop: 6 }}>{error}</p>}
        </div>

        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 10 }}>CATEGORY</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
                background: category === cat.id ? cat.color : C.white,
                border: `2px solid ${category === cat.id ? C.black : "rgba(0,0,0,0.12)"}`,
                borderRadius: 14, padding: "10px 6px", cursor: "pointer", fontFamily: "inherit",
                boxShadow: category === cat.id ? `2px 3px 0 ${C.black}` : "none",
                transition: "all 0.15s",
              }}>
                <div style={{ fontSize: 20 }}>{cat.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, opacity: 0.7 }}>{cat.label.split(" ")[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 8 }}>NOTE (optional)</label>
          <input
            type="text"
            placeholder={`e.g. ${CAT_MAP[category].label}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={60}
            style={{ width: "100%", border: `2px solid ${C.black}`, borderRadius: 14, padding: "12px 16px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", background: C.white, outline: "none", boxShadow: `2px 3px 0 ${C.black}` }}
          />
        </div>

        {/* Date */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 8 }}>DATE</label>
          <input
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", border: `2px solid ${C.black}`, borderRadius: 14, padding: "12px 16px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", background: C.white, outline: "none", boxShadow: `2px 3px 0 ${C.black}` }}
          />
        </div>

        <button onClick={submit} style={{
          width: "100%", background: C.black, color: C.yellow,
          border: `2.5px solid ${C.black}`, borderRadius: 18,
          padding: "16px", fontWeight: 800, fontSize: 17,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: `4px 5px 0 rgba(0,0,0,0.25)`,
          transition: "transform 0.15s",
        }}>
          Add Expense ✓
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET EDITOR DRAWER
// ─────────────────────────────────────────────────────────────────────────────
interface BudgetDrawerProps { budgets: BudgetLimit[]; onSave: (b: BudgetLimit[]) => void; onClose: () => void; }

function BudgetDrawer({ budgets, onSave, onClose }: BudgetDrawerProps) {
  const [local, setLocal] = useState<Record<CategoryId, string>>(
    Object.fromEntries(
      CATEGORIES.map((c) => [c.id, String(budgets.find((b) => b.categoryId === c.id)?.limit ?? "")])
    ) as Record<CategoryId, string>
  );

  function save() {
    const result: BudgetLimit[] = [];
    for (const cat of CATEGORIES) {
      const v = parseFloat(local[cat.id]);
      if (!isNaN(v) && v > 0) result.push({ categoryId: cat.id, limit: v });
    }
    // TODO: supabase.from('budget_limits').upsert(result.map(r => ({ ...r, user_id })))
    onSave(result);
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,10,10,0.65)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.offwhite, borderRadius: "32px 32px 0 0", border: `3px solid ${C.black}`, borderBottom: "none", width: "100%", maxWidth: 520, padding: "28px 28px 48px", maxHeight: "88vh", overflowY: "auto" }}
      >
        <div style={{ width: 36, height: 4, background: "rgba(0,0,0,0.15)", borderRadius: 99, margin: "0 auto 24px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Set Budgets</h2>
          <button onClick={onClose} style={{ background: C.black, color: C.white, border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 14, cursor: "pointer", fontWeight: 800, fontFamily: "inherit" }}>✕</button>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.5, marginBottom: 22 }}>Set a monthly spending limit per category. Leave blank for no limit.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, background: cat.color, border: `2px solid ${C.black}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cat.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{cat.label}</div>
                <div style={{ display: "flex", alignItems: "center", background: C.white, border: `2px solid ${C.black}`, borderRadius: 12, padding: "0 12px" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.4, marginRight: 6 }}>₹</span>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={local[cat.id]}
                    onChange={(e) => setLocal((l) => ({ ...l, [cat.id]: e.target.value }))}
                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontWeight: 700, fontFamily: "inherit", background: "transparent", padding: "10px 0" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={save} style={{ width: "100%", background: C.black, color: C.yellow, border: `2.5px solid ${C.black}`, borderRadius: 18, padding: "15px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>
          Save Budgets ✓
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY BREAKDOWN BAR
// ─────────────────────────────────────────────────────────────────────────────
interface BreakdownProps { expenses: Expense[]; budgets: BudgetLimit[]; }

function CategoryBreakdown({ expenses, budgets }: BreakdownProps) {
  const totals = useMemo(() => {
    const map: Partial<Record<CategoryId, number>> = {};
    for (const e of expenses) map[e.category] = (map[e.category] ?? 0) + e.amount;
    return map;
  }, [expenses]);

  const grandTotal = Object.values(totals).reduce((a, b) => a + (b ?? 0), 0);
  const sorted = CATEGORIES.filter((c) => totals[c.id]).sort((a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0));

  if (!sorted.length) return (
    <div style={{ textAlign: "center", padding: "40px 20px", opacity: 0.4 }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
      <p style={{ fontWeight: 700, fontSize: 14 }}>No expenses yet</p>
    </div>
  );

  return (
    <div>
      {/* Stacked bar */}
      <div style={{ height: 20, borderRadius: 99, overflow: "hidden", display: "flex", border: `2px solid ${C.black}`, marginBottom: 20 }}>
        {sorted.map((cat) => {
          const pct = ((totals[cat.id] ?? 0) / grandTotal) * 100;
          return (
            <motion.div key={cat.id}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ height: "100%", background: cat.color, minWidth: pct > 3 ? 2 : 0 }}
            />
          );
        })}
      </div>

      {/* Category rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((cat) => {
          const spent   = totals[cat.id] ?? 0;
          const budget  = budgets.find((b) => b.categoryId === cat.id);
          const pct     = budget ? Math.min((spent / budget.limit) * 100, 100) : null;
          const over    = budget && spent > budget.limit;
          const warning = budget && spent >= budget.limit * 0.8 && !over;

          return (
            <div key={cat.id} style={{ background: C.white, border: `2px solid ${C.black}`, borderRadius: 18, padding: "14px 16px", boxShadow: `2px 3px 0 ${C.black}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: budget ? 10 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: cat.color, border: `2px solid ${C.black}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{cat.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{cat.label}</div>
                    {budget && (
                      <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, marginTop: 1 }}>
                        Budget: {formatINR(budget.limit)}
                        {over    && <span style={{ color: C.red,    marginLeft: 6, opacity: 1 }}>• Over budget!</span>}
                        {warning && <span style={{ color: "#FF8C00", marginLeft: 6, opacity: 1 }}>• Almost there</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: over ? C.red : C.black }}>{formatINR(spent)}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.4 }}>{Math.round((spent / grandTotal) * 100)}% of total</div>
                </div>
              </div>

              {/* Budget progress bar */}
              {pct !== null && (
                <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 99, height: 8, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{ height: "100%", background: over ? C.red : warning ? "#FF8C00" : cat.color, borderRadius: 99 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSE LIST  (grouped by date)
// ─────────────────────────────────────────────────────────────────────────────
interface ExpenseListProps { expenses: Expense[]; onDelete: (id: string) => void; }

function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));
    for (const e of sorted) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return map;
  }, [expenses]);

  if (!expenses.length) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
      <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>No expenses yet</p>
      <p style={{ fontSize: 14, opacity: 0.5, fontWeight: 500 }}>Tap + to log your first expense</p>
    </div>
  );

  function confirmDelete(id: string) {
    // TODO: supabase.from('expenses').delete().eq('id', id)
    setDeletingId(null);
    onDelete(id);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {Array.from(grouped.entries()).map(([date, items]) => {
        const dayTotal = items.reduce((s, e) => s + e.amount, 0);
        return (
          <div key={date}>
            {/* Day header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.05em", opacity: 0.5 }}>{fmtDate(date).toUpperCase()}</span>
              <span style={{ fontSize: 13, fontWeight: 800, background: C.black, color: C.yellow, borderRadius: 99, padding: "3px 12px" }}>{formatINR(dayTotal)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <AnimatePresence>
                {items.map((expense) => {
                  const cat = CAT_MAP[expense.category];
                  return (
                    <motion.div key={expense.id}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ background: C.white, border: `2px solid ${C.black}`, borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: `2px 3px 0 ${C.black}` }}
                    >
                      <div style={{ width: 42, height: 42, background: cat.color, border: `2px solid ${C.black}`, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{cat.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{expense.note}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.45 }}>{cat.label}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>₹{expense.amount.toLocaleString()}</div>
                        {deletingId === expense.id ? (
                          <div style={{ display: "flex", gap: 6, marginTop: 4, justifyContent: "flex-end" }}>
                            <button onClick={() => confirmDelete(expense.id)} style={{ background: C.red, color: C.white, border: `1.5px solid ${C.black}`, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                            <button onClick={() => setDeletingId(null)} style={{ background: C.white, color: C.black, border: `1.5px solid ${C.black}`, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeletingId(expense.id)} style={{ fontSize: 11, fontWeight: 700, opacity: 0.3, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 2 }}>remove</button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY STATS
// ─────────────────────────────────────────────────────────────────────────────
function SummaryStats({ expenses }: { expenses: Expense[] }) {
  const total      = expenses.reduce((s, e) => s + e.amount, 0);
  const days       = new Set(expenses.map((e) => e.date)).size || 1;
  const dailyAvg   = total / days;

  const catTotals  = CATEGORIES.map((c) => ({ cat: c, total: expenses.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0) }));
  const topCat     = catTotals.sort((a, b) => b.total - a.total)[0];

  const todayTotal = expenses.filter((e) => e.date === today()).reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
      {[
        { label: "Total this month", val: formatINR(total),        color: C.yellow,  emoji: "💸" },
        { label: "Spent today",      val: formatINR(todayTotal),   color: C.cyan,    emoji: "📅" },
        { label: "Daily average",    val: formatINR(dailyAvg),     color: C.purple,  emoji: "📊" },
        { label: "Top category",     val: topCat?.total ? `${topCat.cat.emoji} ${topCat.cat.label.split(" ")[0]}` : "—", color: C.pink, emoji: "🏆" },
      ].map(({ label, val, color, emoji }) => (
        <motion.div key={label} whileHover={{ y: -2 }} style={{ background: color, border: `2.5px solid ${C.black}`, borderRadius: 22, padding: "18px 16px", boxShadow: `3px 4px 0 ${C.black}` }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>{emoji}</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>{val}</div>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>{label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Transactions", "Budgets"] as const;
type Tab   = (typeof TABS)[number];

export default function ExpenseTrackerPage() {
  const [expenses,    setExpenses]    = useState<Expense[]>(MOCK_EXPENSES);
  const [budgets,     setBudgets]     = useState<BudgetLimit[]>(MOCK_BUDGETS);
  const [activeTab,   setActiveTab]   = useState<Tab>("Overview");
  const [showAdd,     setShowAdd]     = useState(false);
  const [showBudget,  setShowBudget]  = useState(false);

  function addExpense(e: Expense) {
    setExpenses((prev) => [e, ...prev]);
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", background: C.offwhite, color: C.black, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=date]::-webkit-calendar-picker-indicator { cursor: pointer; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 99px; }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .cat-grid  { grid-template-columns: repeat(3,1fr) !important; }
        }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{ background: C.black, borderBottom: `3px solid ${C.black}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ fontSize: 20 }}>🐷</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: C.yellow }}>Z-PiggyBank</span>
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600 }}>Expenses</span>
          </div>
          <button onClick={() => setShowBudget(true)} style={{ background: "rgba(255,255,255,0.08)", color: C.white, border: `1.5px solid rgba(255,255,255,0.15)`, borderRadius: 99, padding: "6px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            ⚙️ Budgets
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "36px 20px 100px" }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 32 }}>
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-block", background: C.pink, border: `2px solid ${C.black}`, borderRadius: 40, padding: "5px 16px", fontWeight: 800, fontSize: 12, letterSpacing: "0.07em", marginBottom: 14 }}>
            EXPENSE TRACKER 📊
          </motion.span>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
                Where did<br />
                <span style={{ background: C.yellow, padding: "0 6px", borderRadius: 8 }}>your money go?</span>
              </h1>
            </div>
            <div style={{ background: C.black, border: `2.5px solid ${C.black}`, borderRadius: 20, padding: "14px 20px", boxShadow: `4px 5px 0 rgba(0,0,0,0.2)` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.yellow, opacity: 0.7, marginBottom: 4 }}>THIS MONTH</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.yellow, letterSpacing: "-0.04em" }}>{formatINR(totalSpent)}</div>
            </div>
          </motion.div>
        </div>

        {/* ── SUMMARY STATS ── */}
        <SummaryStats expenses={expenses} />

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? C.black : C.white,
              color:      activeTab === tab ? C.yellow : C.black,
              border: `2.5px solid ${C.black}`, borderRadius: 40,
              padding: "9px 22px", fontWeight: 800, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: activeTab === tab ? `3px 4px 0 rgba(0,0,0,0.25)` : `2px 3px 0 ${C.black}`,
              transition: "all 0.15s",
            }}>{tab}</button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "Overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em" }}>Spending by Category</h3>
            </div>
            <CategoryBreakdown expenses={expenses} budgets={budgets} />
          </motion.div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {activeTab === "Transactions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em" }}>{expenses.length} transactions</h3>
            </div>
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </motion.div>
        )}

        {/* ── BUDGETS TAB ── */}
        {activeTab === "Budgets" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em" }}>Monthly Budgets</h3>
              <button onClick={() => setShowBudget(true)} style={{ background: C.yellow, border: `2px solid ${C.black}`, borderRadius: 12, padding: "8px 18px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: `2px 3px 0 ${C.black}` }}>Edit →</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CATEGORIES.map((cat) => {
                const budget = budgets.find((b) => b.categoryId === cat.id);
                const spent  = expenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
                const pct    = budget ? Math.min((spent / budget.limit) * 100, 100) : null;
                const over   = budget && spent > budget.limit;

                return (
                  <div key={cat.id} style={{ background: C.white, border: `2px solid ${C.black}`, borderRadius: 18, padding: "16px 18px", boxShadow: `2px 3px 0 ${C.black}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: budget ? 12 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 38, height: 38, background: cat.color, border: `2px solid ${C.black}`, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{cat.emoji}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14 }}>{cat.label}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.45, marginTop: 1 }}>
                            {budget ? `${formatINR(spent)} / ${formatINR(budget.limit)}` : `${formatINR(spent)} — no limit set`}
                          </div>
                        </div>
                      </div>
                      {over && <span style={{ background: C.red, color: C.white, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>Over!</span>}
                      {!budget && <span style={{ border: `1.5px solid rgba(0,0,0,0.15)`, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700, opacity: 0.4 }}>No limit</span>}
                    </div>
                    {pct !== null && (
                      <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 99, height: 10, overflow: "hidden" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: "easeOut" }}
                          style={{ height: "100%", background: over ? C.red : cat.color, borderRadius: 99 }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── FAB ADD BUTTON ── */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdd(true)}
        style={{
          position: "fixed", bottom: 32, right: 28,
          width: 64, height: 64,
          background: C.yellow, color: C.black,
          border: `3px solid ${C.black}`, borderRadius: "50%",
          fontSize: 28, fontWeight: 800, cursor: "pointer",
          boxShadow: `4px 5px 0 ${C.black}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 40,
        }}
      >+</motion.button>

      {/* ── DRAWERS ── */}
      <AnimatePresence>
        {showAdd    && <AddExpenseDrawer onAdd={addExpense}   onClose={() => setShowAdd(false)} />}
        {showBudget && <BudgetDrawer budgets={budgets} onSave={setBudgets} onClose={() => setShowBudget(false)} />}
      </AnimatePresence>
    </div>
  );
}