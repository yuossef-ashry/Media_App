import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../services/api';
import { useAuth } from '../state/AuthContext';
const fallbackAvatar = 'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';
const formatDate = (value) => value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
export function PostCard({ post, onRefresh, initialCommentsOpen = false }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(initialCommentsOpen);
    const [comments, setComments] = useState([]);
    const [commentsPage, setCommentsPage] = useState(1);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(post.body || '');
    const [shareOpen, setShareOpen] = useState(false);
    const [shareText, setShareText] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const author = post.user;
    const ownPost = Boolean(user?._id && author?._id === user._id);
    const liked = Boolean(user?._id && post.likes?.includes(user._id));
    async function fetchAllComments() {
        const allComments = [];
        const commentIds = new Set();
        let page = 1;
        while (true) {
            const nextBatch = await postsApi.comments(post._id, page, 10);
            const newComments = nextBatch.filter((comment) => !commentIds.has(comment._id));
            if (!newComments.length)
                break;
            newComments.forEach((comment) => commentIds.add(comment._id));
            allComments.push(...newComments);
            if (nextBatch.length < 10)
                break;
            page += 1;
        }
        return allComments;
    }
    useEffect(() => {
        if (!commentsOpen)
            return;
        let active = true;
        setCommentsLoading(true);
        (initialCommentsOpen ? fetchAllComments() : postsApi.comments(post._id, 1, 10))
            .then((items) => {
            if (!active)
                return;
            setComments(items);
            setCommentsPage(1);
            setHasMoreComments(!initialCommentsOpen && items.length === 10);
        })
            .catch(() => { if (active)
            setError('Comments could not be loaded.'); })
            .finally(() => { if (active)
            setCommentsLoading(false); });
        return () => { active = false; };
    }, [commentsOpen, post._id]);
    const doAction = async (action) => {
        setError('');
        try {
            await action();
            onRefresh();
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Action failed.');
        }
    };
    async function addComment(event) {
        event.preventDefault();
        if (!commentText.trim())
            return;
        const body = new FormData();
        body.append('content', commentText.trim());
        try {
            await postsApi.addComment(post._id, body);
            setCommentText('');
            const newComments = initialCommentsOpen
                ? await fetchAllComments()
                : await postsApi.comments(post._id, 1, 10);
            setComments(newComments);
            setCommentsPage(1);
            setHasMoreComments(!initialCommentsOpen && newComments.length === 10);
            onRefresh();
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Comment could not be posted.');
        }
    }
    async function loadMoreComments() {
        if (commentsLoading || !hasMoreComments)
            return;
        setCommentsLoading(true);
        try {
            const nextPage = commentsPage + 1;
            const nextComments = await postsApi.comments(post._id, nextPage, 10);
            setComments((current) => [...current, ...nextComments]);
            setCommentsPage(nextPage);
            setHasMoreComments(nextComments.length === 10);
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'More comments could not be loaded.');
        }
        finally {
            setCommentsLoading(false);
        }
    }
    async function saveCommentEdit(event) {
        event.preventDefault();
        if (!editingCommentId || !editingCommentText.trim())
            return;
        const body = new FormData();
        body.append('content', editingCommentText.trim());
        try {
            await postsApi.updateComment(post._id, editingCommentId, body);
            setComments((current) => current.map((comment) => comment._id === editingCommentId ? { ...comment, content: editingCommentText.trim() } : comment));
            setEditingCommentId(null);
            setEditingCommentText('');
            onRefresh();
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Comment could not be updated.');
        }
    }
    async function saveEdit(event) {
        event.preventDefault();
        const body = new FormData();
        body.append('body', editText);
        body.append('privacy', post.privacy || 'public');
        await doAction(async () => { await postsApi.update(post._id, body); setEditing(false); });
    }
    async function share(event) {
        event.preventDefault();
        const body = new FormData();
        body.append('body', shareText);
        await doAction(async () => { await postsApi.share(post._id, body); setShareOpen(false); setShareText(''); });
    }
    return (<article className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author?._id || ''}`} className="shrink-0"><img alt={author?.name || 'User'} className="h-11 w-11 rounded-full object-cover" src={author?.photo || fallbackAvatar}/></Link>
          <div className="min-w-0 flex-1">
            <Link to={`/profile/${author?._id || ''}`} className="truncate text-sm font-bold text-slate-900 hover:underline">{author?.name || 'Route Posts member'}</Link>
            <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500"><span>@{author?.username || author?.name || 'member'}</span><span>·</span><span>{formatDate(post.createdAt)}</span><span>·</span><span><i className="fa-solid fa-earth-americas mr-1"/>{post.privacy || 'public'}</span></div>
          </div>
          <div className="relative">
            <button type="button" aria-label="Post actions" onClick={() => setMenuOpen((value) => !value)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"><i className="fa-solid fa-ellipsis"/></button>
            {menuOpen && <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl">
              <button type="button" onClick={() => { setMenuOpen(false); void doAction(() => postsApi.bookmark(post._id)); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"><i className="fa-regular fa-bookmark"/>{post.bookmarked ? 'Remove saved post' : 'Save post'}</button>
              {ownPost && <><button type="button" onClick={() => { setEditText(post.body || ''); setEditing(true); setMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"><i className="fa-regular fa-pen-to-square"/>Edit post</button><button type="button" onClick={() => { setMenuOpen(false); if (window.confirm('Delete this post?'))
            void doAction(() => postsApi.remove(post._id)); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"><i className="fa-regular fa-trash-can"/>Delete post</button></>}
            </div>}
          </div>
        </div>
        {post.body && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{post.body}</p>}
        {post.image && <img src={post.image} alt="Post" className="mt-3 max-h-[600px] w-full rounded-lg object-cover"/>}
        {post.sharedPost && <div className="mt-3 rounded-xl border border-slate-200 p-3"><p className="text-sm font-bold">{post.sharedPost.user?.name}</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{post.sharedPost.body}</p>{post.sharedPost.image && <img src={post.sharedPost.image} alt="Shared post" className="mt-2 max-h-96 w-full rounded-lg object-cover"/>}</div>}
        <div className="mt-3 flex items-center justify-between border-b border-slate-100 py-2 text-xs text-slate-500"><span><i className="fa-solid fa-thumbs-up mr-1 text-blue-600"/>{post.likesCount ?? post.likes?.length ?? 0}</span><Link to={`/Post-Details/${post._id}`} className="hover:underline">{post.commentsCount ?? 0} comments · {post.sharesCount ?? 0} shares</Link></div>
        <div className="grid grid-cols-3 gap-1 pt-2">
          <button type="button" onClick={() => void doAction(() => postsApi.like(post._id))} className={`rounded-lg py-2 text-sm font-semibold transition hover:bg-slate-100 ${liked ? 'text-blue-600' : 'text-slate-600'}`}><i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up mr-2`}/>Like</button>
          <button type="button" onClick={() => setCommentsOpen((value) => !value)} className="rounded-lg py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"><i className="fa-regular fa-comment mr-2"/>Comment</button>
          <button type="button" onClick={() => setShareOpen(true)} className="rounded-lg py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"><i className="fa-solid fa-share mr-2"/>Share</button>
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
        {commentsOpen && <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
          {commentsLoading && !comments.length && <p className="text-sm text-slate-500">Loading comments…</p>}
          {comments.map((comment) => <div key={comment._id} className="flex items-start gap-2">
            <img src={comment.commentCreator?.photo || fallbackAvatar} alt="" className="h-8 w-8 rounded-full object-cover"/>
            <div className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-3 py-2">
              <div className="flex items-center justify-between gap-2"><p className="truncate text-xs font-bold text-slate-900">{comment.commentCreator?.name}</p>
                {comment.commentCreator?._id === user?._id && <div className="flex gap-2">
                  <button type="button" aria-label="Edit comment" onClick={() => { setEditingCommentId(comment._id); setEditingCommentText(comment.content); }} className="text-xs text-slate-500 hover:text-blue-600"><i className="fa-regular fa-pen-to-square"/></button>
                  <button type="button" aria-label="Delete comment" onClick={() => void doAction(async () => { await postsApi.deleteComment(post._id, comment._id); setComments((current) => current.filter((item) => item._id !== comment._id)); })} className="text-xs text-slate-400 hover:text-red-600"><i className="fa-regular fa-trash-can"/></button>
                </div>}
              </div>
              {editingCommentId === comment._id ? <form onSubmit={saveCommentEdit} className="mt-2 space-y-2"><textarea autoFocus value={editingCommentText} onChange={(event) => setEditingCommentText(event.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-blue-500"/><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingCommentId(null)} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white">Cancel</button><button className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700">Save</button></div></form> : <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700">{comment.content}</p>}
              <p className="mt-1 text-[11px] text-slate-400">{formatDate(comment.createdAt)}</p>
            </div>
            <button type="button" aria-label="Like comment" onClick={() => void doAction(() => postsApi.likeComment(post._id, comment._id))} className="pt-2 text-xs text-slate-500 hover:text-blue-600"><i className="fa-regular fa-thumbs-up"/></button>
          </div>)}
          {!comments.length && !commentsLoading && <p className="text-sm text-slate-500">No comments yet.</p>}
          {hasMoreComments && <button type="button" onClick={() => void loadMoreComments()} disabled={commentsLoading} className="w-full rounded-lg py-2 text-sm font-bold text-[#1877f2] hover:bg-blue-50 disabled:opacity-60">{commentsLoading ? 'Loading more comments…' : 'Load more comments'}</button>}
          <form onSubmit={addComment} className="flex gap-2"><input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-blue-500"/><button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Send</button></form>
        </div>}
      </div>
      {editing && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"><form onSubmit={saveEdit} className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl"><h3 className="text-lg font-extrabold">Edit post</h3><textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={5} className="mt-4 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"/><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setEditing(false)} className="rounded-lg border px-4 py-2 text-sm font-bold">Cancel</button><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Save changes</button></div></form></div>}
      {shareOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"><form onSubmit={share} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"><h3 className="text-lg font-extrabold">Share post</h3><textarea value={shareText} onChange={(e) => setShareText(e.target.value)} rows={3} placeholder="Say something about this..." className="mt-4 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"/><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setShareOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-bold">Cancel</button><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Share now</button></div></form></div>}
    </article>);
}
