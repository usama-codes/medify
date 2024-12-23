const express = require('express');
const router = express.Router();
const supabase = require('../config/dbconfig'); // Your Supabase client

router.get('/search', async (req, res) => {
    try {
        const { query, filters, sortBy = 'relevance', page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        // Start building the query
        let supabaseQuery = supabase
            .from('medicines')
            .select('*', { count: 'exact' });

        // Apply search term
        if (query) {
            supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
        }

        // Apply filters
        if (filters) {
            const parsedFilters = JSON.parse(filters);

            if (parsedFilters.category) {
                supabaseQuery = supabaseQuery.eq('category', parsedFilters.category);
            }

            if (parsedFilters.priceRange) {
                supabaseQuery = supabaseQuery.gte('price', parsedFilters.priceRange.min)
                    .lte('price', parsedFilters.priceRange.max);
            }

            if (parsedFilters.requirePrescription !== undefined) {
                supabaseQuery = supabaseQuery.eq('require_prescription', parsedFilters.requirePrescription);
            }
        }

        // Sorting
        switch (sortBy) {
            case 'priceLowToHigh':
                supabaseQuery = supabaseQuery.order('price', { ascending: true });
                break;
            case 'priceHighToLow':
                supabaseQuery = supabaseQuery.order('price', { ascending: false });
                break;
            case 'stock':
                supabaseQuery = supabaseQuery.order('stock', { ascending: false });
                break;
            default:
                // Default sorting by name alphabetically
                supabaseQuery = supabaseQuery.order('name', { ascending: true });
                break;
        }

        // Pagination
        supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

        // Execute query
        const { data, count, error } = await supabaseQuery;

        if (error) {
            console.error('Error executing search query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({
            results: data,
            pagination: {
                page,
                limit,
                totalResults: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
