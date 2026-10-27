export function LoadingOverlay({ visible }) {
    if (!visible)
        return null;
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 backdrop-blur-[2px]" aria-live="polite" aria-label="Loading">
      <div className="rounded-2xl bg-white p-5 shadow-xl">
        <div className="loading-spinner h-10 w-10 rounded-full border-4 border-blue-100 border-t-blue-600"/>
      </div>
    </div>);
}
