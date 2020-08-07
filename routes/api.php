<?php
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('user', 'Api\UserController@index');
Route::get('user/{id}', 'Api\UserController@get');
Route::patch('user/{id}', 'Api\UserController@update');
Route::delete('user/{id}', 'Api\UserController@destroy');

Route::get('logout', 'Api\UserController@logout');
Route::post('register', 'Api\UserController@register')->withoutMiddleware(\App\Http\Middleware\AuthToken::class);
Route::post('login', 'Api\UserController@login')->withoutMiddleware(\App\Http\Middleware\AuthToken::class);

