import { ProductController } from '@/controllers/diet/product.controller';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/models/Diet';
import { useEffect, useMemo, useState } from 'react';

export const useFoodSearch = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isListVisible, setIsListVisible] = useState(false);


  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const data = await ProductController.getAllProducts(token);
        setProducts(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [token]);

  const filtered = useMemo(() => {
    if (!search || selectedProduct) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products, selectedProduct]);


  const handleSearch = (text: string) => {
    setSearch(text);
    setIsListVisible(text.length > 0);
    if (!text) setSelectedProduct(null);
  };


  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearch(product.name); 
    setIsListVisible(false); 
  };


  const handleClear = () => {
    setSearch('');
    setSelectedProduct(null);
    setIsListVisible(false);
  };

  return {
    search,
    setSearch,
    filtered,
    selectedProduct,
    isListVisible,
    handleSearch,
    handleProductSelect,
    handleClear,
    setIsListVisible, // do obsługi focus/blur
  };
};