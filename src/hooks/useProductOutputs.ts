import { useState, useEffect, useMemo } from 'react';
import { ProductOutput } from '@/entities/product-outputs/ProductOutput';
import * as productOutputActions from '@/app/product-outputs/actions';
import { CreateProductOutputData } from '@/repositories/product-outputs/ProductOutputRepository';
import { AlertType } from '@/components/common/Alert';

export type SortOrder = 'asc' | 'desc';

export function useProductOutputs() {
    const [outputs, setOutputs] = useState<ProductOutput[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters and Sorts
    const [searchQuery, setSearchQuery] = useState('');
    const [branchFilter, setBranchFilter] = useState('all');
    const [dateSort, setDateSort] = useState<SortOrder>('desc');
    const [valueSort, setValueSort] = useState<SortOrder | null>(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    // Alert
    const [alert, setAlert] = useState<{ isVisible: boolean; type: AlertType; message: string }>({
        isVisible: false,
        type: 'success',
        message: ''
    });

    const fetchOutputs = async () => {
        setIsLoading(true);
        try {
            const data = await productOutputActions.fetchAllProductOutputs();
            setOutputs(data as ProductOutput[]);
        } catch (error) {
            showAlert('error', 'Erro ao carregar saídas.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOutputs();
    }, []);

    const showAlert = (type: AlertType, message: string) => {
        setAlert({ isVisible: true, type, message });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    const handleCreate = async (data: CreateProductOutputData) => {
        try {
            await productOutputActions.createProductOutput(data);
            await fetchOutputs();
            showAlert('success', 'Saída registrada com sucesso!');
            setIsFormModalOpen(false);
        } catch (error: any) {
            showAlert('error', error.message || 'Erro ao registrar saída de estoque.');
        }
    };

    const openCreateModal = () => {
        setIsFormModalOpen(true);
    };

    // Filter, Sort, Pagination Logic
    const filteredOutputs = useMemo(() => {
        let result = [...outputs];

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(output => 
                output.customer?.name.toLowerCase().includes(lowerQuery) ||
                output.items?.some(item => item.product?.name.toLowerCase().includes(lowerQuery))
            );
        }

        if (branchFilter !== 'all') {
            result = result.filter(output => output.branchId === branchFilter);
        }

        result.sort((a, b) => {
            if (valueSort) {
                const valA = Number(a.totalValue);
                const valB = Number(b.totalValue);
                if (valA !== valB) {
                    return valueSort === 'asc' ? valA - valB : valB - valA;
                }
            }

            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [outputs, searchQuery, branchFilter, dateSort, valueSort]);

    const totalPages = Math.ceil(filteredOutputs.length / itemsPerPage) || 1;
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, branchFilter, dateSort, valueSort]);

    const paginatedOutputs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOutputs.slice(start, start + itemsPerPage);
    }, [filteredOutputs, currentPage]);

    return {
        paginatedOutputs,
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
        handleCreate
    };
}
