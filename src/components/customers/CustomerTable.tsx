'use client';

import React from 'react';
import { Customer } from '@/entities/customers/Customer';
import styles from './CustomerTable.module.css';

interface CustomerTableProps {
    customers: Customer[];
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete, currentPage, totalPages, onPageChange }: CustomerTableProps) {
    const formatCurrency = (value: any) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(Number(value));
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Endereço</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Dívida</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td className={styles.customerName}>{customer.name}</td>
                                    <td>{customer.address}</td>
                                    <td>{customer.email || '-'}</td>
                                    <td>{customer.phoneNumber || '-'}</td>
                                    <td className={styles.debtValue}>{formatCurrency(customer.debt)}</td>
                                    <td className={styles.actions}>
                                        <button className={styles.editBtn} onClick={() => onEdit(customer)} title="Editar Cliente">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button className={styles.deleteBtn} onClick={() => onDelete(customer)} title="Excluir Cliente">
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
                                <td colSpan={6} className={styles.empty}>Nenhum cliente encontrado.</td>
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
