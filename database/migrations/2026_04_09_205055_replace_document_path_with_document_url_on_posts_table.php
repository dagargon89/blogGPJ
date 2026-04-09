<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->text('document_url')->nullable()->after('youtube_video_id');
        });

        $rows = DB::table('posts')->whereNotNull('document_path')->get(['id', 'document_path']);

        foreach ($rows as $row) {
            $url = Storage::disk('firebase')->url($row->document_path);
            DB::table('posts')->where('id', $row->id)->update(['document_url' => $url]);
        }

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('document_path');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('document_path')->nullable()->after('youtube_video_id');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('document_url');
        });
    }
};
