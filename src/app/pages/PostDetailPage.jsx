import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsApi } from '../../services/api';
import { PostCard } from '../components/PostCard';
export function PostDetailPage() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    async function load() {
        try {
            setError('');
            setPost(await postsApi.one(id));
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Post could not be loaded.');
        }
    }
    useEffect(() => { if (id)
        void load(); }, [id]);
    return <div className="mx-auto max-w-3xl space-y-4 px-3 py-8 sm:py-12">
    <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"><i className="fa-solid fa-arrow-left"/>Back</button>
    {error && <p className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600">{error}</p>}
    {post ? <PostCard post={post} initialCommentsOpen onRefresh={() => void load()}/> : !error ? <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Loading post…</p> : null}
  </div>;
}
