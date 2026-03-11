'use client';

import React from 'react';
import { Supplier } from '@/entities/suppliers/Supplier';
import styles from './SupplierTable.module.css';

interface SupplierTableProps {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onDelete: (supplier: Supplier) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function SupplierTable({ suppliers, onEdit, onDelete, currentPage, totalPages, onPageChange }: SupplierTableProps) {
    const formatCurrency = (value: any) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(Number(value));
    };

    const formatWebsite = (url: string) => {
        if (!url) return null;
        let displayUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
        if (displayUrl.length > 20) displayUrl = displayUrl.substring(0, 17) + '...';

        // Ensure URL has protocol for the anchor tag
        const href = url.startsWith('http') ? url : `https://${url}`;

        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
                title={url}
            >
                {displayUrl}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Website</th>
                            <th>Dívida</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.length > 0 ? (
                            suppliers.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td className={styles.supplierName}>{supplier.name}</td>
                                    <td>{supplier.email || '-'}</td>
                                    <td>{supplier.phoneNumber || '-'}</td>
                                    <td>{supplier.website ? formatWebsite(supplier.website) : '-'}</td>
                                    <td className={styles.debtValue}>{formatCurrency(supplier.debt)}</td>
                                    <td className={styles.actions}>
                                        <button className={styles.editBtn} onClick={() => onEdit(supplier)} title="Editar Fornecedor">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button className={styles.deleteBtn} onClick={() => onDelete(supplier)} title="Excluir Fornecedor">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className={styles.empty}>Nenhum fornecedor encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={styles.pageBtn}
                >
                    &laquo; Anterior
                </button>
                <span className={styles.pageInfo}>
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={styles.pageBtn}
                >
                    Próxima &raquo;
                </button>
            </div>
        </div>
    );
}
