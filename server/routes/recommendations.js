const { Product } = require('../models/products');
const express = require('express');
const router = express.Router();
const { generateEmbedding, cosineSimilarity } = require('../helper/embeddingHelper');

// GET /api/recommendations/:productId
// Returns products similar to the given product ID
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).send('Product not found');

        // If product doesn't have an embedding, try to generate one on the fly
        let targetEmbedding = product.embedding;
        if (!targetEmbedding || targetEmbedding.length === 0) {
            targetEmbedding = await generateEmbedding(`${product.name} ${product.description}`);
            // Optionally save it back to the product
            product.embedding = targetEmbedding;
            await product.save();
        }

        // Fetch all other products (this can be optimized for large catalogs)
        // For now, we fetch all products that have embeddings
        const allProducts = await Product.find({ 
            _id: { $ne: product._id },
            embedding: { $exists: true, $not: { $size: 0 } }
        });

        // Calculate similarity for each product
        const recommendations = allProducts.map(p => {
            const similarity = cosineSimilarity(targetEmbedding, p.embedding);
            return { product: p, similarity };
        });

        // Sort by similarity descending and take top 10
        const topRecommendations = recommendations
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10)
            .map(r => r.product);

        res.status(200).json(topRecommendations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/recommendations/personal
// Returns recommendations based on a list of recently viewed product IDs
router.post('/personal', async (req, res) => {
    try {
        const { productIds } = req.body;
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(200).json([]);
        }

        // Fetch embeddings for all provided products
        const products = await Product.find({ _id: { $in: productIds } });
        const historyEmbeddings = products.map(p => p.embedding).filter(e => e && e.length > 0);

        if (historyEmbeddings.length === 0) return res.status(200).json([]);

        // Average the embeddings to create a "user profile" vector
        const profileEmbedding = historyEmbeddings[0].map((_, i) => 
            historyEmbeddings.reduce((sum, emb) => sum + emb[i], 0) / historyEmbeddings.length
        );

        // Fetch all other products
        const allProducts = await Product.find({ 
            _id: { $nin: productIds },
            embedding: { $exists: true, $not: { $size: 0 } }
        });

        const recommendations = allProducts.map(p => {
            const similarity = cosineSimilarity(profileEmbedding, p.embedding);
            return { product: p, similarity };
        });

        const topRecommendations = recommendations
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10)
            .map(r => r.product);

        res.status(200).json(topRecommendations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/recommendations/sync
// Utility route to generate embeddings for all products that don't have one
router.post('/sync', async (req, res) => {
    try {
        const products = await Product.find({ 
            $or: [
                { embedding: { $exists: false } },
                { embedding: { $size: 0 } }
            ]
        });

        console.log(`Syncing embeddings for ${products.length} products...`);

        for (const product of products) {
            const text = `${product.name} ${product.description}`;
            const embedding = await generateEmbedding(text);
            if (embedding.length > 0) {
                product.embedding = embedding;
                await product.save();
                console.log(`Generated embedding for: ${product.name}`);
            }
        }

        res.status(200).json({ success: true, message: `Synced ${products.length} products` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
