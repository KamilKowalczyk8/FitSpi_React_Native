import { DietController } from '@/controllers/diet/diet.controller';
import { ProductController } from '@/controllers/diet/product.controller';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/models/Diet';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useAddFood = (date: Date, onSuccess: () => void) => {
  const { token } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [grams, setGrams] = useState('');
  const [mealType, setMealType] = useState(1); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
        if(!token) return;
        try {
            const data = await ProductController.getAllProducts(token);
            setProducts(data);
        } catch (e) {
            console.error(e);
        }
    };
    loadProducts();
  }, [token]);

  const handleSubmit = async () => {
    if (!token || !selectedProduct || !grams) {
        Alert.alert("Błąd", "Wybierz produkt i podaj wagę");
        return;
    }

    setLoading(true);
    try {
        await DietController.addFood(token, {
            productId: selectedProduct.id,
            date: date,
            meal: mealType,
            grams: parseFloat(grams)
        });
        
        Alert.alert("Sukces", "Posiłek dodany");
        onSuccess(); 
        
        setGrams('');
        setSelectedProduct(null);
    } catch (e: any) {
        Alert.alert("Błąd", e.message || "Nie udało się dodać posiłku");
    } finally {
        setLoading(false);
    }
  };

  return {
    products,
    selectedProduct,
    setSelectedProduct,
    grams,
    setGrams,
    mealType,
    setMealType,
    loading,
    handleSubmit
  };
};