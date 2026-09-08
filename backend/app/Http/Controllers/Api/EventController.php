<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function index(): JsonResponse
    {
        $events = Event::orderBy('start_date')->get();
        return response()->json($events);
    }

    public function upcoming(): JsonResponse
    {
        $events = Event::where('end_date', '>=', now())
            ->orderBy('start_date')
            ->get();
        return response()->json($events);
    }

    public function show(Event $event): JsonResponse
    {
        return response()->json($event);
    }
}
