<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    UserController,
    NotificationController,
    NewsPostController,
    NewsCategoryController,
    SavedNewsController,
    NewsReportController
};
use App\Models\Payment;

// Public Routes

Route::post('sign-in', [UserController::class, 'signIn']);
Route::post('sign-up', [UserController::class, 'signUp']);


// Public News Routes
Route::prefix('news')->group(function () {
    Route::get('/categories', [NewsCategoryController::class, 'index']);
    Route::get('/posts', [NewsPostController::class, 'index']);
    Route::get('/posts/{slug}', [NewsPostController::class, 'show']);
});

// Authenticated News Routes
Route::middleware(['auth:sanctum'])->group(function () {
    // User notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    
    // Saved News
    Route::get('/saved-news', [SavedNewsController::class, 'index']);
    Route::post('/saved-news', [SavedNewsController::class, 'store']);
    Route::delete('/saved-news/{postId}', [SavedNewsController::class, 'destroy']);
    Route::post('/saved-news/toggle', [SavedNewsController::class, 'toggle']);
    Route::get('/saved-news/check/{postId}', [SavedNewsController::class, 'checkSaved']);
    
    // News Reports
    Route::post('/news/reports', [NewsReportController::class, 'store']);
    
    // Share counter
    Route::post('/news/posts/{id}/share', [NewsPostController::class, 'share']);
});

// Admin News Routes
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Check admin role (should be done in middleware, but for now...)
    
    // User Management
    Route::get('/users', [UserController::class, 'searchUsers']);
    Route::get('/users/statistics', [UserController::class, 'getUserStatistics']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    // Notification Management
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::get('/notifications/all', [NotificationController::class, 'getAllNotifications']);
    Route::get('/notifications/sent', [NotificationController::class, 'getSentNotifications']);
    
    // News Categories
    Route::get('/news/categories', [NewsCategoryController::class, 'adminIndex']);
    Route::post('/news/categories', [NewsCategoryController::class, 'store']);
    Route::post('/news/categories/{id}', [NewsCategoryController::class, 'update']);
    Route::delete('/news/categories/{id}', [NewsCategoryController::class, 'destroy']);
    
    // News Posts
    Route::get('/news/posts', [NewsPostController::class, 'adminIndex']);
    Route::get('/news/posts/{id}', [NewsPostController::class, 'adminShow']);
    Route::post('/news/posts', [NewsPostController::class, 'store']);
    Route::post('/news/posts/{id}', [NewsPostController::class, 'update']);
    Route::put('/news/posts/{id}', [NewsPostController::class, 'update']);
    Route::delete('/news/posts/{id}', [NewsPostController::class, 'destroy']);
    
    // News Reports
    Route::get('/news/reports', [NewsReportController::class, 'index']);
    Route::get('/news/posts/{postId}/reports', [NewsReportController::class, 'getPostReports']);
    Route::put('/news/reports/{id}/status', [NewsReportController::class, 'updateStatus']);
    Route::delete('/news/reports/{id}', [NewsReportController::class, 'destroy']);
});