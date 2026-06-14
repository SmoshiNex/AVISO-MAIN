<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public channel for the admin live map.
// No auth required — any connected client (admin browser) can listen.
Broadcast::channel('riders.live', function () {
    return true;
});
