
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import ProductGrid from '../components/products/ProductGrid';
import { Product } from '../contexts/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Filter, Grid3X3, LayoutList, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock categories data
const categories = [
  {
    id: 1,
    name: 'Engine Components',
    nameAr: 'مكونات المحرك',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    slug: 'engine',
    description: 'All parts related to the engine including pistons, crankshafts, and gaskets.',
    descriptionAr: 'جميع الأجزاء المتعلقة بالمحرك بما في ذلك المكابس وعمود المرفق والحشيات.'
  },
  {
    id: 2,
    name: 'Brakes & Suspension',
    nameAr: 'الفرامل والتعليق',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    slug: 'brakes',
    description: 'Brake pads, discs, calipers, shock absorbers, and suspension components.',
    descriptionAr: 'وسادات الفرامل والأقراص والملاقط وممتصات الصدمات ومكونات التعليق.'
  },
  {
    id: 3,
    name: 'Electrical Systems',
    nameAr: 'الأنظمة الكهربائية',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    slug: 'electrical',
    description: 'Batteries, alternators, starters, and all electrical components.',
    descriptionAr: 'البطاريات والمولدات وبادئات التشغيل وجميع المكونات الكهربائية.'
  }
];

// Mock products for categories
const categoryProducts: Record<string, Product[]> = {
  engine: [
    {
      id: 5,
      name: 'Air Conditioning Compressor',
      nameAr: 'ضاغط تكييف الهواء',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      category: 'engine',
      stock: 7
    },
    {
      id: 7,
      name: 'Engine Oil 5W-30',
      nameAr: 'زيت محرك 5W-30',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      category: 'filters',
      stock: 50
    },
    {
      id: 9,
      name: 'Fuel Pump Assembly',
      nameAr: 'مجموعة مضخة الوقود',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      category: 'engine',
      stock: 7
    }
  ],
  brakes: [
    {
      id: 1,
      name: 'Premium Brake Pads',
      nameAr: 'وسادات فرامل متميزة',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      category: 'brakes',
      stock: 15
    },
    {
      id: 10,
      name: 'Shock Absorbers Set',
      nameAr: 'مجموعة ممتصات الصدمات',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
      category: 'brakes',
      stock: 10
    }
  ],
  electrical: [
    {
      id: 3,
      name: 'High-Performance Spark Plugs',
      nameAr: 'شمعات إشعال عالية الأداء',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      category: 'electrical',
      stock: 8
    },
    {
      id: 4,
      name: 'LED Headlight Bulbs',
      nameAr: 'مصابيح أمامية LED',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
      category: 'electrical',
      stock: 12
    },
    {
      id: 11,
      name: 'Car Battery',
      nameAr: 'بطارية السيارة',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      category: 'electrical',
      stock: 15
    }
  ]
};

const CategoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  
  // States for filters and view options
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [availability, setAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  
  // Find the category by slug
  const category = categories.find(c => c.slug === slug);
  
  // Get products for this category
  const products = categoryProducts[slug || ''] || [];
  
  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Apply availability filter
    if (availability.includes('inStock')) {
      result = result.filter(product => product.stock > 0);
    }
    if (availability.includes('outOfStock')) {
      result = result.filter(product => product.stock <= 0);
    }
    
    // Apply price range filter
    if (priceRange === "under50") {
      result = result.filter(product => product.price < 50);
    } else if (priceRange === "50to100") {
      result = result.filter(product => product.price >= 50 && product.price <= 100);
    } else if (priceRange === "over100") {
      result = result.filter(product => product.price > 100);
    }
    
    // Apply sorting
    if (sortBy === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      // Just a placeholder sort since we don't have date in our mock data
      result.sort((a, b) => b.id - a.id);
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, availability, sortBy, slug]);
  
  const handleWishlistToggle = (product: Product) => {
    const exists = wishlistItems.some(item => item.id === product.id);
    if (exists) {
      setWishlistItems(wishlistItems.filter(item => item.id !== product.id));
    } else {
      setWishlistItems([...wishlistItems, product]);
    }
  };
  
  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage, 
    currentPage * productsPerPage
  );
  
  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('category.notFound')}</h1>
          <p>{t('category.notExist')}</p>
        </div>
      </Layout>
    );
  }
  
  const displayName = language === 'ar' && category.nameAr ? category.nameAr : category.name;
  const displayDescription = language === 'ar' && category.descriptionAr ? category.descriptionAr : category.description;

  return (
    <Layout>
      <div className="relative h-64 bg-auto-dark text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={category.image} 
            alt={displayName} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-auto-dark to-transparent opacity-70"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">{displayName}</h1>
            <p className="text-lg max-w-2xl">{displayDescription}</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-4">{t('filters.title')}</h3>
                
                <div className="space-y-6">
                  {/* Price range filter */}
                  <div>
                    <h4 className="font-medium mb-2">{t('filters.priceRange')}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox 
                          id="price-all"
                          checked={priceRange === "all"}
                          onCheckedChange={() => setPriceRange("all")}
                        />
                        <Label htmlFor="price-all">{t('filters.all')}</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox 
                          id="price-under-50"
                          checked={priceRange === "under50"}
                          onCheckedChange={() => setPriceRange("under50")}
                        />
                        <Label htmlFor="price-under-50">{t('filters.under')} $50</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox 
                          id="price-50-100"
                          checked={priceRange === "50to100"}
                          onCheckedChange={() => setPriceRange("50to100")}
                        />
                        <Label htmlFor="price-50-100">$50 - $100</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox 
                          id="price-over-100"
                          checked={priceRange === "over100"}
                          onCheckedChange={() => setPriceRange("over100")}
                        />
                        <Label htmlFor="price-over-100">{t('filters.over')} $100</Label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability filter */}
                  <div>
                    <h4 className="font-medium mb-2">{t('filters.availability')}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox 
                          id="in-stock"
                          checked={availability.includes('inStock')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAvailability([...availability.filter(item => item !== 'outOfStock'), 'inStock']);
                            } else {
                              setAvailability(availability.filter(item => item !== 'inStock'));
                            }
                          }}
                        />
                        <Label htmlFor="in-stock">{t('filters.inStock')}</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox 
                          id="out-of-stock"
                          checked={availability.includes('outOfStock')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAvailability([...availability.filter(item => item !== 'inStock'), 'outOfStock']);
                            } else {
                              setAvailability(availability.filter(item => item !== 'outOfStock'));
                            }
                          }}
                        />
                        <Label htmlFor="out-of-stock">{t('filters.outOfStock')}</Label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Apply filters button */}
                  <Button className="w-full bg-auto-red hover:bg-red-700">
                    {t('filters.apply')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="md:hidden gap-2">
                      <Filter size={16} />
                      {t('filters.title')}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle>{t('filters.title')}</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="price">
                          <AccordionTrigger>{t('filters.priceRange')}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pt-2">
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Checkbox 
                                  id="mobile-price-all"
                                  checked={priceRange === "all"}
                                  onCheckedChange={() => setPriceRange("all")}
                                />
                                <Label htmlFor="mobile-price-all">{t('filters.all')}</Label>
                              </div>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Checkbox 
                                  id="mobile-price-under-50"
                                  checked={priceRange === "under50"}
                                  onCheckedChange={() => setPriceRange("under50")}
                                />
                                <Label htmlFor="mobile-price-under-50">{t('filters.under')} $50</Label>
                              </div>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Checkbox 
                                  id="mobile-price-50-100"
                                  checked={priceRange === "50to100"}
                                  onCheckedChange={() => setPriceRange("50to100")}
                                />
                                <Label htmlFor="mobile-price-50-100">$50 - $100</Label>
                              </div>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Checkbox 
                                  id="mobile-price-over-100"
                                  checked={priceRange === "over100"}
                                  onCheckedChange={() => setPriceRange("over100")}
                                />
                                <Label htmlFor="mobile-price-over-100">{t('filters.over')} $100</Label>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="availability">
                          <AccordionTrigger>{t('filters.availability')}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pt-2">
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Checkbox 
                                  id="mobile-in-stock"
                                  checked={availability.includes('inStock')}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setAvailability([...availability.filter(item => item !== 'outOfStock'), 'inStock']);
                                    } else {
                                      setAvailability(availability.filter(item => item !== 'inStock'));
                                    }
                                  }}
                                />
                                <Label htmlFor="mobile-in-stock">{t('filters.inStock')}</Label>
                              </div>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Checkbox 
                                  id="mobile-out-of-stock"
                                  checked={availability.includes('outOfStock')}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setAvailability([...availability.filter(item => item !== 'inStock'), 'outOfStock']);
                                    } else {
                                      setAvailability(availability.filter(item => item !== 'outOfStock'));
                                    }
                                  }}
                                />
                                <Label htmlFor="mobile-out-of-stock">{t('filters.outOfStock')}</Label>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      
                      {/* Apply filters button */}
                      <Button className="w-full bg-auto-red hover:bg-red-700">
                        {t('filters.apply')}
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
                
                {/* Results count */}
                <p className="text-gray-500">
                  {filteredProducts.length} {t('products.resultsFound')}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm hidden sm:inline">{t('products.sortBy')}:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder={t('products.sortBy')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">{t('products.featured')}</SelectItem>
                      <SelectItem value="newest">{t('products.newest')}</SelectItem>
                      <SelectItem value="priceLow">{t('products.priceLowHigh')}</SelectItem>
                      <SelectItem value="priceHigh">{t('products.priceHighLow')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* View toggles */}
                <div className="hidden sm:flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList size={18} />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Products display */}
            {filteredProducts.length > 0 ? (
              <ProductGrid 
                products={currentProducts} 
                columns={gridColumns}
                wishlistItems={wishlistItems}
                onWishlistToggle={handleWishlistToggle}
              />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <h3 className="text-xl font-medium mb-2">{t('products.noProductsFound')}</h3>
                <p className="text-gray-500">{t('products.tryAdjustingFilters')}</p>
              </div>
            )}
            
            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                          {t('pagination.previous')}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                          {t('pagination.next')}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryDetail;
