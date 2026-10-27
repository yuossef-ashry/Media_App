import { useState } from 'react';
const filters = ['All', 'Unread', 'Likes', 'Comments', 'Follows'];
export function NotificationsPage() {
    const [filter, setFilter] = useState('All');
    const showComment = filter === 'All' || filter === 'Unread' || filter === 'Comments';
    return (<div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-slate-900 sm:text-2xl">Notifications</h1>
                <p className="mt-1 text-sm text-slate-500">Realtime updates for likes, comments, shares, and follows.</p>
              </div>
              <button type="button" disabled className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-500 opacity-60 sm:w-auto">
                <i className="fa-solid fa-check-double"/>Mark all as read
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
              {filters.map((name) => (<button key={name} type="button" onClick={() => setFilter(name)} className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${filter === name ? 'bg-[#1877f2] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {name}
                </button>))}
            </div>
          </div>
          <div className="space-y-3 p-4 sm:p-5">
            {showComment ? (<article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50">
                <div className="flex items-start gap-3">
                  <img alt="Adham Osama" className="h-11 w-11 rounded-full object-cover" src="https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"/>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700"><strong className="font-bold text-slate-900">Adham Osama</strong> commented on your post.</p>
                    <p className="mt-1 text-xs text-slate-400">Recently</p>
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">Top Comment</p>
                      <div className="flex items-start gap-2">
                        <img alt="Adham Osama" className="h-8 w-8 rounded-full object-cover" src="https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"/>
                        <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2">
                          <p className="truncate text-xs font-bold text-slate-900">Adham Osama</p>
                          <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700">gm12</p>
                        </div>
                      </div>
                      <button type="button" className="mt-2 text-xs font-bold text-[#1877f2] hover:underline">View all comments</button>
                    </div>
                  </div>
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1877f2]" aria-label="Unread"/>
                </div>
              </article>) : (<div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600"><i className="fa-regular fa-bell text-lg"/></span>
                <h2 className="mt-3 font-bold text-slate-800">No {filter.toLowerCase()} notifications</h2>
                <p className="mt-1 text-sm text-slate-500">New notifications will show up here.</p>
              </div>)}
          </div>
        </section>
      </main>
    </div>);
}
