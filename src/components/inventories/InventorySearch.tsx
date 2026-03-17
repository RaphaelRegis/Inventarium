'use client';

import React, { useState, useEffect } from 'react';
import styles from './InventorySearch.module.css';
import { SortOrder, QuantityFilter } from '@/hooks/useInventories';
import * as branchActions from '@/app/branches/actions';
import { Branch } from '@/entities/branches/Branch';

interface InventorySearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    branchFilter: string;
    setBranchFilter: (id: string) => void;
    quantityFilter: QuantityFilter;
    setQuantityFilter: (filter: QuantityFilter) => void;
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
}

export default function InventorySearch({
    searchQuery,
    setSearchQuery,
    branchFilter,
    setBranchFilter,
    quantityFilter,
    setQuantityFilter,
    sortOrder,
    setSortOrder
}: InventorySearchProps) {
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const loadBranches = async () => {
            const data = await branchActions.fetchAllBranches();
            setBranches(data as Branch[]);
        };
        loadBranches();
    }, []);

    return (
        <div className={`${styles.searchbar} glass`}>
            <div className={styles.inputWrapper}>
                <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    placeholder="Buscar estoque por produto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.input}
                />
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>Filial</label>
                    <select
                        className={styles.select}
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                    >
                        <option value="all">Todas as Filiais</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Quantidade</label>
                    <select
                        className={styles.select}
                        value={quantityFilter}
                        onChange={(e) => setQuantityFilter(e.target.value as QuantityFilter)}
                    >
                        <option value="all">Tudo</option>
                        <option value="positive">Positivo (&gt; 0)</option>
                        <option value="negative">Negativo (&lt; 0)</option>
                        <option value="zero">Zerado (0)</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Ordem</label>
                    <button
                        className={styles.sortBtn}
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        title={`Ordenar ${sortOrder === 'asc' ? 'Z-A' : 'A-Z'}`}
                    >
                        {sortOrder === 'asc' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M3 12h18M3 18h18" opacity="0.4"/>
                                <path d="M12 4v16M8 8l4-4 4 4"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M3 12h18M3 18h18" opacity="0.4"/>
                                <path d="M12 4v16M8 16l4 4 4-4"/>
                            </svg>
                        )}
                        <span>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
