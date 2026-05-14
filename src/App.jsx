import { useState, useRef } from "react";

const initialCustomers = [
  { id: 1, name: "田中 花子", address: "東京都渋谷区代々木1-2-3", product: "ワイヤレスイヤホン", price: 3800, comment: "梱包も丁寧で大変満足！またお願いしたいです。" },
  { id: 2, name: "佐藤 一郎", address: "大阪府大阪市北区梅田2-4-6", product: "古着デニムジャケット", price: 2500, comment: "連絡が少し遅かったが商品は問題なし。" },
  { id: 3, name: "鈴木 美咲", address: "神奈川県横浜市中区本町3-1-5", product: "ハンドメイドポーチ", price: 1200, comment: "可愛くて品質も最高！リピートします。" },
  { id: 4, name: "山本 健太", address: "愛知県名古屋市中区栄1-7-2", product: "スニーカー（27cm）", price: 6000, comment: "値下げ交渉が激しく対応に困った。" },
];

const EMPTY = { name: "", address: "", product: "", price: "", comment: "" };

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "5px", fontWeight: "600" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  border: "1.5px solid #E8E8E8", borderRadius: "10px",
  padding: "11px 14px", fontSize: "15px",
  outline: "none", background: "#FAFAFA", fontFamily: "inherit",
};

export default function App() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(EMPTY);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const nextId = useRef(5);

  const set = (key) => (e) => setEditData(d => ({ ...d, [key]: e.target.value }));

  const filtered = customers.filter(c =>
    c.name.includes(search) || c.address.includes(search) || c.product.includes(search)
  );

  function openAdd() { setEditData(EMPTY); setIsEdit(false); setShowForm(true); }
  function openEdit(c) { setEditData({ ...c }); setIsEdit(true); setShowForm(true); }

  function save() {
    if (!editData.name.trim()) return;
    const data = { ...editData, price: Number(editData.price) || 0 };
    if (isEdit) {
      setCustomers(cs => cs.map(c => c.id === data.id ? data : c));
      setSelected(data);
    } else {
      const newC = { ...data, id: nextId.current++ };
      setCustomers(cs => [...cs, newC]);
      setSelected(newC);
    }
    setShowForm(false);
  }

  function del(id) {
    setCustomers(cs => cs.filter(c => c.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleteId(null);
  }

  return (
    <div style={{ fontFamily: "'Hiragino Kaku Gothic ProN','Meiryo',sans-serif", background: "#F5F5F5", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "#FF0211", padding: "0 20px", height: "54px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 10px rgba(255,2,17,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "#fff", borderRadius: "7px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#FF0211", fontSize: "13px" }}>M</div>
          <span style={{ color: "#fff", fontWeight: "700", fontSize: "16px" }}>顧客名簿</span>
        </div>
        <button onClick={openAdd} style={{ background: "#fff", color: "#FF0211", border: "none", borderRadius: "20px", padding: "7px 16px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
          ＋ 追加
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "14px 16px", background: "#fff", borderBottom: "1px solid #EBEBEB" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍　名前・住所・商品で検索"
          style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #E8E8E8", borderRadius: "24px", padding: "10px 16px", fontSize: "14px", outline: "none", background: "#F7F7F7" }} />
      </div>
      <div style={{ padding: "8px 16px", fontSize: "12px", color: "#aaa" }}>{filtered.length}件</div>

      {/* List */}
      <div style={{ padding: "0 12px 80px" }}>
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
            style={{ background: "#fff", borderRadius: "14px", marginBottom: "10px", padding: "16px", cursor: "pointer", boxShadow: selected?.id === c.id ? "0 0 0 2px #FF0211" : "0 1px 4px rgba(0,0,0,0.07)", transition: "all 0.15s" }}>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "700", fontSize: "16px", color: "#111", marginBottom: "4px" }}>{c.name}</div>
              <div style={{ fontSize: "12px", color: "#999", marginBottom: "10px" }}>📍 {c.address || "住所未登録"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ background: "#FFF3F3", color: "#FF0211", borderRadius: "6px", padding: "3px 10px", fontSize: "13px", fontWeight: "600" }}>{c.product}</span>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>¥{Number(c.price).toLocaleString()}</span>
              </div>
            </div>

            {c.comment ? (
              <div style={{ marginTop: "10px", background: "#FAFAFA", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#666", lineHeight: "1.5", borderLeft: "3px solid #FFD0D0" }}>
                💬 {c.comment}
              </div>
            ) : null}

            {selected?.id === c.id && (
              <div style={{ borderTop: "1px solid #F0F0F0", marginTop: "12px", paddingTop: "12px", display: "flex", gap: "8px" }}>
                <button onClick={e => { e.stopPropagation(); openEdit(c); }} style={{ flex: 1, background: "#FF0211", color: "#fff", border: "none", borderRadius: "10px", padding: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>✏️ 編集</button>
                <button onClick={e => { e.stopPropagation(); setDeleteId(c.id); }} style={{ flex: 1, background: "#F5F5F5", color: "#888", border: "none", borderRadius: "10px", padding: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>🗑 削除</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ width: "40px", height: "4px", background: "#E0E0E0", borderRadius: "2px", margin: "0 auto 20px" }} />
            <div style={{ fontWeight: "700", fontSize: "18px", color: "#111", marginBottom: "22px" }}>
              {isEdit ? "情報を編集" : "新規顧客登録"}
            </div>

            <FormField label="氏名 *">
              <input value={editData.name} onChange={set("name")} placeholder="田中 花子" style={inputStyle} />
            </FormField>
            <FormField label="住所">
              <input value={editData.address} onChange={set("address")} placeholder="東京都渋谷区代々木1-2-3" style={inputStyle} />
            </FormField>
            <FormField label="お買い上げ商品 *">
              <input value={editData.product} onChange={set("product")} placeholder="ワイヤレスイヤホン" style={inputStyle} />
            </FormField>
            <FormField label="価格（円）">
              <input type="number" value={editData.price} onChange={set("price")} placeholder="3800" style={inputStyle} />
            </FormField>
            <FormField label="評価コメント">
              <textarea
                value={editData.comment}
                onChange={set("comment")}
                placeholder="取引の感想やメモを入力..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
              />
            </FormField>

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: "#F0F0F0", color: "#666", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>キャンセル</button>
              <button onClick={save} style={{ flex: 2, background: "#FF0211", color: "#fff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>{isEdit ? "保存" : "登録"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", maxWidth: "300px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🗑</div>
            <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "6px" }}>削除しますか？</div>
            <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "22px" }}>この操作は元に戻せません</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, background: "#F0F0F0", color: "#666", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>キャンセル</button>
              <button onClick={() => del(deleteId)} style={{ flex: 1, background: "#FF0211", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>削除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
