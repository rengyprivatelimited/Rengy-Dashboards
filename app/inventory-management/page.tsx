"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Box,
  Boxes,
  CalendarDays,
  ChevronDown,
  MoreVertical,
  PackageCheck,
  PackageOpen,
  PencilLine,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryCategories,
  getInventoryItemDetail,
  getInventoryItems,
  updateInventoryItem,
  type InventoryCategory,
  type InventoryItem,
} from "@/features/admin/api/inventory";

type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function CategorySelect({ value, onChange, options }: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [localOptions, setLocalOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (options.length) {
      setLocalOptions(options);
    }
  }, [options]);

  useEffect(() => {
    function handleClose(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setShowAddNew(false);
      }
    }
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        className="flex h-9 w-full items-center justify-between rounded-md border border-[#d6dbe6] bg-[#f6f7fa] px-2.5 text-left text-[12px] text-[#232b3d]"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span>{value}</span>
        <ChevronDown className={`h-4 w-4 text-[#5e687a] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-10 z-30 w-full overflow-hidden rounded-[10px] border border-[#d9dce4] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            className="flex w-full items-center justify-between border-b border-[#eceff4] px-3 py-2 text-[12px] text-[#2b3344]"
            onClick={() => setOpen(false)}
          >
            <span>Select</span>
            <ChevronDown className="h-4 w-4 rotate-180" />
          </button>
          {localOptions.map((option) => (
            <button
              key={option}
              type="button"
              className="w-full border-b border-[#eceff4] px-3 py-2 text-left text-[12px] text-[#2b3344] hover:bg-[#f8f9fc]"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between bg-[#131844] px-3 text-[12px] font-medium text-white"
            onClick={() => setShowAddNew(true)}
          >
            <span>Add New</span>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {showAddNew ? (
        <div className="absolute left-0 top-[168px] z-40 w-full overflow-hidden rounded-[9px] border border-[#d9dce4] bg-white shadow-[0_10px_20px_rgba(15,23,42,0.14)]">
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="Type category name"
            className="h-10 w-full border-b border-[#e5e8ef] px-3 text-[12px] outline-none"
          />
          <div className="grid grid-cols-2">
            <button
              type="button"
              className="h-10 border-r border-[#e5e8ef] text-[12px] font-semibold text-[#222944]"
              onClick={() => {
                setShowAddNew(false);
                setNewCategory("");
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-10 bg-[#131844] text-[12px] font-semibold text-white"
              onClick={() => {
                if (!newCategory.trim()) return;
                const next = newCategory.trim();
                setLocalOptions((prev) => (prev.includes(next) ? prev : [...prev, next]));
                onChange(next);
                setNewCategory("");
                setShowAddNew(false);
                setOpen(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type InventoryFormDrawerProps = {
  mode: "edit" | "create";
  row: InventoryItem | null;
  onClose: () => void;
  onSave: (payload: {
    itemName: string;
    categoryId?: number;
    brand?: string;
    count?: string;
    specification?: string;
    price?: string;
  }) => void;
  categoryOptions: string[];
  categories: InventoryCategory[];
  isSaving: boolean;
};

function InventoryFormDrawer({ mode, row, onClose, onSave, categoryOptions, categories, isSaving }: InventoryFormDrawerProps) {
  const [categoryValue, setCategoryValue] = useState(row?.category ?? "Select");
  const [itemName, setItemName] = useState(row?.itemName ?? "");
  const [brand, setBrand] = useState(row?.brand ?? "");
  const [specification, setSpecification] = useState(row?.specification ?? "");
  const [price, setPrice] = useState(row?.currentPrice ?? "");
  const [count, setCount] = useState(row?.count ?? "");

  useEffect(() => {
    setCategoryValue(row?.category ?? "Select");
    setItemName(row?.itemName ?? "");
    setBrand(row?.brand ?? "");
    setSpecification(row?.specification ?? "");
    setPrice(row?.currentPrice ?? "");
    setCount(row?.count ?? "");
  }, [row]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <aside className="flex h-full w-full max-w-[548px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
        <div className="flex items-center justify-between border-b border-[#e4e7ee] px-4 py-4">
          <div className="text-[32px] font-medium leading-none text-[#1b2230]">
            {mode === "edit" ? row?.itemName ?? "Update Price" : "Add new Item"}
          </div>
          <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 py-4 text-[12px] text-[#182033]">
          <div>
            <label className="mb-1 block font-semibold">Item name*</label>
            <input
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
              className="h-9 w-full rounded-md border border-[#d6dbe6] bg-white px-2.5"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold">Category*</label>
            <CategorySelect value={categoryValue} onChange={setCategoryValue} options={categoryOptions} />
          </div>
          <div>
            <label className="mb-1 block font-semibold">Brand*</label>
            <input value={brand} onChange={(event) => setBrand(event.target.value)} className="h-9 w-full rounded-md border border-[#d6dbe6] bg-white px-2.5" />
          </div>
          <div>
            <label className="mb-1 block font-semibold">Any Specification</label>
            <input value={specification} onChange={(event) => setSpecification(event.target.value)} className="h-9 w-full rounded-md border border-[#d6dbe6] bg-white px-2.5" />
          </div>
          <div>
            <label className="mb-1 block font-semibold">Current Price</label>
            <input value={price} onChange={(event) => setPrice(event.target.value)} className="h-9 w-full rounded-md border border-[#d6dbe6] bg-white px-2.5 font-semibold" />
          </div>
          <div>
            <label className="mb-1 block font-semibold">New Price*</label>
            <input value={price} onChange={(event) => setPrice(event.target.value)} className="h-9 w-full rounded-md border border-[#d6dbe6] bg-white px-2.5 font-semibold" />
          </div>
          <div>
            <label className="mb-1 block font-semibold">Effective From</label>
            <button className="flex h-9 w-full items-center justify-between rounded-md border border-[#d6dbe6] bg-[#f6f7fa] px-2.5 text-[#2a3244]">
              Select Date
              <CalendarDays className="h-4 w-4 text-[#586174]" />
            </button>
          </div>
          <div>
            <label className="mb-1 block font-semibold">Item Count*</label>
            <input value={count} onChange={(event) => setCount(event.target.value)} className="h-9 w-full rounded-md border border-[#d6dbe6] bg-white px-2.5" />
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4">
          <button className="h-9 rounded border border-[#1d2340] bg-white text-[13px] font-semibold text-[#1d2340]" onClick={onClose}>
            Cancel
          </button>
          <button
            className="h-9 rounded bg-[#11163f] text-[13px] font-semibold text-white"
            onClick={() => {
              const categoryId = categories.find((category) => category.name === categoryValue)?.id;
              onSave({
                itemName: itemName.trim(),
                categoryId,
                brand: brand.trim(),
                count: count.trim(),
                specification: specification.trim(),
                price: price.trim(),
              });
            }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </aside>
    </div>
  );
}

type InventoryDetailDrawerProps = {
  row: InventoryItem;
  onClose: () => void;
  onEdit: () => void;
};

function InventoryDetailDrawer({ row, onClose, onEdit }: InventoryDetailDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <aside className="flex h-full w-full max-w-[440px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
        <div className="border-b border-[#e4e7ee] px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[30px] font-medium leading-none text-[#1b2230]">{row.itemName}</div>
              <div className="mt-1 text-[11px] text-[#6d7485]">{row.itemCode}</div>
            </div>
            <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-4 py-4 text-[12px] text-[#1e2638]">
          <div className="flex gap-2">
            <Box className="mt-0.5 h-4 w-4 text-[#1f4b7d]" />
            <div>
              <div className="text-[#5d6679]">Item Name</div>
              <div className="mt-0.5 font-semibold">{row.itemName}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Tag className="mt-0.5 h-4 w-4 text-[#1f4b7d]" />
            <div>
              <div className="text-[#5d6679]">Category</div>
              <div className="mt-0.5 font-semibold">{row.category}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <PackageOpen className="mt-0.5 h-4 w-4 text-[#1f4b7d]" />
            <div>
              <div className="text-[#5d6679]">Brand</div>
              <div className="mt-0.5 font-semibold uppercase">{row.brand}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Boxes className="mt-0.5 h-4 w-4 text-[#1f4b7d]" />
            <div>
              <div className="text-[#5d6679]">Any Specification</div>
              <div className="mt-0.5 font-semibold">{row.specification || "-"}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Box className="mt-0.5 h-4 w-4 text-[#1f4b7d]" />
            <div>
              <div className="text-[#5d6679]">Price</div>
              <div className="mt-0.5 font-semibold">{row.currentPrice}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <PackageCheck className="mt-0.5 h-4 w-4 text-[#1f4b7d]" />
            <div>
              <div className="text-[#5d6679]">No. Of Counts</div>
              <div className="mt-0.5 font-semibold">{row.count}</div>
            </div>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4">
          <button className="h-9 rounded border border-[#1d2340] bg-white text-[13px] font-semibold text-[#1d2340]" onClick={onClose}>
            Cancel
          </button>
          <button className="h-9 rounded bg-[#11163f] text-[13px] font-semibold text-white" onClick={onEdit}>
            Edit
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function InventoryManagementPage() {
  const [rowsData, setRowsData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<InventoryItem | null>(null);
  const [editRow, setEditRow] = useState<InventoryItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchText.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    let isActive = true;

    const loadInventory = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const results = await Promise.allSettled([
          getInventoryItems({
            search: debouncedSearch,
            categoryId: selectedCategoryId === "" ? "" : selectedCategoryId,
            page,
            perPage,
          }),
          getInventoryCategories(),
        ]);
        const [itemsResult, categoriesResult] = results;
        if (!isActive) return;
        if (itemsResult.status === "fulfilled") {
          setRowsData(itemsResult.value.rows);
          setTotalPages(itemsResult.value.pagination.totalPages);
        } else {
          setRowsData([]);
          setLoadError("Inventory API failed. Please try again.");
        }
        if (categoriesResult.status === "fulfilled") {
          setCategories(categoriesResult.value);
          setCategoryOptions(categoriesResult.value.map((category) => category.name));
        } else if (!loadError) {
          setLoadError("Category API failed. Please try again.");
        }
      } catch (error) {
        setLoadError("Failed to load inventory data. Please try again.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadInventory();

    return () => {
      isActive = false;
    };
  }, [debouncedSearch, selectedCategoryId, page, perPage, refreshKey]);

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Inventory Management" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[54px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[21px] font-semibold text-[#202736]">Admin</div>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-[220px] items-center gap-2 rounded border border-[#d8dee8] bg-white px-2.5 text-[12px] text-[#8f97a6] md:flex">
                <Search className="h-4 w-4" />
                Search
              </div>
              <Bell className="h-4 w-4 text-[#4a5160]" />
              <div className="flex items-center gap-1">
                <div className="h-7 w-7 rounded-full bg-[#d89d77]" />
                <span className="text-[13px] text-[#4c5564]">Rajesh B</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" />
              </div>
            </div>
          </header>

          <section className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <div>
                <h1 className="text-[32px] font-semibold leading-none text-[#1d2028]">Inventory Management</h1>
                <p className="mt-1 text-[12px] text-[#727c8e]">You can see all items here</p>
              </div>
              <button
                className="inline-flex h-10 items-center gap-2 rounded bg-[#181d52] px-4 text-[14px] font-semibold text-white"
                onClick={() => setShowCreate(true)}
              >
                Create New
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex h-11 w-[300px] items-center gap-2 rounded-md border border-[#d8dde5] bg-white px-3 text-[14px] text-[#9aa2b1]">
                <Search className="h-4 w-4" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-[14px] text-[#1f2533] outline-none placeholder:text-[#9aa2b1]"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedCategoryId}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSelectedCategoryId(value ? Number(value) : "");
                      setPage(1);
                    }}
                    className="inline-flex h-11 items-center gap-1 rounded-md border border-[#d8dde5] bg-white px-4 text-[13px] text-[#8892a1]"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[#8892a1]" />
                </div>
                <button className="inline-flex h-11 items-center gap-1 rounded-md border border-[#d8dde5] bg-white px-4 text-[13px] text-[#8892a1]">
                  Customise
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-auto rounded-xl border border-[#dce1e8] bg-white">
              {loadError ? (
                <div className="border-b border-[#f5d0d0] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#b91c1c]">
                  {loadError}
                </div>
              ) : null}
              <table className="w-full min-w-[1700px] text-left text-[13px]">
                <thead>
                  <tr className="h-14 bg-[#d4dfdd] text-[#283245]">
                    <th className="px-3">
                      <input type="checkbox" className="h-5 w-5 rounded border-[#b7c1d0]" />
                    </th>
                    <th className="px-3">Item Code</th>
                    <th className="px-3 text-[#8f97a8]">⇵</th>
                    <th className="px-3">Item Name</th>
                    <th className="px-3">Item Category</th>
                    <th className="px-3">Brand</th>
                    <th className="px-3">Item Count</th>
                    <th className="px-3">Any specification</th>
                    <th className="px-3">last Updated</th>
                    <th className="px-3">Current Price</th>
                    <th className="px-3" />
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, idx) => (
                        <tr key={`inventory-skel-${idx}`} className="h-[74px] border-t border-[#e6eaf1] odd:bg-[#f8f9fb]">
                          {Array.from({ length: 11 }).map((__, colIdx) => (
                            <td key={`inventory-skel-${idx}-${colIdx}`} className="px-3">
                              <div className="h-3 w-full max-w-[140px] rounded bg-[#e3e7ee]" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : rowsData.map((row) => (
                        <tr
                          key={row.id}
                          className="h-[74px] cursor-pointer border-t border-[#e6eaf1] odd:bg-[#f8f9fb]"
                          onClick={() => {
                            setSelectedRow(row);
                            setOpenMenuId(null);
                            setIsDetailLoading(true);
                            getInventoryItemDetail(row.id)
                              .then((detail) => setSelectedRow(detail))
                              .catch(() => setLoadError("Failed to load item details. Please try again."))
                              .finally(() => setIsDetailLoading(false));
                          }}
                        >
                          <td className="px-3">
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-[#b7c1d0]"
                              onClick={(event) => event.stopPropagation()}
                            />
                          </td>
                          <td className="px-3 font-medium">{row.itemCode}</td>
                          <td className="px-3" />
                          <td className="px-3">{row.itemName}</td>
                          <td className="px-3">{row.category}</td>
                          <td className="px-3">{row.brand}</td>
                          <td className="px-3">{row.count}</td>
                          <td className="whitespace-pre-line px-3">{row.specification}</td>
                          <td className="px-3 font-semibold">{row.updated}</td>
                          <td className="px-3 font-semibold">{row.currentPrice}</td>
                          <td className="relative px-3">
                            <div ref={openMenuId === row.id ? menuRef : null} className="relative">
                              <button
                                className="rounded-full p-1.5 text-[#262d39] hover:bg-[#eef1f6]"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setOpenMenuId((prev) => (prev === row.id ? null : row.id));
                                }}
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>
                              {openMenuId === row.id ? (
                                <div className="absolute right-0 top-9 z-20 w-[118px] overflow-hidden rounded-2xl border border-[#dadde4] bg-white shadow-[0_14px_22px_rgba(15,23,42,0.14)]">
                                  <button
                                    className="flex h-11 w-full items-center gap-2 border-b border-[#ebedf2] px-3 text-[12px] text-[#6f7684]"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setEditRow(row);
                                      setSelectedRow(null);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    <PencilLine className="h-5 w-5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    className="flex h-11 w-full items-center gap-2 px-3 text-[12px] text-[#ff3b3b]"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      deleteInventoryItem(row.id)
                                        .then(() => {
                                          setRowsData((prev) => prev.filter((item) => item.id !== row.id));
                                          setRefreshKey((prev) => prev + 1);
                                        })
                                        .catch(() => {
                                          setLoadError("Failed to delete inventory item.");
                                        })
                                        .finally(() => setOpenMenuId(null));
                                    }}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between border-t border-[#e6eaf1] px-4 py-3 text-[13px]">
                <div className="flex items-center gap-4">
                  <span>Page {page} of {totalPages}</span>
                  <select
                    value={perPage}
                    onChange={(event) => {
                      setPerPage(Number(event.target.value));
                      setPage(1);
                    }}
                    className="inline-flex h-10 items-center rounded border border-[#d1d5db] bg-white px-3 text-[13px] text-[#6b7280]"
                  >
                    {[10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        Show {size} rows
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-10 rounded border border-[#d1d5db] px-4 text-[13px] disabled:cursor-not-allowed disabled:text-[#9aa2b1]"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </button>
                  <button className="h-10 min-w-[32px] rounded bg-[#0f1136] px-2 text-[13px] text-white">{page}</button>
                  <button
                    className="h-10 rounded border border-[#d1d5db] px-4 text-[13px] disabled:cursor-not-allowed disabled:text-[#9aa2b1]"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {selectedRow ? (
        <InventoryDetailDrawer
          row={{
            ...selectedRow,
            itemName: isDetailLoading ? "Loading..." : selectedRow.itemName,
            specification: isDetailLoading ? "-" : selectedRow.specification,
            currentPrice: isDetailLoading ? "-" : selectedRow.currentPrice,
            count: isDetailLoading ? "-" : selectedRow.count,
          }}
          onClose={() => setSelectedRow(null)}
          onEdit={async () => {
            if (!selectedRow) return;
            try {
              const detail = await getInventoryItemDetail(selectedRow.id);
              setEditRow(detail);
              setSelectedRow(null);
            } catch (error) {
              setLoadError("Failed to load item details. Please try again.");
            }
          }}
        />
      ) : null}

      {editRow ? (
        <InventoryFormDrawer
          mode="edit"
          row={editRow}
          onClose={() => setEditRow(null)}
          onSave={async (payload) => {
            if (!editRow) return;
            setIsSaving(true);
            try {
              await updateInventoryItem(editRow.id, payload);
              setEditRow(null);
              setPage(1);
              setRefreshKey((prev) => prev + 1);
            } catch (error) {
              setLoadError("Failed to update inventory item.");
            } finally {
              setIsSaving(false);
            }
          }}
          categoryOptions={categoryOptions}
          categories={categories}
          isSaving={isSaving}
        />
      ) : null}
      {showCreate ? (
        <InventoryFormDrawer
          mode="create"
          row={null}
          onClose={() => setShowCreate(false)}
          onSave={async (payload) => {
            setIsSaving(true);
            try {
              await createInventoryItem(payload);
              setShowCreate(false);
              setPage(1);
              setRefreshKey((prev) => prev + 1);
            } catch (error) {
              setLoadError("Failed to create inventory item.");
            } finally {
              setIsSaving(false);
            }
          }}
          categoryOptions={categoryOptions}
          categories={categories}
          isSaving={isSaving}
        />
      ) : null}
    </div>
  );
}

