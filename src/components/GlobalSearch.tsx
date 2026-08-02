import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, Calculator } from "lucide-react";
import { tools } from "@/lib/tools";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(normalized) ||
        t.desc.toLowerCase().includes(normalized) ||
        t.keywords.some((k) => k.toLowerCase().includes(normalized))
    );
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!open) {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const result = results[activeIndex];
      if (result) {
        setOpen(false);
        setQuery("");
        navigate({ to: result.to });
      }
    }
  }

  return (
    <div className="relative hidden sm:block" ref={containerRef}>
      <div
        className="flex w-64 items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-within:ring-2 focus-within:ring-ring/30"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <Search className="h-4 w-4 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          aria-label="Search tools"
          aria-expanded={open}
          aria-controls="search-results"
        />
        <span className="hidden rounded border px-1.5 py-0.5 text-[10px] font-medium lg:block">Ctrl K</span>
      </div>

      {open && (
        <div
          id="search-results"
          className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-elegant)]"
          style={{ background: "var(--gradient-card)" }}
          role="listbox"
        >
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-auto p-2">
              {results.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <li key={tool.to} role="option" aria-selected={index === activeIndex}>
                    <Link
                      to={tool.to}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        index === activeIndex
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tool.title}</span>
                          <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${index === activeIndex ? "bg-primary-foreground/20" : "bg-secondary text-muted-foreground"}`}>
                            {tool.category}
                          </span>
                        </div>
                        <div className={`text-xs ${index === activeIndex ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {tool.desc}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : query.trim() ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
                <Calculator className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No tools found for "{query}"</p>
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-muted-foreground">
              Start typing to find calculators and converters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MobileSearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(normalized) ||
        t.desc.toLowerCase().includes(normalized) ||
        t.keywords.some((k) => k.toLowerCase().includes(normalized))
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 place-items-center rounded-full border bg-background text-muted-foreground transition hover:text-foreground sm:hidden"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm px-4 pt-24 sm:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-elegant)]"
            style={{ background: "var(--gradient-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                onClick={() => setOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-muted-foreground"
                aria-label="Close search"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="max-h-72 overflow-auto p-2">
              {results.length > 0 ? (
                results.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-accent"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tool.title}</span>
                          <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {tool.category}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{tool.desc}</div>
                      </div>
                    </Link>
                  );
                })
              ) : query.trim() ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No tools found for "{query}"
                </div>
              ) : (
                <div className="px-4 py-4 text-xs text-muted-foreground">Start typing to find tools.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

