const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { q: query, category, tag, limit = 10 } = event.queryStringParameters || {};
        
        if (!query || query.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Query must be at least 2 characters long'
                })
            };
        }

        // Read blog posts from content directory
        const blogDir = path.join(process.cwd(), 'content', 'blog');
        const posts = [];

        try {
            const files = fs.readdirSync(blogDir);
            
            for (const file of files) {
                if (file.endsWith('.md')) {
                    const filePath = path.join(blogDir, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Parse front matter
                    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
                    if (frontMatterMatch) {
                        const frontMatter = frontMatterMatch[1];
                        const body = frontMatterMatch[2];
                        
                        // Extract metadata
                        const titleMatch = frontMatter.match(/title:\s*["']([^"']+)["']/);
                        const dateMatch = frontMatter.match(/date:\s*([^\n]+)/);
                        const descriptionMatch = frontMatter.match(/description:\s*["']([^"']+)["']/);
                        const categoriesMatch = frontMatter.match(/categories:\s*\[([^\]]+)\]/);
                        const tagsMatch = frontMatter.match(/tags:\s*\[([^\]]+)\]/);
                        const featuredMatch = frontMatter.match(/featured:\s*(true|false)/);
                        const featuredImageMatch = frontMatter.match(/featured_image:\s*["']([^"']+)["']/);
                        
                        const title = titleMatch ? titleMatch[1] : '';
                        const date = dateMatch ? dateMatch[1] : '';
                        const description = descriptionMatch ? descriptionMatch[1] : '';
                        const categories = categoriesMatch ? 
                            categoriesMatch[1].split(',').map(c => c.trim().replace(/["']/g, '')) : [];
                        const tags = tagsMatch ? 
                            tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, '')) : [];
                        const featured = featuredMatch ? featuredMatch[1] === 'true' : false;
                        const featuredImage = featuredImageMatch ? featuredImageMatch[1] : '';
                        
                        // Create slug from filename
                        const slug = file.replace('.md', '');
                        
                        // Create excerpt from body (first 200 characters)
                        const excerpt = body.replace(/[#*`]/g, '').substring(0, 200).trim() + '...';
                        
                        posts.push({
                            slug,
                            title,
                            date,
                            description,
                            categories,
                            tags,
                            featured,
                            featuredImage,
                            excerpt,
                            content: body
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error reading blog directory:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Error reading blog posts'
                })
            };
        }

        // Filter posts
        let filteredPosts = posts.filter(post => {
            // Text search
            const searchText = query.toLowerCase();
            const titleMatch = post.title.toLowerCase().includes(searchText);
            const descriptionMatch = post.description.toLowerCase().includes(searchText);
            const excerptMatch = post.excerpt.toLowerCase().includes(searchText);
            const contentMatch = post.content.toLowerCase().includes(searchText);
            const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(searchText));
            const categoriesMatch = post.categories.some(cat => cat.toLowerCase().includes(searchText));
            
            const textMatch = titleMatch || descriptionMatch || excerptMatch || contentMatch || tagsMatch || categoriesMatch;
            
            // Category filter
            const categoryMatch = category === 'all' || post.categories.includes(category);
            
            // Tag filter
            const tagMatch = tag === 'all' || post.tags.includes(tag);
            
            return textMatch && categoryMatch && tagMatch;
        });

        // Sort by relevance and date
        filteredPosts.sort((a, b) => {
            const searchText = query.toLowerCase();
            
            // Title matches get highest priority
            const aTitleMatch = a.title.toLowerCase().includes(searchText);
            const bTitleMatch = b.title.toLowerCase().includes(searchText);
            
            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;
            
            // Featured posts get priority
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            
            // Sort by date (newest first)
            return new Date(b.date) - new Date(a.date);
        });

        // Limit results
        const limitedPosts = filteredPosts.slice(0, parseInt(limit));

        // Format results
        const results = limitedPosts.map(post => ({
            slug: post.slug,
            title: post.title,
            date: new Date(post.date).toLocaleDateString('vi-VN'),
            description: post.description,
            excerpt: post.excerpt,
            categories: post.categories,
            tags: post.tags,
            featured: post.featured,
            featuredImage: post.featuredImage,
            url: `/blog/${post.slug}/`
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                results,
                metadata: {
                    query,
                    totalResults: filteredPosts.length,
                    returnedResults: results.length,
                    filters: {
                        category: category || 'all',
                        tag: tag || 'all'
                    }
                }
            })
        };

    } catch (error) {
        console.error('Search error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            })
        };
    }
};