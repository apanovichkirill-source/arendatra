"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_GROUP_LABELS } from "@/lib/format";

export type CategoryPickerGroup = {
  group: string;
  categories: { slug: string; name: string }[];
};

export function CategoryPicker({ groups }: { groups: CategoryPickerGroup[] }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ group?: string; category?: string; label: string }>({
    label: "Любая техника",
  });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function selectGroup(group: string, label: string) {
    setSelected({ group, label });
    setOpen(false);
  }

  function selectCategory(group: string, slug: string, label: string) {
    setSelected({ group, category: slug, label });
    setOpen(false);
  }

  function reset() {
    setSelected({ label: "Любая техника" });
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name="group" value={selected.category ? "" : selected.group ?? ""} />
      <input type="hidden" name="category" value={selected.category ?? ""} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2.5 text-left text-sm text-gray-900"
      >
        <span className="truncate">{selected.label}</span>
        <svg
          viewBox="0 0 20 20"
          className={`ml-2 h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.25 7.5l4.75 5 4.75-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 max-h-80 w-full min-w-[280px] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={reset}
            className="block w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-brand-blue-light"
          >
            Любая техника
          </button>
          {groups.map((g) => (
            <div key={g.group} className="border-t border-gray-100">
              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => selectGroup(g.group, CATEGORY_GROUP_LABELS[g.group] ?? g.group)}
                  className="flex-1 px-3 py-2 text-left text-sm font-semibold text-brand-navy hover:bg-brand-blue-light"
                >
                  {CATEGORY_GROUP_LABELS[g.group] ?? g.group}
                </button>
                <button
                  type="button"
                  aria-label="Показать типы техники"
                  onClick={() => setOpenGroup(openGroup === g.group ? null : g.group)}
                  className="px-3 text-gray-400 hover:bg-brand-blue-light hover:text-brand-blue"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      openGroup === g.group ? "rotate-180" : ""
                    }`}
                    fill="none"
                    aria-hidden
                  >
                    <path d="M5.25 7.5l4.75 5 4.75-5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
              {openGroup === g.group && (
                <div className="pb-1">
                  {g.categories.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => selectCategory(g.group, c.slug, c.name)}
                      className="block w-full py-1.5 pl-7 pr-3 text-left text-sm text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
