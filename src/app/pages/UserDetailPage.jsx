import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from '../../services/api';
const avatarFallback = 'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';
export function UserDetailPage() {
    const { id = '' } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        setProfile(null);
        setError('');
        userApi.detail(id).then((response) => setProfile(response.data.user)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Profile could not be loaded.'));
    }, [id]);
    return <div className="mx-auto max-w-5xl px-3 py-5 sm:py-8">
    {error && <div className="rounded-xl border border-red-200 bg-white p-5 text-red-600">{error}</div>}
    {!profile && !error && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading profile…</div>}
    {profile && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-[28px]">
      <div className="relative h-44 bg-cover bg-center sm:h-64" style={{ background: profile.cover ? `url(${profile.cover}) center / cover no-repeat` : 'linear-gradient(112deg, #0f172a 0%, #1e3a5f 36%, #2b5178 72%, #5f8fb8 100%)' }}><div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"/></div>
      <div className="relative -mt-12 px-4 pb-6 sm:-mt-16 sm:px-8"><div className="rounded-3xl border border-white/60 bg-white/95 p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="flex items-end gap-4"><img src={profile.photo || avatarFallback} alt={profile.name} className="h-24 w-24 rounded-full border-4 border-white object-cover shadow ring-2 ring-blue-100 sm:h-28 sm:w-28"/><div className="pb-1"><h1 className="text-2xl font-black text-slate-900 sm:text-4xl">{profile.name}</h1><p className="mt-1 text-lg font-semibold text-slate-500">{profile.username}</p><span className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]"><i className="fa-solid fa-users"/>Route Posts member</span></div></div><div className="grid grid-cols-3 gap-2 md:w-[390px]">{[['Followers', profile.followersCount ?? profile.followers?.length ?? 0], ['Following', profile.followingCount ?? profile.following?.length ?? 0], ['Bookmarks', profile.bookmarksCount ?? 0]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-200 px-3 py-3 text-center"><p className="text-[11px] font-bold uppercase text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-900">{value}</p></div>)}</div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><h2 className="text-sm font-extrabold text-slate-800">About</h2><p className="mt-3 break-all text-sm text-slate-600"><i className="fa-regular fa-envelope mr-2"/>{profile.email || 'Email not available'}</p><p className="mt-2 text-sm text-slate-600"><i className="fa-solid fa-users mr-2"/>Active on Route Posts</p></div><div className="rounded-2xl border border-blue-100 bg-blue-50 p-4"><h2 className="text-sm font-extrabold text-slate-800">Member since</h2><p className="mt-2 text-sm text-slate-600">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Route Posts member'}</p></div></div></div></div>
    </section>}
  </div>;
}
