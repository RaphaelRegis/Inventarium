'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/entities/products/Product';
import * as actions from '@/app/products/actions';

export function useProducts(initialProducts: Product[] = []) {
    // Data state
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isLoading, setIsLoading] = useState(false);

    // Search/Sort state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modals state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    // Alert state
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    // Reload data
    const refreshProducts = async () => {
        setIsLoading(true);
        try {
            const data = await actions.fetchAllProducts();
            setProducts(data);
        } catch (e) {
            handleAlert('Erro ao carregar produtos', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    const handleAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type, isVisible: true });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    // Logic for filtering and sorting
    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const query = searchQuery.toLowerCase();
                return product.name.toLowerCase().includes(query);
            })
            .sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (sortOrder === 'asc') return nameA.localeCompare(nameB);
                return nameB.localeCompare(nameA);
            });
    }, [products, searchQuery, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    useEffect(() => {
        // Reset to page 1 when search or sorting changes
        setCurrentPage(1);
    }, [searchQuery, sortOrder]);

    // CRUD handlers
    const handleCreate = async (data: any) => {
        try {
            await actions.createProduct(data);
            handleAlert('Produto cadastrado com sucesso!', 'success');
            setIsFormModalOpen(false);
            refreshProducts();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao cadastrar produto', 'error');
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedProduct) return;
        try {
            await actions.updateProduct(selectedProduct.id, data);
            handleAlert('Produto atualizado com sucesso!', 'success');
            setIsFormModalOpen(false);
            refreshProducts();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao atualizar produto', 'error');
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            await actions.deleteProduct(selectedProduct.id);
            handleAlert('Produto removido com sucesso!', 'success');
            setIsConfirmModalOpen(false);
            refreshProducts();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao excluir produto', 'error');
        }
    };

    const openCreateModal = () => {
        setSelectedProduct(undefined);
        setIsFormModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setIsFormModalOpen(true);
    };

    const openDeleteConfirm = (product: Product) => {
        setSelectedProduct(product);
        setIsConfirmModalOpen(true);
    };

    return {
        // State
        paginatedProducts,
        isLoading,
        searchQuery, setSearchQuery,
        sortOrder, setSortOrder,
        currentPage, setCurrentPage,
        totalPages,
        isFormModalOpen, setIsFormModalOpen,
        isConfirmModalOpen, setIsConfirmModalOpen,
        selectedProduct,
        alert, closeAlert,

        // Actions
        openCreateModal,
        openEditModal,
        openDeleteConfirm,
        handleCreate,
        handleUpdate,
        handleDelete,
        refreshProducts
    };
}
