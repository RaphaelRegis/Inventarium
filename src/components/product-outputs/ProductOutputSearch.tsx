'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/components/product-entries/ProductEntrySearch.module.css'; // Recursively using the exact same style
import { SortOrder } from '@/hooks/useProductOutputs';
import * as branchActions from '@/app/branches/actions';
import { Branch } from '@/entities/branches/Branch';

interface ProductOutputSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    branchFilter: string;
    setBranchFilter: (id: string) => void;
    dateSort: SortOrder;
    setDateSort: (order: SortOrder) => void;
    valueSort: SortOrder | null;
    setValueSort: (order: SortOrder | null) => void;
}

export default function ProductOutputSearch({
    searchQuery,
    setSearchQuery,
    branchFilter,
    setBranchFilter,
    dateSort,
    setDateSort,
    valueSort,
    setValueSort
}: ProductOutputSearchProps) {
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const loadBranches = async () => {
            const data = await branchActions.fetchAllBranches();
            setBranches(data as Branch[]);
        };
        loadBranches();
    }, []);

    const toggleValueSort = () => {
        if (valueSort === null) setValueSort('desc');
        else if (valueSort === 'desc') setValueSort('asc');
        else setValueSort(null);
    };

    return (
        <div className={`${styles.searchbar} glass`}>
            <div className={styles.inputWrapper}>
                <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por cliente ou produto..."
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
                    <label>Data</label>
                    <button
                        className={styles.sortBtn}
                        onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
                        title={`Ordenar ${dateSort === 'asc' ? 'Mais Antigas' : 'Mais Recentes'}`}
                    >
                        {dateSort === 'desc' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                        )}
                        <span>{dateSort === 'desc' ? 'Mais Recentes' : 'Mais Antigas'}</span>
                    </button>
                </div>

                <div className={styles.filterGroup}>
                    <label>Valor</label>
                    <button
                        className={`${styles.sortBtn} ${valueSort === null ? styles.inactive : ''}`}
                        onClick={toggleValueSort}
                        title={`Ordenar por Valor`}
                    >
                        {valueSort === null ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                                <line x1="12" y1="2" x2="12" y2="22"></line>
                            </svg>
                        ) : valueSort === 'desc' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                        )}
                        <span style={valueSort === null ? { opacity: 0.5 } : {}}>
                            {valueSort === null ? 'Padrão' : valueSort === 'desc' ? 'Maior Valor' : 'Menor Valor'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
