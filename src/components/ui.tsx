import type { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`border-[3px] border-foreground bg-surface p-6 brutal-shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-bold uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
      {error && <p className="text-xs font-bold text-accent">{error}</p>}
    </div>
  );
}

const fieldClass =
  "w-full border-[3px] border-foreground bg-surface px-3 py-2 text-sm font-medium outline-none transition focus:border-primary focus:ring-0";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={`text-sm font-bold uppercase tracking-wide ${props.className ?? ""}`} />;
}

const variantClass: Record<string, string> = {
  primary: "bg-primary text-foreground border-foreground brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
  accent: "bg-accent text-white border-foreground brutal-shadow-accent hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
  secondary: "bg-foreground text-background border-foreground brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
  outline: "border-[3px] border-foreground bg-transparent text-foreground brutal-shadow-sm hover:bg-surface-alt hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
  ghost: "border-[3px] border-transparent bg-transparent text-foreground hover:bg-surface-alt",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variantClass }) {
  return (
    <button
      {...props}
      className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border-[3px] px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]} ${className}`}
    />
  );
}

export function Badge({
  children,
  color = "var(--foreground)",
  variant = "filled",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  variant?: "filled" | "outline";
  className?: string;
}) {
  if (variant === "outline") {
    return (
      <span className={`inline-flex items-center border-[3px] border-foreground bg-surface px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${className}`}>
        {children}
      </span>
    );
  }

  const isLight = color === "var(--primary)" || color === "#4ADE80" || color === "#4ade80";
  return (
    <span
      className={`inline-flex items-center border-[3px] border-foreground px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${isLight ? "text-foreground" : "text-white"} ${className}`}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}

export function FormNotice({ kind, message }: { kind: "error" | "success"; message: string }) {
  const isError = kind === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`border-[3px] px-4 py-3 text-sm font-bold ${
        isError
          ? "border-accent bg-accent/10 text-accent"
          : "border-primary bg-primary/10 text-foreground"
      }`}
    >
      {message}
    </div>
  );
}

export function PageHeader({
  badge,
  title,
  description,
  children,
}: {
  badge?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b-[3px] border-foreground bg-surface-alt">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {badge && (
          <Badge color="var(--accent)" className="mb-4">
            {badge}
          </Badge>
        )}
        <h1 className="font-display text-4xl font-normal leading-none sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-text-secondary">{description}</p>}
        {children}
      </div>
    </div>
  );
}
