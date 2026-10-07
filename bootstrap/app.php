<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
// use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->statefulApi();

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! ($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            [$status, $message, $errors] = match (true) {
                $e instanceof ValidationException => [$e->status, 'The given data was invalid.', $e->errors()],
                $e instanceof AuthenticationException => [401, 'Authentication is required. Please log in and try again.', null],
                $e instanceof AccessDeniedHttpException => [403, 'You do not have permission to perform this action.', null],
                $e instanceof NotFoundHttpException => [404, 'The requested resource was not found.', null],
                $e instanceof MethodNotAllowedHttpException => [405, 'This HTTP method is not allowed for this endpoint.', null],
                $e instanceof TooManyRequestsHttpException => [429, 'Too many requests. Please slow down and try again later.', null],
                $e instanceof HttpExceptionInterface => [$e->getStatusCode(), $e->getMessage() ?: 'The request could not be completed.', null],
                default => [500, config('app.debug') ? $e->getMessage() : 'Something went wrong on our side. Please try again later.', null],
            };

            $body = [
                'success' => false,
                'message' => $message,
                'errors' => $errors,
            ];

            // APP_DEBUG=true: keep file path + line (no stack trace).
            if (config('app.debug')) {
                $origin = $e->getPrevious() ?? $e;
                $body['file'] = $origin->getFile();
                $body['line'] = $origin->getLine();
            }

            return response()->json(
                $body,
                $status,
                $e instanceof HttpExceptionInterface ? $e->getHeaders() : [],
            );
        });
    })->create();
