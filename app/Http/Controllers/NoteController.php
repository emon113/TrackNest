<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Notebook;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $notebooks = auth()->user()->notebooks()->withCount('notes')->orderBy('name')->get();
        $tags = auth()->user()->tags()->withCount('notes')->orderBy('name')->get();
        $search = $request->input('search');

        // --- 1. NEW, SIMPLER SEARCH LOGIC (NO SCOUT) ---
        $notesQuery = Note::query()
            ->where('user_id', auth()->id())
            ->with(['notebook', 'tags']);

        // If there is a search, apply it
        if ($search) {
            $notesQuery->where(function ($query) use ($search) {
                // Search the title
                $query->where('title', 'LIKE', '%'.$search.'%')
                      // Also search the content
                      ->orWhere('content', 'LIKE', '%'.$search.'%');
            });
        }
        // --- END NEW LOGIC ---

        if ($request->has('notebook')) {
            $notesQuery->where('notebook_id', $request->input('notebook'));
        }

        if ($request->has('tag')) {
            $notesQuery->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->input('tag'));
            });
        }

        $notes = $notesQuery->orderBy('is_pinned', 'desc')
                           ->orderBy('updated_at', 'desc')
                           ->get();

        return Inertia::render('Notes/Index', [
            'notes' => $notes,
            'notebooks' => $notebooks,
            'tags' => $tags,
            'currentNotebook' => $request->input('notebook'),
            'currentTag' => $request->input('tag'),
            'currentSearch' => $search,
            'flash' => session('success') ? ['success' => session('success')] : [],
        ]);
    }

    // --- All other methods (create, store, etc.) remain unchanged ---
    // --- and will work perfectly. ---

    public function create()
    {
        return Inertia::render('Notes/Create', [
            'notebooks' => auth()->user()->notebooks()->orderBy('name')->get(),
            'allTags' => auth()->user()->tags()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_pinned' => 'sometimes|boolean',
            'notebook_id' => ['nullable', 'string', Rule::exists('notebooks', 'id')->where('user_id', auth()->id())],
            'tags' => 'nullable|array'
        ]);

        $noteData = $request->only('title', 'content');
        $noteData['is_pinned'] = $request->input('is_pinned', false);
        $noteData['notebook_id'] = $request->input('notebook_id') ?: null;

        $note = $request->user()->notes()->create($noteData);

        if ($request->has('tags')) {
            $tagIds = $this->processTags($request->input('tags'));
            $note->tags()->sync($tagIds);
        }

        return Redirect::route('notes.index')->with('success', 'Note created successfully!');
    }

    public function show(Note $note)
    {
        if ($note->user_id !== auth()->id()) { abort(403); }
        $note->load('tags');
        return Inertia::render('Notes/Show', ['note' => $note]);
    }

    public function edit(Note $note)
    {
        if ($note->user_id !== auth()->id()) { abort(403); }
        $note->load('tags');
        return Inertia::render('Notes/Edit', [
            'note' => $note,
            'notebooks' => auth()->user()->notebooks()->orderBy('name')->get(),
            'allTags' => auth()->user()->tags()->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Note $note)
    {
        if ($note->user_id !== auth()->id()) { abort(403); }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_pinned' => 'sometimes|boolean',
            'notebook_id' => ['nullable', 'string', Rule::exists('notebooks', 'id')->where('user_id', auth()->id())],
            'tags' => 'nullable|array'
        ]);

        $noteData = $request->only('title', 'content');
        $noteData['is_pinned'] = $request->input('is_pinned', false);
        $noteData['notebook_id'] = $request->input('notebook_id') ?: null;

        $note->update($noteData);

        $tagIds = [];
        if ($request->has('tags')) {
            $tagIds = $this->processTags($request->input('tags'));
        }
        $note->tags()->sync($tagIds);

        return Redirect::route('notes.index')->with('success', 'Note updated successfully!');
    }

    public function destroy(Note $note)
    {
        if ($note->user_id !== auth()->id()) { abort(403); }
        $note->delete();
        return Redirect::route('notes.index')->with('success', 'Note deleted successfully!');
    }

    public function togglePin(Note $note)
    {
        if ($note->user_id !== auth()->id()) { abort(403); }
        $note->update(['is_pinned' => !$note->is_pinned]);
        $message = $note->is_pinned ? 'Note pinned!' : 'Note unpinned.';
        return Redirect::back()->with('success', $message);
    }

    private function processTags(array $tags): array
    {
        $tagIds = [];
        $user = auth()->user();
        foreach ($tags as $tag) {
            if (isset($tag['value']) && !is_numeric($tag['value'])) {
                $newTag = $user->tags()->firstOrCreate(['name' => $tag['label']]);
                $tagIds[] = $newTag->id;
            } else if (isset($tag['value']) && is_numeric($tag['value'])) {
                $tagIds[] = $tag['value'];
            }
        }
        return $tagIds;
    }
}
