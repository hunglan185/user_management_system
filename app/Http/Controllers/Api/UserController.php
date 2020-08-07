<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $userLogged = resolve('userLogged');

        $userResult = array();

        $users = User::all()->toArray();
        foreach ($users as $user) {
            $user['can_edit'] = false;
            $user['can_delete'] = false;

            if ($userLogged->type == 'admin') {
                $user['can_edit'] = true;
                $user['can_delete'] = true;
            } else if ($userLogged->id == $user['id']) {
                $user['can_edit'] = true;
            }
            $userResult[] = $user;
        }

        return response()->json($userResult, 200);
    }

    /**
     * Get the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Int  $id
     * @return \Illuminate\Http\Response
     */
    public function get($id)
    {
        $userLogged = resolve('userLogged');
        $user = User::where('id', $id)->first();

        if (empty($user)) {
            return response()->json(['message' => 'User is not found'], 404);
        } else {
            $data = array();
            if ($userLogged->type == 'admin') {
                $data['first_name'] = $user['first_name'];
                $data['last_name'] = $user['last_name'];
                $data['email'] = $user['email'];
                $data['type'] = $user['type'];

                return response()->json(['user_info' => $data, 'edit_type' => 'admin'], 200);
            } else if ($userLogged->id == $id) {
                $data['first_name'] = $user['first_name'];
                $data['last_name'] = $user['last_name'];
                $data['email'] = $user['email'];

                return response()->json(['user_info' => $data, 'edit_type' => 'normal'], 200);
            } else {
                return response()->json(['message' => 'Not allowed'], 401);
            }
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $userLogged = resolve('userLogged');

        $userUpdated = User::where('id', $id)->first();

        if (empty($userUpdated)) {
            return response()->json(['message' => 'User is not found'], 404);
        } else {
            if ($userLogged->type == 'admin') {
                $validator = Validator::make($request->all(), [
                    'first_name' => 'required|string|max:255',
                    'last_name' => 'required|string|max:255',
                    'email' => 'required|string|max:255|email|unique:users,email,'.$id,
                    'type' => 'required|in:admin,normal',
                ]);

                if ($validator->fails()) {
                    return response()->json($validator->errors(), 400);
                }

                $userUpdated->first_name = $request->first_name;
                $userUpdated->last_name = $request->last_name;
                $userUpdated->email = $request->email;
                $userUpdated->type = $request->type;

                $userUpdated->save();
                return response()->json(['data' => $userUpdated], 200);
            } else if ($userLogged->id == $id) {
                $validator = Validator::make($request->all(), [
                    'first_name' => 'required|string|max:255',
                    'last_name' => 'required|string|max:255',
                    'email' => 'required|string|max:255|email|unique:users,email,'.$id,
                ]);

                if ($validator->fails()) {
                    return response()->json($validator->errors(), 400);
                }

                $userUpdated->first_name = $request->first_name;
                $userUpdated->last_name = $request->last_name;
                $userUpdated->email = $request->email;

                $userUpdated->save();
                return response()->json(['data' => $userUpdated], 200);
            } else {
                return response()->json(['message' => 'Not allowed'], 401);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $userLogged = resolve('userLogged');
        if ($userLogged->type == 'admin') {
            User::where('id', $id)->first()->delete();
            return response()->json(['message' => 'Delete successfully'], 200);
        } else {
            return response()->json(['message' => 'Not allowed'], 401);
        }
    }

    /**
     * Login User.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request) {
        $user = User::where([
            ['email', '=', $request->email]
        ])->first();

        $pepper = Config::get('hashing.pepper');
        $pwd = $request->password;
        $pwd_peppered = hash_hmac("sha256", $pwd, $pepper);
        $pwd_hashed = $user->password ?? '';

        if (password_verify($pwd_peppered, $pwd_hashed)) {
            $token = Str::random(60);

            $user->forceFill([
                'api_token' => hash('sha256', $token),
                'api_token_expired' => date('Y-m-d H:i:s', strtotime('+1 day')),
            ])->save();

            return response()->json(['token' => $token, 'email' => $user->email], 200);
        } else {
            return response()->json(['message' => 'Wrong Email or Password'], 401);
        }
    }

    /**
     * Reg User.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|max:255|email|unique:users',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $pepper = Config::get('hashing.pepper');
        $pwd = $request->password;
        $pwd_peppered = hash_hmac("sha256", $pwd, $pepper);
        $pwd_hashed = password_hash($pwd_peppered, PASSWORD_DEFAULT);

        $userCreated = new User;
        $userCreated->first_name = $request->first_name;
        $userCreated->last_name = $request->last_name;
        $userCreated->type = 'normal';
        $userCreated->email = $request->email;
        $userCreated->password = $pwd_hashed;
        $userCreated->save();

        return response()->json(['data' => $userCreated], 201);
    }

    /**
     * Logout.
     * @return \Illuminate\Http\Response
     */
    public function logout() {
        $userLogged = resolve('userLogged');

        if ($userLogged) {
            $userLogged->forceFill([
                'api_token' => null,
                'api_token_expired' => null,
            ])->save();
        }
        return response()->json(['message' => 'Logout successfully'], 205);
    }
}