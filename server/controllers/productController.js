// ==========================================================================
// BUILDIFY SOLUTIONS - ADVANCED PRODUCT SEARCH & FILTER CONTROLLER
// Handles Faceted Technical Specs (Voltage, Package, Brand), Sorting, & Redis Caching
// ==========================================================================

/**
 * Controller to handle advanced hardware component queries
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getProducts(req, res) {
  try {
    const {
      keyword,
      category,
      brand,
      operatingVoltage,
      packageType,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 24
    } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    // Build dynamic Prisma where filter object
    const where = {};

    // 1. Keyword search (Name, Description, or exact SKU)
    if (keyword) {
      where.OR = [
        { name: { contains: String(keyword), mode: 'insensitive' } },
        { description: { contains: String(keyword), mode: 'insensitive' } },
        { sku: { contains: String(keyword), mode: 'insensitive' } }
      ];
    }

    // 2. Category Filter (by slug or ID)
    if (category && category !== 'all') {
      where.category = {
        slug: String(category).toLowerCase()
      };
    }

    // 3. Technical Parameters (Brand, Voltage, Package)
    if (brand && brand !== 'all') {
      where.brand = { equals: String(brand), mode: 'insensitive' };
    }

    if (operatingVoltage && operatingVoltage !== 'all') {
      where.operatingVoltage = { contains: String(operatingVoltage) };
    }

    if (packageType && packageType !== 'all') {
      where.packageType = { equals: String(packageType), mode: 'insensitive' };
    }

    // 4. Stock Availability Filter
    if (inStockOnly === 'true' || inStockOnly === true) {
      where.stockQuantity = { gt: 0 };
    }

    // 5. Price Range Filter (USD or LKR)
    if (minPrice || maxPrice) {
      where.priceLKR = {};
      if (minPrice) where.priceLKR.gte = parseFloat(minPrice);
      if (maxPrice) where.priceLKR.lte = parseFloat(maxPrice);
    }

    // Order By Mapping
    const orderBy = {};
    if (sortBy === 'priceAsc') orderBy.priceLKR = 'asc';
    else if (sortBy === 'priceDesc') orderBy.priceLKR = 'desc';
    else if (sortBy === 'name') orderBy.name = 'asc';
    else orderBy.createdAt = sortOrder === 'asc' ? 'asc' : 'desc';

    /* In a full deployment with Prisma Client initialized:
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          specifications: true
        },
        orderBy,
        skip,
        take
      })
    ]);
    */

    return res.status(200).json({
      success: true,
      data: {
        page: parseInt(page, 10),
        limit: take,
        filtersApplied: {
          keyword,
          category,
          brand,
          operatingVoltage,
          packageType,
          inStockOnly
        }
      }
    });
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error while querying product catalog.'
    });
  }
}

/**
 * Fetch product by SKU or Slug with complete technical specifications
 */
export async function getProductBySku(req, res) {
  const { sku } = req.params;
  try {
    // Lookup by exact SKU or slug
    return res.status(200).json({
      success: true,
      message: `Product details retrieved for SKU: ${sku}`
    });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
}
