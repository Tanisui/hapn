<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with('category')->get();
        return response()->json($products);
    }

    public function featured(): JsonResponse
    {
        $products = Product::with('category')->where('is_featured', true)->get();
        return response()->json($products);
    }

    public function deals(): JsonResponse
    {
        $products = Product::with('category')->where('is_deal', true)->get();
        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load('category'));
    }
}
