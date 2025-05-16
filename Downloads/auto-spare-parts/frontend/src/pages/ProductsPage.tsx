
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import ProductGrid from '../components/products/ProductGrid';
import { Product } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, SlidersHorizontal, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

// Mock products data
const products: Product[] = [
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
    id: 2,
    name: 'Oil Filter Kit',
    nameAr: 'مجموعة فلتر الزيت',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    category: 'filters',
    stock: 30
  },
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
    id: 5,
    name: 'Air Conditioning Compressor',
    nameAr: 'ضاغط تكييف الهواء',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    category: 'engine',
    stock: 0
  },
  {
    id: 6,
    name: 'Universal Floor Mats',
    nameAr: 'دواسات أرضية عالمية',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    category: 'interior',
    stock: 25
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
    id: 8,
    name: 'Windshield Wiper Blades',
    nameAr: 'شفرات مساحات الزجاج الأمامي',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    category: 'body',
    stock: 35
  },
  {
    id: 9,
    name: 'Fuel Pump Assembly',
    nameAr: 'مجموعة مضخة الوقود',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    category: 'engine',
    stock: 7
  },
  {
    id: 10,
    name: 'Shock Absorbers Set',
    nameAr: 'مجموعة ممتصات الصدمات',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    category: 'brakes',
    stock: 10
  },
  {
    id: 11,
    name: 'Car Battery',
    nameAr: 'بطارية السيارة',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    category: 'electrical',
    stock: 15
  },
  {
    id: 12,
    name: 'Cabin Air Filter',
    nameAr: 'فلتر هواء المقصورة',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    category: 'filters',
    stock: 40
  }
];

const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);

  const categories = ['brakes', 'filters', 'electrical', 'engine', 'interior', 'body'];
  const priceRanges = [
    { id: 'price1', range: '0-25', display: '$0 - $25' },
    { id: 'price2', range: '25-50', display: '$25 - $50' },
    { id: 'price3', range: '50-100', display: '$50 - $100' },
    { id: 'price4', range: '100+', display: '$100+' }
  ];

  // Store filter state temporarily for "Apply" functionality
  const [tempCategories, setTempCategories] = useState<string[]>(selectedCategories);
  const [tempPriceRanges, setTempPriceRanges] = useState<string[]>(selectedPriceRanges);
  const [tempStockFilter, setTempStockFilter] = useState<string>(stockFilter);

  // Reset temp filters when main filters change
  useEffect(() => {
    setTempCategories(selectedCategories);
    setTempPriceRanges(selectedPriceRanges);
    setTempStockFilter(stockFilter);
  }, [selectedCategories, selectedPriceRanges, stockFilter]);

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedPriceRanges, stockFilter, sortBy]);

  const handleCategoryChange = (category: string) => {
    setTempCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (range: string) => {
    setTempPriceRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range) 
        : [...prev, range]
    );
  };

  const handleStockFilterChange = (value: string) => {
    setTempStockFilter(value);
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }
    
    // Apply price range filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.price;
        
        return selectedPriceRanges.some(range => {
          if (range === '0-25') return price >= 0 && price <= 25;
          if (range === '25-50') return price > 25 && price <= 50;
          if (range === '50-100') return price > 50 && price <= 100;
          if (range === '100+') return price > 100;
          return false;
        });
      });
    }
    
    // Apply stock filter
    if (stockFilter === 'instock') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (stockFilter === 'outofstock') {
      filtered = filtered.filter(product => product.stock <= 0);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (no change)
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const applyTempFilters = () => {
    setSelectedCategories(tempCategories);
    setSelectedPriceRanges(tempPriceRanges);
    setStockFilter(tempStockFilter);
    setIsMobileFilterOpen(false);
  };

  const clearFilters = () => {
    setTempCategories([]);
    setTempPriceRanges([]);
    setTempStockFilter('all');
  };

  const handleWishlistToggle = (product: Product) => {
    if (wishlistItems.some(item => item.id === product.id)) {
      setWishlistItems(wishlistItems.filter(item => item.id !== product.id));
    } else {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('nav.products')}</h1>
        
        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <Collapsible 
            open={isMobileFilterOpen} 
            onOpenChange={setIsMobileFilterOpen}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter size={16} />
                    {t('product.filters')}
                    {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || stockFilter !== 'all') && (
                      <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {selectedCategories.length + selectedPriceRanges.length + (stockFilter !== 'all' ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setShowWishlist(true)}
                  className="flex items-center gap-1"
                >
                  <Heart size={16} className={wishlistItems.length > 0 ? "text-auto-red fill-auto-red" : ""} />
                  <span className="hidden sm:inline">{t('wishlist.title')}</span>
                  {wishlistItems.length > 0 && (
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('product.sort')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t('product.sortDefault')}</SelectItem>
                    <SelectItem value="price-low-high">{t('product.priceLowHigh')}</SelectItem>
                    <SelectItem value="price-high-low">{t('product.priceHighLow')}</SelectItem>
                    <SelectItem value="name-a-z">{t('product.nameAZ')}</SelectItem>
                    <SelectItem value="name-z-a">{t('product.nameZA')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CollapsibleContent className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  {/* Mobile filters */}
                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h3 className="font-medium mb-2">{t('nav.categories')}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-${category}`} 
                              checked={tempCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={`mobile-${category}`} className="capitalize">
                              {t(`category.${category}`)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price ranges */}
                    <div>
                      <h3 className="font-medium mb-2">{t('product.price')}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {priceRanges.map(range => (
                          <div key={range.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-${range.id}`} 
                              checked={tempPriceRanges.includes(range.range)}
                              onCheckedChange={() => handlePriceRangeChange(range.range)}
                            />
                            <Label htmlFor={`mobile-${range.id}`}>{range.display}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stock filter */}
                    <div>
                      <h3 className="font-medium mb-2">{t('product.quantity')}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="mobile-instock" 
                            checked={tempStockFilter === 'instock'}
                            onCheckedChange={() => handleStockFilterChange(tempStockFilter === 'instock' ? 'all' : 'instock')}
                          />
                          <Label htmlFor="mobile-instock">
                            {t('product.inStock')}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="mobile-outofstock" 
                            checked={tempStockFilter === 'outofstock'}
                            onCheckedChange={() => handleStockFilterChange(tempStockFilter === 'outofstock' ? 'all' : 'outofstock')}
                          />
                          <Label htmlFor="mobile-outofstock">
                            {t('product.outOfStock')}
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearFilters}
                      >
                        {t('product.clearFilters')}
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={applyTempFilters}
                      >
                        {t('product.applyFilters')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop filters sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    {t('product.filters')}
                  </span>
                  {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || stockFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters} 
                      className="text-sm h-auto py-1 px-2"
                    >
                      {t('product.clearFilters')}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sort (Desktop) */}
                <div>
                  <h3 className="font-medium mb-2">{t('product.sort')}</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('product.sort')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">{t('product.sortDefault')}</SelectItem>
                      <SelectItem value="price-low-high">{t('product.priceLowHigh')}</SelectItem>
                      <SelectItem value="price-high-low">{t('product.priceHighLow')}</SelectItem>
                      <SelectItem value="name-a-z">{t('product.nameAZ')}</SelectItem>
                      <SelectItem value="name-z-a">{t('product.nameZA')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-2">{t('nav.categories')}</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={category} 
                          checked={tempCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label htmlFor={category} className="capitalize">{t(`category.${category}`)}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price filter */}
                <div>
                  <h3 className="font-medium mb-2">{t('product.price')}</h3>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <div key={range.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={range.id} 
                          checked={tempPriceRanges.includes(range.range)}
                          onCheckedChange={() => handlePriceRangeChange(range.range)}
                        />
                        <Label htmlFor={range.id}>{range.display}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Availability filter */}
                <div>
                  <h3 className="font-medium mb-2">{t('product.quantity')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="instock" 
                        checked={tempStockFilter === 'instock'}
                        onCheckedChange={() => handleStockFilterChange(tempStockFilter === 'instock' ? 'all' : 'instock')}
                      />
                      <Label htmlFor="instock">{t('product.inStock')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="outofstock" 
                        checked={tempStockFilter === 'outofstock'}
                        onCheckedChange={() => handleStockFilterChange(tempStockFilter === 'outofstock' ? 'all' : 'outofstock')}
                      />
                      <Label htmlFor="outofstock">{t('product.outOfStock')}</Label>
                    </div>
                  </div>
                </div>
                
                {/* Apply filters button */}
                <Button 
                  className="w-full"
                  onClick={applyTempFilters}
                >
                  {t('product.applyFilters')}
                </Button>
                
                {/* Wishlist section in sidebar */}
                <Accordion type="single" collapsible className="mt-6">
                  <AccordionItem value="wishlist">
                    <AccordionTrigger className="font-medium flex items-center gap-2">
                      <Heart size={16} className={wishlistItems.length > 0 ? "text-auto-red fill-auto-red" : ""} />
                      {t('wishlist.title')}
                      {wishlistItems.length > 0 && (
                        <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-auto">
                          {wishlistItems.length}
                        </span>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      {wishlistItems.length === 0 ? (
                        <p className="text-muted-foreground text-sm">{t('wishlist.empty')}</p>
                      ) : (
                        <div className="space-y-4 mt-2">
                          {wishlistItems.map(product => (
                            <div key={product.id} className="flex gap-2">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <Link 
                                  to={`/products/${product.id}`}
                                  className="text-sm font-medium line-clamp-1 hover:text-auto-red"
                                >
                                  {product.name}
                                </Link>
                                <p className="text-sm text-auto-red">${product.price.toFixed(2)}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => removeFromWishlist(product.id)}
                              >
                                <Heart size={16} className="text-auto-red fill-auto-red" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          
          {/* Products grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 hidden lg:block">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground">
                    {t('product.showing')} <span className="font-medium">{filteredProducts.length}</span> {t('product.results')}
                  </p>
                </div>
              </div>
            </div>
            <ProductGrid 
              products={filteredProducts} 
              columns={3}
              wishlistItems={wishlistItems}
              onWishlistToggle={handleWishlistToggle}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile wishlist sheet */}
      <Sheet open={showWishlist} onOpenChange={setShowWishlist}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Heart size={18} className={wishlistItems.length > 0 ? "text-auto-red fill-auto-red" : ""} />
              {t('wishlist.title')} ({wishlistItems.length})
            </SheetTitle>
          </SheetHeader>
          
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground mb-4">{t('wishlist.empty')}</p>
              <Button 
                variant="outline" 
                onClick={() => setShowWishlist(false)}
              >
                {t('wishlist.continueShopping')}
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {wishlistItems.map(product => (
                <div key={product.id} className="flex gap-4 border-b pb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/products/${product.id}`}
                      className="font-medium line-clamp-1 hover:text-auto-red"
                      onClick={() => setShowWishlist(false)}
                    >
                      {product.name}
                    </Link>
                    <p className="text-auto-red font-medium mt-1">${product.price.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs h-8"
                        onClick={() => {
                          addItem(product, 1);
                          toast.success(t('cart.itemAdded'));
                        }}
                      >
                        <ShoppingCart size={14} className="mr-1" />
                        {t('product.addToCart')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-xs h-8"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        {t('wishlist.remove')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full"
                onClick={() => setShowWishlist(false)}
              >
                {t('wishlist.continueShopping')}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default ProductsPage;
