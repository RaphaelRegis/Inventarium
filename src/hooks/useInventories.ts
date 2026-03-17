import { useState, useEffect, useMemo } from 'react';
import { Inventory } from '@/entities/inventories/Inventory';
import * as inventoryActions from '@/app/inventories/actions';
import { AlertType } from '@/components/common/Alert';

export type SortOrder = 'asc' | 'desc';
export type QuantityFilter = 'all' | 'positive' | 'negative' | 'zero';

export function useInventories() {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters and Sorts
    const [searchQuery, setSearchQuery] = useState('');
    const [branchFilter, setBranchFilter] = useState('all');
    const [quantityFilter, setQuantityFilter] = useState<QuantityFilter>('all');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);

    // Alert
    const [alert, setAlert] = useState<{ isVisible: boolean; type: AlertType; message: string }>({
        isVisible: false,
        type: 'success',
        message: ''
    });

    const fetchInventories = async () => {
        setIsLoading(true);
        try {
            const data = await inventoryActions.fetchAllInventories();
            setInventories(data);
        } catch (error) {
            showAlert('error', 'Erro ao carregar estoques.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventories();
    }, []);

    const showAlert = (type: AlertType, message: string) => {
        setAlert({ isVisible: true, type, message });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    const handleDelete = async () => {
        if (!selectedInventory) return;
        
        try {
            await inventoryActions.deleteInventory(selectedInventory.id);
            setInventories(prev => prev.filter(inv => inv.id !== selectedInventory.id));
            showAlert('success', 'Estoque excluído com sucesso!');
        } catch (error: any) {
            showAlert('error', error.message || 'Erro ao excluir o estoque.');
        } finally {
            setIsConfirmModalOpen(false);
            setSelectedInventory(null);
        }
    };

    const handleCreate = async (productId: string, branchIds: string[]) => {
        try {
            await inventoryActions.createInventories(productId, branchIds);
            await fetchInventories();
            showAlert('success', 'Estoque(s) criado(s) com sucesso!');
            setIsFormModalOpen(false);
        } catch (error: any) {
            showAlert('error', error.message || 'Erro ao criar estoque(s).');
        }
    };

    const openCreateModal = () => {
        setIsFormModalOpen(true);
    };

    const openDeleteConfirm = (inventory: Inventory) => {
        setSelectedInventory(inventory);
        setIsConfirmModalOpen(true);
    };

    // Filter, Sort, Pagination Logic
    const filteredInventories = useMemo(() => {
        let result = [...inventories];

        // Search Product Name
        if (searchQuery) {
            result = result.filter(inv => 
                inv.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Branch Filter
        if (branchFilter !== 'all') {
            result = result.filter(inv => inv.branchId === branchFilter);
        }

        // Quantity Filter
        if (quantityFilter !== 'all') {
            if (quantityFilter === 'positive') result = result.filter(inv => inv.quantity > 0);
            else if (quantityFilter === 'negative') result = result.filter(inv => inv.quantity < 0);
            else if (quantityFilter === 'zero') result = result.filter(inv => inv.quantity === 0);
        }

        // Sort by Product Name
        result.sort((a, b) => {
            const nameA = a.product?.name.toLowerCase() || '';
            const nameB = b.product?.name.toLowerCase() || '';
            if (sortOrder === 'asc') return nameA.localeCompare(nameB);
            return nameB.localeCompare(nameA);
        });

        return result;
    }, [inventories, searchQuery, branchFilter, quantityFilter, sortOrder]);

    const totalPages = Math.ceil(filteredInventories.length / itemsPerPage) || 1;
    
    // Reset page if filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, branchFilter, quantityFilter, sortOrder]);

    const paginatedInventories = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredInventories.slice(start, start + itemsPerPage);
    }, [filteredInventories, currentPage]);

    return {
        paginatedInventories,
        isLoading,
        searchQuery, setSearchQuery,
        branchFilter, setBranchFilter,
        quantityFilter, setQuantityFilter,
        sortOrder, setSortOrder,
        currentPage, setCurrentPage,
        totalPages,
        isFormModalOpen, setIsFormModalOpen,
        isConfirmModalOpen, setIsConfirmModalOpen,
        selectedInventory,
        alert, closeAlert,
        openCreateModal,
        openDeleteConfirm,
        handleCreate,
        handleDelete
    };
}
