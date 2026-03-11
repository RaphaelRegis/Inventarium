'use client';

import React from 'react';
import styles from './SupplierSearch.module.css';

interface SupplierSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortField: 'name' | 'debt';
    setSortField: (field: 'name' | 'debt') => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
}

export default function SupplierSearch({
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder
}: SupplierSearchProps) {
    return (
        <div className={`${styles.searchArea} glass`}>
            <div className={styles.topRow}>
                <div className={styles.searchBar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, e-mail ou telefone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.filtersRow}>
                <div className={styles.filterGroup}>
                    <label>Ordenar por:</label>
                    <select value={sortField} onChange={(e) => setSortField(e.target.value as any)}>
                        <option value="name">Nome</option>
                        <option value="debt">Dívida</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <button
                        className={`${styles.sortBtn} ${styles.active}`}
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {sortOrder === 'asc' ? 'Crescente ↑' : 'Decrescente ↓'}
                    </button>
                </div>
            </div>
        </div>
    );
}
