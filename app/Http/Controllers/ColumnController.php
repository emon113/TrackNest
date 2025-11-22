<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ColumnController extends Controller
{
    public function store(Request $request, Board $board)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $maxOrder = $board->columns()->max('order');

        $board->columns()->create([
            'name' => $request->name,
            'order' => $maxOrder + 1,
        ]);

        return Redirect::back()->with('success', 'Column added.');
    }

    public function update(Request $request, Column $column)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $column->update(['name' => $request->name]);
        return Redirect::back()->with('success', 'Column updated.');
    }

    public function destroy(Column $column)
    {
        $column->delete();
        return Redirect::back()->with('success', 'Column deleted.');
    }
}
