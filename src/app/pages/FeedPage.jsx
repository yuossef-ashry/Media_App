import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi, userApi } from '../../services/api';
import { FormError } from '../components/FormError';
import { PostCard } from '../components/PostCard';
import { useAuth } from '../state/AuthContext';
const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤩', '😊', '😉', '😭', '😡', '🤔', '😴', '🥳', '🤗', '😇', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🔥', '✨', '🎉', '💯', '👏', '🙌', '👍', '👎', '💪', '🙏', '💖', '💕', '💔', '🌹', '⭐', '🚀'];
const avatarFallback = 'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';
function Composer({ onCreated }) {
    const { user } = useAuth();
    const [body, setBody] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const textarea = useRef(null);
    function selectFile(nextFile) {
        if (!nextFile)
            return;
        setFile(nextFile);
        setPreview(URL.createObjectURL(nextFile));
    }
    async function publish(event) {
        event.preventDefault();
        setError('');
        if (!body.trim() && !file) {
            setError('Add text or an image to your post.');
            return;
        }
        const form = new FormData();
        if (body.trim())
            form.append('body', body.trim());
        if (file)
            form.append('image', file);
        form.append('privacy', privacy);
        setBusy(true);
        try {
            await postsApi.create(form);
            setBody('');
            setFile(null);
            setPreview('');
            setPrivacy('public');
            onCreated();
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Post could not be published.');
        }
        finally {
            setBusy(false);
        }
    }
    return (<div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_40px_-16px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5"><img src={user?.photo || avatarFallback} alt={user?.name || ''} className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md ring-2 ring-emerald-100"/><div className="min-w-0 flex-1"><h2 className="truncate text-base font-bold text-gray-900">{user?.name || 'Your profile'}</h2><p className="mt-1 text-sm text-gray-400">Ready to share something?</p></div><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400"><i className="fa-solid fa-ellipsis"/></span></div>
      <form onSubmit={publish} className="space-y-5 p-5 sm:p-6">
        <div><label htmlFor="privacy" className="mb-2 block text-sm font-semibold text-gray-700">Post audience</label><select id="privacy" value={privacy} onChange={(e) => setPrivacy(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"><option value="public">🌍 Public — Everyone</option><option value="followers">👥 Followers only</option><option value="private">🔒 Only me</option></select></div>
        <div><label htmlFor="content" className="mb-2 block text-sm font-semibold text-gray-700">What's on your mind{user?.name ? `, ${user.name}` : ''}?</label><textarea ref={textarea} id="content" value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={2000} placeholder="Write something beautiful..." className="w-full resize-y rounded-2xl border border-gray-200 bg-gray-50/70 px-5 py-4 text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"/></div>
        {preview && <div className="relative"><button type="button" onClick={() => { URL.revokeObjectURL(preview); setPreview(''); setFile(null); }} aria-label="Remove image" className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:text-red-500"><i className="fa-solid fa-xmark"/></button><img src={preview} alt="Post preview" className="max-h-60 w-full rounded-lg object-cover"/></div>}
        <div className="flex flex-wrap items-center justify-between gap-3"><label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white p-3 transition hover:border-emerald-300 hover:bg-emerald-50/30 sm:p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><i className="fa-regular fa-image"/></span><span><span className="block text-sm font-semibold text-gray-800">Add a photo</span><span className="mt-1 block text-xs text-gray-400">PNG, JPG or WEBP</span></span><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => selectFile(e.target.files?.[0])}/></label>
          <div className="relative"><button type="button" onClick={() => setEmojiOpen((v) => !v)} aria-expanded={emojiOpen} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-amber-50 hover:text-amber-600"><i className="fa-regular fa-face-smile text-lg"/>Emoji</button>{emojiOpen && <div className="absolute bottom-full right-0 z-50 mb-3 w-72 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl"><div className="mb-2 flex items-center justify-between"><strong className="text-sm text-gray-800">Choose an emoji</strong><button type="button" onClick={() => setEmojiOpen(false)} aria-label="Close emoji picker">×</button></div><div className="grid grid-cols-8 gap-1">{emojis.map((emoji) => <button type="button" key={emoji} onClick={() => { const input = textarea.current; const start = input?.selectionStart ?? body.length; const end = input?.selectionEnd ?? body.length; setBody((value) => value.slice(0, start) + emoji + value.slice(end)); setEmojiOpen(false); input?.focus(); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-xl hover:bg-emerald-50">{emoji}</button>)}</div></div>}</div>
        </div>
        <div className="flex justify-end border-t border-gray-100 pt-4"><button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-60 sm:w-auto"><i className="fa-solid fa-arrow-up"/>{busy ? 'Publishing…' : 'Publish post'}</button></div>
        {error && <FormError>{error}</FormError>}
      </form>
    </div>);
}
function SuggestedFriends() {
    const [friends, setFriends] = useState([]);
    const [query, setQuery] = useState('');
    useEffect(() => { userApi.suggestions().then(setFriends).catch(() => setFriends([])); }, []);
    const visibleFriends = friends.filter((friend) => `${friend.name} ${friend.username}`.toLowerCase().includes(query.toLowerCase()));
    return <aside className="hidden h-fit xl:sticky xl:top-24 xl:block"><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between gap-2"><div className="flex items-center gap-2"><i className="fa-solid fa-users text-[#1877f2]"/><h3 className="text-base font-extrabold text-slate-900">Suggested Friends</h3></div><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{friends.length}</span></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search friends..." className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#1877f2] focus:bg-white"/><div className="space-y-3">{visibleFriends.map((friend) => <div key={friend._id} className="rounded-xl border border-slate-200 p-2.5"><div className="flex items-center gap-2"><Link to={`/profile/${friend._id}`} className="flex min-w-0 flex-1 items-center gap-2"><img src={friend.photo || avatarFallback} alt={friend.name} className="h-10 w-10 rounded-full object-cover"/><span className="min-w-0"><span className="block truncate text-sm font-bold text-slate-900">{friend.name}</span><span className="block truncate text-xs text-slate-500">{friend.username}</span></span></Link><button type="button" className="rounded-full bg-[#e7f3ff] px-3 py-1.5 text-xs font-bold text-[#1877f2] hover:bg-[#d8ebff]"><i className="fa-solid fa-user-plus mr-1"/>Follow</button></div><div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500"><span className="rounded-full bg-slate-100 px-2 py-0.5">{friend.followersCount ?? 0} followers</span>{friend.mutualFollowersCount ? <span className="rounded-full bg-[#edf4ff] px-2 py-0.5 text-[#1877f2]">{friend.mutualFollowersCount} mutual</span> : null}</div></div>)}</div><button type="button" className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">View more</button></div></aside>;
}
export function FeedPage() {
    const [tab, setTab] = useState('feed');
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    async function loadPosts() {
        setError('');
        setLoading(true);
        try {
            const items = tab === 'feed' || tab === 'community'
                ? await postsApi.list()
                : tab === 'saved'
                    ? await postsApi.saved()
                    : await postsApi.mine();
            setPosts(items);
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Posts could not be loaded.');
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => { void loadPosts(); }, [tab]);
    const tabs = [
        { key: 'feed', name: 'Feed', icon: 'fa-regular fa-newspaper' },
        { key: 'myPosts', name: 'My Posts', icon: 'fa-solid fa-wand-magic-sparkles' },
        { key: 'community', name: 'Community', icon: 'fa-solid fa-earth-americas' },
        { key: 'saved', name: 'Saved', icon: 'fa-regular fa-bookmark' },
    ];
    return <div className="container mx-auto grid w-full min-w-0 grid-cols-1 gap-4 px-3 pt-4 sm:px-4 md:gap-5 lg:px-5 xl:grid-cols-[200px_minmax(0,2fr)_minmax(240px,1fr)] 2xl:grid-cols-[240px_minmax(0,2fr)_minmax(260px,1fr)]">
    <aside className="h-fit w-full min-w-0 xl:sticky xl:top-24"><div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm xl:flex xl:flex-col xl:gap-1">{tabs.map((item) => <button key={item.key} type="button" onClick={() => setTab(item.key)} className={`flex min-w-0 items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-bold transition sm:gap-3 ${tab === item.key ? 'bg-[#e7f3ff] text-[#1877f2]' : 'text-slate-700 hover:bg-slate-100'}`}><i className={`${item.icon} shrink-0`}/><span className="truncate">{item.name}</span></button>)}</div></aside>
    <main className="min-w-0 w-full"><section className="space-y-4"><Composer onCreated={() => void loadPosts()}/>{error && <div className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600">{error}</div>}{loading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading posts…</div> : posts.length ? <div className="grid gap-4">{posts.map((post) => <PostCard key={post._id} post={post} onRefresh={() => void loadPosts()}/>)}</div> : <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">{tab === 'saved' ? 'You have not saved any posts yet.' : 'No posts yet. Be the first one to publish.'}</div>}</section></main>
    <SuggestedFriends />
  </div>;
}
