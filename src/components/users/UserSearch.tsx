'use client';

import React from 'react';
import styles from './UserSearch.module.css';
import { UserRole } from '@/entities/users/User';

interface UserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: UserRole | 'ALL';
  setRoleFilter: (role: UserRole | 'ALL') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  taxFilter: 'ALL' | 'CPF' | 'CNPJ';
  setTaxFilter: (type: 'ALL' | 'CPF' | 'CNPJ') => void;
}

export default function UserSearch({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  sortOrder,
  setSortOrder,
  taxFilter,
  setTaxFilter
}: UserSearchProps) {
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
            placeholder="Pesquisar por nome, e-mail, CPF/CNPJ ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label>Cargo:</label>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}>
            <option value="ALL">Todos os Cargos</option>
            <option value="ADMIN">Administrador</option>
            <option value="STOCKIST">Estoquista</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Tipo (CPF/CNPJ):</label>
          <select value={taxFilter} onChange={(e) => setTaxFilter(e.target.value as any)}>
            <option value="ALL">Todos</option>
            <option value="CPF">CPF</option>
            <option value="CNPJ">CNPJ</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Ordem Alfabética:</label>
          <button 
            className={`${styles.sortBtn} ${sortOrder === 'asc' ? styles.active : ''}`}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? 'A-Z ↑' : 'Z-A ↓'}
          </button>
        </div>
      </div>
    </div>
  );
}
