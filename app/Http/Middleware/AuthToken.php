<?php

namespace App\Http\Middleware;

use App\User;
use Closure;

class AuthToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $tokenChecked = $request->header('TOKEN');
        $userByToken = User::where([
            ['api_token', '=', hash('sha256', $tokenChecked)],
            ['api_token_expired', '>', new \DateTime()],
        ])->first();
        $tokenExisted = $userByToken->api_token ?? '';

        if (empty($tokenExisted)) {
            app()->instance('userLogged', false);
            return response()->json(['no_valid_token' => 1], 401);
        }

        app()->instance('userLogged', $userByToken);
        return $next($request);
    }
}
