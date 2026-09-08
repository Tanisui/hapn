<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HapnSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Apparel', 'slug' => 'apparel', 'image' => '/images/categories/apparel.jpg'],
            ['name' => 'Food & Snacks', 'slug' => 'food-snacks', 'image' => '/images/categories/food.jpg'],
            ['name' => 'Stationery', 'slug' => 'stationery', 'image' => '/images/categories/stationery.jpg'],
            ['name' => 'Crafts', 'slug' => 'crafts', 'image' => '/images/categories/crafts.jpg'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'image' => '/images/categories/accessories.jpg'],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'image' => '/images/categories/home.jpg'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        $products = [
            // Featured products
            ['name' => 'Hand-woven Tote Bag', 'price' => 450, 'original_price' => 599, 'category_id' => 1, 'merchant_name' => 'Davao Weaves', 'is_featured' => true, 'stock' => 25],
            ['name' => 'Dried Mango Pack', 'price' => 180, 'original_price' => 220, 'category_id' => 2, 'merchant_name' => 'Tropik Bites', 'is_featured' => true, 'stock' => 100],
            ['name' => 'Artisan Notebook', 'price' => 250, 'original_price' => 320, 'category_id' => 3, 'merchant_name' => 'Papel Co.', 'is_featured' => true, 'stock' => 50],
            ['name' => 'Durian Candy Box', 'price' => 120, 'original_price' => 150, 'category_id' => 2, 'merchant_name' => 'Davao Delights', 'is_featured' => true, 'stock' => 80],
            ['name' => 'Beaded Bracelet Set', 'price' => 199, 'original_price' => 280, 'category_id' => 5, 'merchant_name' => 'Bead & Thread', 'is_featured' => true, 'stock' => 60],
            ['name' => 'Embroidered Pouch', 'price' => 320, 'original_price' => 400, 'category_id' => 4, 'merchant_name' => 'Stitch Davao', 'is_featured' => true, 'stock' => 30],
            ['name' => 'Tie-Dye Shirt', 'price' => 380, 'original_price' => 499, 'category_id' => 1, 'merchant_name' => 'Dye Lab DVO', 'is_featured' => true, 'stock' => 40],
            ['name' => 'Coconut Oil Soap', 'price' => 95, 'original_price' => 130, 'category_id' => 6, 'merchant_name' => 'Pure Mindanao', 'is_featured' => true, 'stock' => 120],

            // Deals of the day
            ['name' => 'Rattan Earrings', 'price' => 150, 'original_price' => 250, 'category_id' => 5, 'merchant_name' => 'Isla Crafts', 'is_deal' => true, 'stock' => 35],
            ['name' => 'Banana Chips Jar', 'price' => 85, 'original_price' => 120, 'category_id' => 2, 'merchant_name' => 'Chippy South', 'is_deal' => true, 'stock' => 90],
            ['name' => 'Calligraphy Pen Set', 'price' => 310, 'original_price' => 450, 'category_id' => 3, 'merchant_name' => 'Papel Co.', 'is_deal' => true, 'stock' => 20],
            ['name' => 'Macrame Plant Hanger', 'price' => 275, 'original_price' => 400, 'category_id' => 6, 'merchant_name' => 'Knot Studio', 'is_deal' => true, 'stock' => 15],
        ];

        foreach ($products as $prod) {
            $prod['slug'] = Str::slug($prod['name']);
            $prod['image'] = '/images/products/' . $prod['slug'] . '.jpg';
            Product::create($prod);
        }

        $events = [
            [
                'name' => 'Davao Weekend Bazaar',
                'slug' => 'davao-weekend-bazaar',
                'description' => 'A weekend market featuring local MSMEs, food stalls, and live entertainment.',
                'venue' => 'SM Lanang Premier, Davao City',
                'start_date' => '2026-03-15 08:00:00',
                'end_date' => '2026-03-15 20:00:00',
                'discount_percent' => 20,
            ],
            [
                'name' => 'Mindanao Flea Market',
                'slug' => 'mindanao-flea-market',
                'description' => 'Discover unique finds from over 100 local vendors across Mindanao.',
                'venue' => 'Abreeza Mall, Davao City',
                'start_date' => '2026-03-22 09:00:00',
                'end_date' => '2026-03-22 21:00:00',
                'discount_percent' => 15,
            ],
            [
                'name' => 'Kadayawan Craft Fair',
                'slug' => 'kadayawan-craft-fair',
                'description' => 'Celebrate Davao culture with handmade crafts and traditional food.',
                'venue' => 'People\'s Park, Davao City',
                'start_date' => '2026-04-05 10:00:00',
                'end_date' => '2026-04-07 18:00:00',
                'discount_percent' => 30,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
