import { useState, useEffect, useMemo } from 'react';
import { ProductEntry } from '@/entities/product-entries/ProductEntry';
import * as productEntryActions from '@/app/product-entries/actions';
import { CreateProductEntryData } from '@/repositories/product-entries/ProductEntryRepository';
import { AlertType } from '@/components/common/Alert';

export type SortOrder = 'asc' | 'desc';

export function useProductEntries() {
    const [entries, setEntries] = useState<ProductEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters and Sorts
    const [searchQuery, setSearchQuery] = useState('');
    const [branchFilter, setBranchFilter] = useState('all');
    const [dateSort, setDateSort] = useState<SortOrder>('desc'); // Default desc (newest first)
    const [valueSort, setValueSort] = useState<SortOrder | null>(null); // null means not sorting by value
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Adjust for table rows

    // Modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    // Alert
    const [alert, setAlert] = useState<{ isVisible: boolean; type: AlertType; message: string }>({
        isVisible: false,
        type: 'success',
        message: ''
    });

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const data = await productEntryActions.fetchAllProductEntries();
            setEntries(data as ProductEntry[]);
        } catch (error) {
            showAlert('error', 'Erro ao carregar entradas.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const showAlert = (type: AlertType, message: string) => {
        setAlert({ isVisible: true, type, message });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    const handleCreate = async (data: CreateProductEntryData) => {
        try {
            await productEntryActions.createProductEntry(data);
            await fetchEntries();
            showAlert('success', 'Entrada cadastrada com sucesso!');
            setIsFormModalOpen(false);
        } catch (error: any) {
            showAlert('error', error.message || 'Erro ao cadastrar entrada.');
        }
    };

    const openCreateModal = () => {
        setIsFormModalOpen(true);
    };

    // Derived Data for sorting/filtering
    const getEntryTotalValue = (entry: ProductEntry) => {
        return entry.items?.reduce((total, item) => {
            const price = Number(item.product?.purchasePrice || 0);
            return total + (price * item.quantity);
        }, 0) || 0;
    };

    // Filter, Sort, Pagination Logic
    const filteredEntries = useMemo(() => {
        let result = [...entries];

        // Search: any product name OR supplier name
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(entry => 
                entry.supplier?.name.toLowerCase().includes(lowerQuery) ||
                entry.items?.some(item => item.product?.name.toLowerCase().includes(lowerQuery))
            );
        }

        // Branch Filter
        if (branchFilter !== 'all') {
            result = result.filter(entry => entry.branchId === branchFilter);
        }

        // Apply Sorting
        result.sort((a, b) => {
            if (valueSort) {
                const valA = getEntryTotalValue(a);
                const valB = getEntryTotalValue(b);
                if (valA !== valB) {
                    return valueSort === 'asc' ? valA - valB : valB - valA;
                }
            }

            // Always fallback to date sort if value is same or not sorting by value
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [entries, searchQuery, branchFilter, dateSort, valueSort]);

    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, branchFilter, dateSort, valueSort]);

    const paginatedEntries = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredEntries.slice(start, start + itemsPerPage);
    }, [filteredEntries, currentPage]);

    return {
        paginatedEntries,
        isLoading,
        searchQuery, setSearchQuery,
        branchFilter, setBranchFilter,
        dateSort, setDateSort,
        valueSort, setValueSort,
        currentPage, setCurrentPage,
        totalPages,
        isFormModalOpen, setIsFormModalOpen,
        alert, closeAlert,
        openCreateModal,
        handleCreate,
        getEntryTotalValue
    };
}
