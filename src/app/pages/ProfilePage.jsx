import { useEffect, useState } from 'react';
import { postsApi, userApi } from '../../services/api';
import { PostCard } from '../components/PostCard';
import { useAuth } from '../state/AuthContext';
const avatarFallback = 'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';
export function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [profile, setProfile] = useState(user);
    const [userPosts, setUserPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [tab, setTab] = useState('userPosts');
    const [upload, setUpload] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [viewer, setViewer] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [error, setError] = useState('');
    async function loadProfile() {
        try {
            const response = await userApi.profile();
            setProfile(response.data.user);
        }
        catch {
            setProfile(user);
        }
    }
    async function loadPosts() {
        try {
            const [mine, saved] = await Promise.all([postsApi.mine(), postsApi.saved()]);
            setUserPosts(mine);
            setSavedPosts(saved);
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Profile posts could not be loaded.');
        }
    }
    useEffect(() => { void loadProfile(); void loadPosts(); }, []);
    function chooseImage(kind, next) {
        if (!next)
            return;
        if (preview)
            URL.revokeObjectURL(preview);
        setFile(next);
        setUpload(kind);
        setPreview(URL.createObjectURL(next));
        setError('');
    }
    async function saveImage(event) {
        event.preventDefault();
        if (!upload || !file)
            return;
        const form = new FormData();
        form.append(upload === 'avatar' ? 'photo' : 'cover', file);
        form.append('privacy', privacy);
        try {
            if (upload === 'avatar')
                await userApi.uploadPhoto(form);
            else
                await userApi.uploadCover(form);
            setUpload(null);
            setPreview('');
            setFile(null);
            await Promise.all([loadProfile(), loadPosts(), refreshUser()]);
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Image could not be uploaded.');
        }
    }
    async function removeCover() {
        try {
            await userApi.deleteCover();
            await loadProfile();
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Cover could not be removed.');
        }
    }
    const selectedPosts = tab === 'userPosts' ? userPosts : savedPosts;
    const cardClass = 'rounded-2xl border border-slate-200 bg-white shadow-sm';
    return <div className="mx-auto max-w-7xl space-y-5 px-3 py-3.5 sm:space-y-6">
    <section className={`${cardClass} overflow-hidden sm:rounded-[28px]`}>
      <div className="group/cover relative h-44 bg-cover bg-center bg-no-repeat sm:h-52 lg:h-60" style={{ background: profile?.cover ? `url(${profile.cover}) center / cover no-repeat` : 'linear-gradient(112deg, #0f172a 0%, #1e3a5f 36%, #2b5178 72%, #5f8fb8 100%)' }}>
        <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent"/>
        <div className="absolute right-2 top-2 z-10 flex flex-wrap justify-end gap-2 sm:opacity-0 sm:transition sm:group-hover/cover:opacity-100">
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur hover:bg-black/60"><i className="fa-solid fa-camera"/>Add cover<input type="file" accept="image/*" className="hidden" onChange={(e) => chooseImage('cover', e.target.files?.[0])}/></label>
          {profile?.cover && <><button type="button" onClick={() => setViewer(profile.cover || '')} className="rounded-lg bg-black/45 px-3 py-1.5 text-xs font-bold text-white hover:bg-black/60"><i className="fa-solid fa-expand mr-1"/>View cover</button><button type="button" onClick={() => void removeCover()} className="rounded-lg bg-black/45 px-3 py-1.5 text-xs font-bold text-white hover:bg-black/60"><i className="fa-regular fa-trash-can mr-1"/>Remove</button></>}
        </div>
      </div>
      <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
        <div className="rounded-3xl border border-white/60 bg-white/95 p-5 backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0"><div className="flex items-end gap-4"><div className="group/avatar relative shrink-0"><button type="button" onClick={() => profile?.photo && setViewer(profile.photo)} className="cursor-zoom-in rounded-full"><img src={profile?.photo || avatarFallback} alt={profile?.name || 'Profile'} className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe] sm:h-28 sm:w-28"/></button><label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100"><i className="fa-solid fa-camera"/><input type="file" accept="image/*" className="hidden" onChange={(e) => chooseImage('avatar', e.target.files?.[0])}/></label></div><div className="min-w-0 pb-1"><h1 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">{profile?.name || 'Your profile'}</h1><p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">{profile?.username || ''}</p><span className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]"><i className="fa-solid fa-users"/>Route Posts member</span></div></div></div>
            <div className="grid w-full grid-cols-3 gap-2 lg:w-[390px]">{[['Followers', profile?.followersCount ?? profile?.followers?.length ?? 0], ['Following', profile?.followingCount ?? profile?.following?.length ?? 0], ['Bookmarks', profile?.bookmarksCount ?? 0]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">{label}</p><p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{value}</p></div>)}</div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><h2 className="text-sm font-extrabold text-slate-800">About</h2><div className="mt-3 space-y-2 text-sm text-slate-600"><p><i className="fa-regular fa-envelope mr-2 text-slate-500"/>{profile?.email || 'Email not available'}</p><p><i className="fa-solid fa-users mr-2 text-slate-500"/>Active on Route Posts</p></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">My posts</p><p className="mt-1 text-2xl font-black text-slate-900">{userPosts.length}</p></div><div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">Saved posts</p><p className="mt-1 text-2xl font-black text-slate-900">{savedPosts.length}</p></div></div></div>
        </div>
      </div>
    </section>
    <section className="space-y-4">
      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-2 p-3`}><div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto">{[{ key: 'userPosts', name: 'My Posts', icon: 'fa-regular fa-file-lines' }, { key: 'savedPosts', name: 'Saved', icon: 'fa-regular fa-bookmark' }].map((item) => <button key={item.key} type="button" onClick={() => setTab(item.key)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${tab === item.key ? 'bg-white text-[#1877f2] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><i className={item.icon}/>{item.name}</button>)}</div><span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">{selectedPosts.length}</span></div>
      {error && <p className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600">{error}</p>}
      {selectedPosts.length ? <div className="grid gap-4">{selectedPosts.map((post) => <PostCard key={post._id} post={post} onRefresh={() => void loadPosts()}/>)}</div> : <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">{tab === 'userPosts' ? 'You have not posted yet.' : 'You have not saved any posts yet.'}</p>}
    </section>

    {upload && preview && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4"><form onSubmit={saveImage} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5"><h2 className="text-lg font-extrabold text-slate-900">Adjust {upload === 'avatar' ? 'profile photo' : 'cover image'}</h2><p className="mb-4 text-sm text-slate-500">Preview your image before saving it.</p><img src={preview} alt="Image preview" className={`mx-auto max-h-80 w-full rounded-2xl bg-slate-100 object-cover ${upload === 'avatar' ? 'max-w-xs rounded-full' : ''}`}/><label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">Visibility<select value={privacy} onChange={(e) => setPrivacy(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"><option value="public">Public</option><option value="following">Followers</option><option value="only_me">Only me</option></select></label><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => { setUpload(null); setPreview(''); setFile(null); }} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button><button className="rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-bold text-white hover:bg-[#166fe5]">Save image</button></div></form></div>}
    {viewer && <button type="button" aria-label="Close image preview" onClick={() => setViewer('')} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4"><img src={viewer} alt="Full-size profile" className="max-h-[90vh] max-w-[90vw] object-contain"/><span className="absolute right-5 top-5 text-3xl text-white">×</span></button>}
  </div>;
}
