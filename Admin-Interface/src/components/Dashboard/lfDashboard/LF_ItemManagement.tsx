import { useEffect, useState } from "react";
import { MdOutlineSearch, MdRefresh } from "react-icons/md";
import { LuPackage, LuMapPin, LuCalendar, LuTag, LuUser, LuPhone, LuMail, LuBadgeCheck, LuClock } from "react-icons/lu";
import api from "../../../constants/axios";

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
    user: {
        username: string;
        email: string;
        phone: string;
    };
    reclaimer?: {
        username: string;
        email: string;
        phone: string;
    };
}

export default function LF_ItemManagement() {
    const [items, setItems] = useState<Item[]>([]);
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "returned">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/lost-found/admin/items?status=${statusFilter}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setItems(res.data);
        } catch (err) {
            console.error("Failed to fetch items", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [statusFilter]);

    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-10 my-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-bold text-xl">Item Management</h1>
                <div className="flex gap-2 items-center">
                    <div className="p-2 flex gap-4 items-center w-80 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] shadow-sm">
                        <MdOutlineSearch size={24} color="#666" />
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
                        className="p-3 bg-[var(--gray-bg)] text-black rounded-xl border border-[var(--gray-border)] hover:shadow-md transition-all active:scale-95"
                        title="Refresh"
                    >
                        <MdRefresh size={24} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 mb-6">
                {(["all", "active", "pending", "returned"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${statusFilter === status
                            ? "bg-[var(--primary)] text-white shadow-lg translate-y-[-2px]"
                            : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">
                    <LuPackage size={80} className="mb-4 opacity-10" />
                    <p className="font-medium text-lg text-gray-400">No items found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            {/* Row 1: Item Info (App Listing Style) */}
                            <div className="flex p-5 gap-4 border-b border-gray-50">
                                <div className="relative">
                                    <img
                                        src={item.imageUrl || "https://via.placeholder.com/150"}
                                        className="w-28 h-28 rounded-2xl object-cover"
                                        alt=""
                                    />
                                    <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-[9px] font-bold ${item.type === 'found' ? 'bg-[#BAFFB9] text-[#217C00]' : 'bg-[#FFC2C2] text-[#FF0000]'
                                        }`}>
                                        {item.type.toUpperCase()}
                                    </div>
                                    {item.status === 'pending' && (
                                        <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-[#FFF8E1] text-[#F57F17] text-[9px] font-bold">
                                            PENDING
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg truncate pr-2">{item.itemName}</h3>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <LuCalendar size={16} color="#000" />
                                            <span className="text-xs font-semibold">
                                                {new Date(item.date).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 mt-1">
                                        <div className="flex items-center gap-2">
                                            <LuMapPin size={16} color="#000" className="shrink-0" />
                                            <span className="text-xs text-black font-semibold truncate">{item.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LuTag size={16} color="#000" className="shrink-0" />
                                            <span className="text-xs text-black font-semibold">{item.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Uploader Information */}
                            <div className="px-6 py-4 border-b border-gray-50 bg-[#FBFBFF]">
                                <p className="text-[10px] font-bold text-[#A0A0A0] tracking-widest uppercase mb-3">Uploader Information</p>
                                <div className="flex flex-wrap gap-y-2">
                                    <div className="flex items-center gap-2 w-1/2 min-w-[140px]">
                                        <LuUser size={14} className="text-[var(--primary)]" />
                                        <span className="text-xs font-bold text-black">{item.user?.username}</span>
                                    </div>
                                    <div className="flex items-center gap-2 w-1/2 min-w-[140px]">
                                        <LuPhone size={14} className="text-[var(--primary)]" />
                                        <span className="text-xs font-semibold text-gray-700">{item.user?.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 w-full mt-1">
                                        <LuMail size={14} className="text-[var(--primary)]" />
                                        <span className="text-xs text-gray-500 font-medium">{item.user?.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Reclaimer Information */}
                            <div className={`px-6 py-4 border-b border-gray-50 ${item.reclaimer ? 'bg-[#F1F8E9]' : 'bg-gray-50'}`}>
                                <p className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${item.reclaimer ? 'text-[#217C00]' : 'text-gray-400'}`}>
                                    Reclaimer Information
                                </p>
                                {item.reclaimer ? (
                                    <div className="flex flex-wrap gap-y-2">
                                        <div className="flex items-center gap-2 w-1/2 min-w-[140px]">
                                            <LuUser size={14} className="text-[#217C00]" />
                                            <span className="text-xs font-bold text-black">{item.reclaimer.username}</span>
                                        </div>
                                        <div className="flex items-center gap-2 w-1/2 min-w-[140px]">
                                            <LuPhone size={14} className="text-[#217C00]" />
                                            <span className="text-xs font-semibold text-gray-700">{item.reclaimer.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 w-full mt-1">
                                            <LuMail size={14} className="text-[#217C00]" />
                                            <span className="text-xs text-gray-500 font-medium">{item.reclaimer.email}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-300 italic py-2">
                                        <LuClock size={14} />
                                        <span className="text-xs">No reclaimer yet - Item is {item.status}</span>
                                    </div>
                                )}
                            </div>

                            {/* Row 4: Handover Time and Date */}
                            <div className="px-6 py-3 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <LuClock size={14} className="text-gray-400" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                        Handover Status
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.status === 'returned' ? (
                                        <>
                                            <LuBadgeCheck size={16} className="text-[#217C00]" />
                                            <p className="text-[10px] font-bold text-[#217C00]">
                                                {new Date(item.updatedAt).toLocaleString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </>
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{item.status}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
