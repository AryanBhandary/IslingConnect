import { useEffect, useState } from "react";
import { MdOutlineSearch, MdRefresh } from "react-icons/md";
import { LuPackage, LuUser, LuMail, LuPhone, LuMapPin, LuTag, LuCalendar, LuTrash2 } from "react-icons/lu";
import api from "../../../../constants/axios";

interface Item {
  _id: string;
  itemName: string;
  type: string;
  category: string;
  location: string;
  date: string;
  status: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  user: { username: string; email: string; phone: string };
  reclaimer?: { username: string; email: string; phone: string };
}

const STATUS_FILTERS = ["all", "active", "pending", "returned"] as const;

const statusBadge: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  returned: "bg-purple-50 text-purple-700",
};

export default function LostFoundRecords() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "returned">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/lost-found/admin/items`);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch Lost & Found records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (item: Item) => {
    const ok = window.confirm(
      `Remove this listing from Lost & Found? This cannot be undone.\n\n"${item.itemName}"`
    );
    if (!ok) return;
    setDeletingId(item._id);
    try {
      await api.delete(`/api/lost-found/admin/items/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      console.error("Failed to delete item", err);
      window.alert("Could not delete this item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      item.itemName.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.user?.username.toLowerCase().includes(term) ||
      item.user?.phone?.includes(term) ||
      item.reclaimer?.username.toLowerCase().includes(term) ||
      item.reclaimer?.phone?.includes(term);
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 my-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="font-bold text-lg sm:text-xl">Lost & Found Records</h1>
        <div className="flex gap-2 items-center">
          <div className="p-2 flex gap-3 items-center w-full sm:w-72 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] shadow-sm">
            <MdOutlineSearch size={22} color="#666" className="shrink-0" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>
          <button
            onClick={fetchItems}
            className="p-2.5 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] hover:shadow-md transition-all active:scale-95 shrink-0"
            title="Refresh"
          >
            <MdRefresh size={22} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              statusFilter === s
                ? "bg-[var(--lf)] text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--lf)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-300 bg-white rounded-3xl border border-dashed border-gray-200">
          <LuPackage size={64} className="mb-3 opacity-30" />
          <p className="text-sm font-medium text-gray-400">No items found</p>
        </div>
      ) : (
        <div className="border border-[var(--gray-border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-[var(--gray-bg)] sticky top-0">
              <tr>
                <th className="p-3 font-semibold text-gray-600">Item</th>
                <th className="p-3 font-semibold text-gray-600">Details</th>
                <th className="p-3 font-semibold text-gray-600">Reported By</th>
                <th className="p-3 font-semibold text-gray-600">Reclaimer</th>
                <th className="p-3 font-semibold text-gray-600">Date</th>
                <th className="p-3 font-semibold text-gray-600">Status</th>
                <th className="p-3 font-semibold text-gray-600 w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} className="border-b border-[var(--gray-border)] hover:bg-gray-50 transition-colors">
                  {/* Item */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <LuPackage size={18} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{item.itemName}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.type === "found" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>
                  {/* Details */}
                  <td className="p-3">
                    <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5"><LuTag size={12} className="text-[var(--lf)]" /> {item.category}</div>
                      <div className="flex items-center gap-1.5"><LuMapPin size={12} className="text-[var(--lf)]" /> {item.location}</div>
                    </div>
                  </td>
                  {/* Reporter */}
                  <td className="p-3">
                    <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5"><LuUser size={12} className="text-[var(--lf)]" /><span className="font-semibold text-gray-700">{item.user?.username}</span></div>
                      <div className="flex items-center gap-1.5"><LuMail size={12} className="text-[var(--lf)]" /> {item.user?.email}</div>
                      <div className="flex items-center gap-1.5"><LuPhone size={12} className="text-[var(--lf)]" /> {item.user?.phone}</div>
                    </div>
                  </td>
                  {/* Reclaimer */}
                  <td className="p-3">
                    {item.reclaimer ? (
                      <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5"><LuUser size={12} className="text-green-600" /><span className="font-semibold text-gray-700">{item.reclaimer.username}</span></div>
                        <div className="flex items-center gap-1.5"><LuMail size={12} className="text-green-600" /> {item.reclaimer.email}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300 italic">—</span>
                    )}
                  </td>
                  {/* Date */}
                  <td className="p-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <LuCalendar size={12} />
                      {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </td>
                  {/* Status */}
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[item.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item._id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                      title="Remove invalid or mistaken listing"
                    >
                      <LuTrash2 size={14} />
                      {deletingId === item._id ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
