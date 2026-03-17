'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/common/Modal';
import * as branchActions from '@/app/branches/actions';
import { Branch } from '@/entities/branches/Branch';
import styles from './SupplierSelectionModal.module.css';

interface BranchSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedBranchIds: string[];
    onSelect: (ids: string[]) => void;
    isEditMode?: boolean;
}

export default function BranchSelectionModal({
    isOpen,
    onClose,
    selectedBranchIds,
    onSelect,
    isEditMode = false
}: BranchSelectionModalProps) {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadBranches = async () => {
        setIsLoading(true);
        try {
            const data = await branchActions.fetchAllBranches();
            setBranches(data as Branch[]);
        } catch (error) {
            console.error('Failed to load branches:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadBranches();
        }
    }, [isOpen]);

    const filteredBranches = useMemo(() => {
        return branches.filter(b =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [branches, searchQuery]);

    const handleToggleBranch = (id: string) => {
        if (selectedBranchIds.includes(id)) {
            // Se estiver no modo de edição, não permite remover a filial (conforme requisito)
            if (isEditMode) return;
            onSelect(selectedBranchIds.filter(bid => bid !== id));
        } else {
            onSelect([...selectedBranchIds, id]);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Filiais de Estoque">
            <div className={styles.container}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Buscar filiais..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.list}>
                    {isLoading ? (
                        <p className={styles.message}>Carregando...</p>
                    ) : filteredBranches.length === 0 ? (
                        <p className={styles.message}>Nenhuma filial encontrada.</p>
                    ) : (
                        filteredBranches.map(branch => {
                            const isSelected = selectedBranchIds.includes(branch.id);
                            return (
                                <label key={branch.id} className={`${styles.item} ${isEditMode && isSelected ? styles.disabled : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleToggleBranch(branch.id)}
                                        disabled={isEditMode && isSelected}
                                    />
                                    <span className={styles.name}>{branch.name}</span>
                                </label>
                            );
                        })
                    )}
                </div>

                <div className={styles.footer}>
                    {isEditMode && <span className={styles.hint} style={{ flexGrow: 1, color: 'var(--text-muted)', fontSize: '0.8rem' }}>* Em modo edição, não é possível remover filiais existentes.</span>}
                    <button className={styles.closeBtn} onClick={onClose} style={{ marginLeft: 'auto' }}>Concluir</button>
                </div>
            </div>
        </Modal>
    );
}
