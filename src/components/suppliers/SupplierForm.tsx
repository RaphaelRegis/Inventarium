'use client';

import React, { useState, useEffect } from 'react';
import { Supplier } from '@/entities/suppliers/Supplier';
import styles from './SupplierForm.module.css';

interface SupplierFormProps {
    supplier?: Supplier; // If provided, it's an edit form
    onSubmit: (data: Partial<Supplier>) => void;
    onCancel: () => void;
}

export default function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
    const [formData, setFormData] = useState<Partial<Supplier>>({
        name: '',
        email: '',
        phoneNumber: '',
        website: '',
        debt: 0
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                email: supplier.email || '',
                phoneNumber: supplier.phoneNumber || '',
                website: supplier.website || '',
                debt: Number(supplier.debt)
            });
        }
    }, [supplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Nome do Fornecedor</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Distribuidora Silva"
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="email">E-mail (opcional)</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="contato@fornecedor.com"
                />
            </div>

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber">Telefone (opcional)</label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber || ''}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="debt">Dívida (R$)</label>
                    <input
                        id="debt"
                        name="debt"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.debt as any}
                        onChange={handleChange}
                        placeholder="0,00"
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="website">Website (opcional)</label>
                <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website || ''}
                    onChange={handleChange}
                    placeholder="https://exemplo.com.br"
                />
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                    {supplier ? 'Salvar Edição' : 'Cadastrar Fornecedor'}
                </button>
            </div>
        </form>
    );
}
