import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connectDB();
    if (!connection) {
      // Return demo product when database is not connected
      const demoProduct = {
        _id: params.id,
        name: 'Gamis Syari Elegant',
        description: 'Gamis syari dengan bahan premium dan desain elegan. Cocok untuk acara formal maupun sehari-hari.',
        price: 299000,
        originalPrice: 399000,
        category: 'Gamis',
        subcategory: 'Syari',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Hitam', 'Navy', 'Maroon'],
        images: [
          'https://images.pexels.com/photos/7691483/pexels-photo-7691483.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/7691442/pexels-photo-7691442.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        stock: 25,
        featured: true,
        tags: ['syari', 'elegant', 'premium'],
        rating: 4.8,
        totalReviews: 45,
        reviews: [
          {
            _id: '1',
            user: '1',
            userName: 'Siti Nurhaliza',
            userAvatar: 'https://images.pexels.com/photos/7691476/pexels-photo-7691476.jpeg?auto=compress&cs=tinysrgb&w=150',
            rating: 5,
            comment: 'Kualitas gamis sangat bagus, bahan adem dan jahitan rapi.',
            createdAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return NextResponse.json(demoProduct);
    }

    const product = await Product.findById(params.id).lean();
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const connection = await connectDB();
    if (!connection) {
      return NextResponse.json(
        { error: 'Database not connected' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      subcategory,
      sizes,
      colors,
      images,
      stock,
      featured,
      tags
    } = body;

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        price,
        originalPrice,
        category,
        subcategory,
        sizes: sizes || [],
        colors: colors || [],
        images,
        stock: stock || 0,
        featured: featured || false,
        tags: tags || []
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const connection = await connectDB();
    if (!connection) {
      return NextResponse.json(
        { error: 'Database not connected' },
        { status: 503 }
      );
    }

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
