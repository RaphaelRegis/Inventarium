'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/common/Modal';
import * as productActions from '@/app/products/actions';
import { Product } from '@/entities/products/Product';
import ProductForm from '@/components/products/ProductForm';
import styles from '@/components/products/SupplierSelectionModal.module.css'; // Reusing supplier styles as it's structurally the same

interface ProductSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProductId: string | null;
    onSelect: (product: Product) => void;
    supplierFilterId?: string | null;
}

export default function ProductSelectionModal({
    isOpen,
    onClose,
    selectedProductId,
    onSelect,
    supplierFilterId
}: ProductSelectionModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await productActions.fetchAllProducts();
            setProducts(data as Product[]);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadProducts();
        }
    }, [isOpen]);

    const filteredProducts = useMemo(() => {
        let result = products;
        
        if (supplierFilterId) {
            result = result.filter(p => p.suppliers?.some(s => s.id === supplierFilterId));
        }

        return result.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery, supplierFilterId]);

    const handleToggleProduct = (product: Product) => {
        onSelect(product);
    };

    const handleCreateProduct = async (data: any) => {
        try {
            const newProduct = (await productActions.createProduct(data)) as Product;
            setProducts(prev => [...prev, newProduct]);
            onSelect(newProduct);
            setIsCreating(false);
        } catch (error) {
            alert('Erro ao criar produto.');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Produto">
                <div className={styles.container}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.list}>
                        {isLoading ? (
                            <p className={styles.message}>Carregando...</p>
                        ) : filteredProducts.length === 0 ? (
                            <p className={styles.message}>Nenhum produto encontrado.</p>
                        ) : (
                            filteredProducts.map(product => (
                                <label key={product.id} className={styles.item}>
                                    <input
                                        type="radio"
                                        name="selectedProduct"
                                        checked={selectedProductId === product.id}
                                        onChange={() => handleToggleProduct(product)}
                                    />
                                    <span className={styles.name}>{product.name}</span>
                                </label>
                            ))
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            className={styles.addBtn}
                            onClick={() => setIsCreating(true)}
                        >
                            + Novo Produto
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>Concluir</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                title="Novo Produto"
            >
                <ProductForm
                    onSubmit={handleCreateProduct}
                    onCancel={() => setIsCreating(false)}
                />
            </Modal>
        </>
    );
}
