<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop the old hardcoded status
            $table->dropColumn('status');
            $table->dropColumn('assigned_by'); // Drop the text version

            // Add the new dynamic column link
            $table->foreignId('column_id')->after('board_id')->constrained()->onDelete('cascade');

            // Add real user links
            $table->foreignId('assigned_to_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('assigned_by_id')->nullable()->constrained('users')->onDelete('set null');
        });;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('status')->default('todo');
            $table->string('assigned_by')->nullable();
            $table->dropForeign(['column_id']);
            $table->dropColumn('column_id');
            $table->dropForeign(['assigned_to_id']);
            $table->dropColumn('assigned_to_id');
            $table->dropForeign(['assigned_by_id']);
            $table->dropColumn('assigned_by_id');
        });
    }
};
